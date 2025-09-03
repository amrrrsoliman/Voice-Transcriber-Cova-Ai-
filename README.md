# Live Voice Transcriber for the Deaf

A beautiful, accessible voice-to-text transcription system optimized for deaf users. This application provides real-time speech transcription with a user-friendly interface designed specifically for accessibility.

## 🌟 Features

### 🎙️ Recording System
- **1-minute maximum recording time** with automatic stop
- **Manual stop button** for early termination
- **Live countdown timer** showing remaining time
- **High-quality audio capture** with noise suppression and echo cancellation
- **Real-time visual feedback** with animated wave indicators

### 🎨 Accessibility-First Design
- **Soft off-white background** for reduced eye strain
- **Dark purple (#4B0082) and black color palette** for high contrast
- **Large, readable fonts** optimized for accessibility
- **Clear visual feedback** for all system states
- **Mobile-responsive design** for all devices

## Requirements

- Python 3.10+
- OpenAI API key (set as environment variable `OPENAI_API_KEY`)
- Install dependencies:


### 📜 Transcription Display
- **Beautiful transcript bubbles** with gradient backgrounds
- **Language detection** with confidence scores
- **Error handling** with friendly, clear messages
- **Real-time status updates** throughout the process

### 🔧 Backend Features
- **Whisper AI integration** for accurate transcription
- **Automatic audio format conversion** (supports WAV, MP3, M4A, FLAC, OGG, WEBM)
- **Robust error handling** with detailed feedback
- **CORS enabled** for cross-origin requests
- **Optimized model loading** (loads once at startup)

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- FFmpeg installed on your system
- Modern web browser with microphone access

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd voice_transcriber
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   & .\venv\Scripts\Activate.ps1
   # On Windows Command Prompt:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## 📱 How to Use

1. **Grant microphone permissions** when prompted by your browser
2. **Click "Start Recording"** to begin capturing audio
3. **Speak clearly** into your microphone
4. **Watch the countdown timer** - recording stops automatically after 1 minute
5. **Click "Stop Recording"** to stop early if needed
6. **View your transcription** in the beautiful text bubble below
7. **Repeat** for additional transcriptions

## 🔧 API Endpoints

### Health Check
- **GET** `/ping`
- Returns: `{"message": "pong"}`

### Transcription
- **POST** `/transcribe`
- **Content-Type:** `multipart/form-data`
- **Field name:** `file` or `audio_file`
- **Supported formats:** WAV, MP3, M4A, FLAC, OGG, WEBM

**Response:**
```json
{
  "text": "Your transcribed text here",
  "transcription": "Your transcribed text here",
  "language": "en",
  "language_probability": 0.95
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "User-friendly error message"
}
```

## 🛠️ Technical Details

### Frontend
- **Pure HTML/CSS/JavaScript** - no external dependencies
- **MediaRecorder API** for browser-based audio recording
- **Fetch API** for asynchronous communication
- **Responsive design** with mobile-first approach
- **Accessibility features** including high contrast and large text

### Backend
- **Flask** web framework
- **Faster Whisper** for speech-to-text transcription
- **FFmpeg** for audio format conversion
- **CORS** enabled for cross-origin requests
- **Error handling** with detailed JSON responses

### Audio Processing
- **Sample rate:** 16kHz (optimized for Whisper)
- **Channels:** Mono
- **Echo cancellation:** Enabled
- **Noise suppression:** Enabled
- **Format:** Automatically converted to WAV for processing

## 📁 Project Structure

```
voice_transcriber/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Frontend interface
├── temp_uploads/         # Temporary audio storage
├── venv/                 # Python virtual environment
└── README.md            # This file
```

## 🎯 Accessibility Features

- **High contrast design** for visual accessibility
- **Large, readable fonts** for users with visual impairments
- **Clear visual feedback** for all system states
- **Keyboard navigation** support
- **Screen reader friendly** with proper ARIA labels
- **Color-blind friendly** design with multiple visual indicators

## 🔍 Troubleshooting

### Microphone Access Issues
- Ensure your browser has permission to access the microphone
- Check that your microphone is working in other applications
- Try refreshing the page and granting permissions again

### Transcription Errors
- Speak clearly and at a normal volume
- Ensure minimal background noise
- Check that your audio file is in a supported format
- Verify the server is running and accessible

### Server Issues
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that FFmpeg is installed on your system
- Verify the virtual environment is activated
- Check the console for error messages

## 🤝 Contributing

This project is designed specifically for accessibility and deaf users. When contributing:

1. Maintain accessibility standards
2. Test with screen readers
3. Ensure high contrast ratios
4. Provide clear error messages
5. Keep the interface simple and intuitive

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for the deaf community** 
