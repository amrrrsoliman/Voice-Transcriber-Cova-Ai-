import os
import tempfile
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from faster_whisper import WhisperModel
import ffmpeg

app = Flask(__name__)
CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'temp_uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac', 'ogg', 'webm'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Whisper model once at startup
print("Loading Whisper model...")
model = WhisperModel("base", device="cpu", compute_type="int8")
print("Whisper model loaded successfully!")

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cleanup_temp_file(filepath):
    """Helper function to safely delete temporary audio files."""
    try:
        if filepath and os.path.exists(filepath):
            os.remove(filepath)
            print(f"Cleaned up temporary file: {filepath}")
    except Exception as e:
        print(f"Warning: Could not delete temporary file {filepath}: {str(e)}")

def convert_to_wav(input_path, output_path):
    """Convert audio file to WAV format using ffmpeg."""
    try:
        # Use ffmpeg to convert to WAV format
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, output_path, acodec='pcm_s16le', ar='16000', ac=1)
        ffmpeg.run(stream, overwrite_output=True, quiet=True)
        return True
    except Exception as e:
        print(f"Error converting audio to WAV: {str(e)}")
        return False

def prepare_audio_for_whisper(filepath):
    """Prepare audio file for Whisper by converting to WAV if needed."""
    file_ext = os.path.splitext(filepath)[1].lower()
    
    # If already WAV, return the original path
    if file_ext == '.wav':
        return filepath
    
    # Convert to WAV format
    wav_path = filepath.rsplit('.', 1)[0] + '_converted.wav'
    
    if convert_to_wav(filepath, wav_path):
        # Clean up original file and return WAV path
        cleanup_temp_file(filepath)
        return wav_path
    else:
        # If conversion fails, return original path (Whisper might still work)
        print(f"Warning: Could not convert {filepath} to WAV, using original file")
        return filepath

@app.route('/')
def index():
    """Serve the main page."""
    return render_template('index.html')

@app.route('/ping', methods=['GET'])
def health_check():
    """Health check endpoint that returns 'pong' as JSON."""
    return jsonify({"message": "pong"})

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe endpoint that accepts audio files."""
    filepath = None
    wav_filepath = None
    
    try:
        # Check if file is present in the request (support both 'file' and 'audio_file')
        file = None
        if 'file' in request.files:
            file = request.files['file']
        elif 'audio_file' in request.files:
            file = request.files['audio_file']
        else:
            return jsonify({
                "error": "No audio file provided",
                "message": "Please record or upload an audio file"
            }), 400
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "error": "No audio file selected",
                "message": "Please record or select an audio file"
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                "error": "Audio format not supported",
                "message": f"Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Save the file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Verify file was saved successfully
        if not os.path.exists(filepath):
            return jsonify({
                "error": "File upload failed",
                "message": "Could not save the audio file"
            }), 500
        
        # Convert to WAV format if needed
        wav_filepath = prepare_audio_for_whisper(filepath)
        
        # Transcribe the audio file
        try:
            segments, info = model.transcribe(wav_filepath, beam_size=5)
        except Exception as transcription_error:
            return jsonify({
                "error": "Transcription failed",
                "message": f"Could not transcribe audio: {str(transcription_error)}"
            }), 500
        
        # Extract transcription text
        transcription_text = ""
        for segment in segments:
            transcription_text += segment.text + " "
        
        # Clean up the temporary files
        cleanup_temp_file(filepath)
        if wav_filepath != filepath:  # Only clean up WAV file if it's different
            cleanup_temp_file(wav_filepath)
        
        # Return both 'text' and 'transcription' for compatibility
        return jsonify({
            "text": transcription_text.strip(),
            "transcription": transcription_text.strip(),
            "language": info.language,
            "language_probability": info.language_probability
        }), 200
        
    except Exception as e:
        # Clean up files if they exist
        cleanup_temp_file(filepath)
        if wav_filepath and wav_filepath != filepath:
            cleanup_temp_file(wav_filepath)
        return jsonify({
            "error": "Server error",
            "message": f"An unexpected error occurred: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 