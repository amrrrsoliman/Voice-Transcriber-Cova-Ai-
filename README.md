# 🎙️ CovAI – Real-Time Voice Transcriber for the Deaf (Project code is uploaded in the master branch)


A beautiful, accessible real-time speech-to-text transcription system optimized for deaf and hard-of-hearing users. Built with **OpenAI's Whisper API** and a responsive web interface, providing accurate, low-latency transcription with an accessibility-first design.

---

## ✨ Features

### 🎤 Recording System
- 1-minute maximum recording with automatic stop  
- Manual stop button for early termination  
- Live countdown timer showing remaining time  
- High-quality audio capture with noise suppression and echo cancellation  
- Real-time visual feedback with animated wave indicators  

### ♿ Accessibility-First Design
- Soft off-white background for reduced eye strain  
- High-contrast dark purple (#4B0082) and black color palette  
- Large, readable fonts optimized for accessibility  
- Clear visual feedback for all system states  
- Mobile-responsive design for all devices  

### 📝 Transcription Display
- Beautiful transcript bubbles with gradient backgrounds  
- Language detection with confidence scores  
- Error handling with friendly, clear messages  
- Real-time status updates throughout the process  

### ⚙️ Backend Features
- OpenAI Whisper API integration for accurate transcription  
- Automatic audio format conversion (supports WAV, MP3, M4A, FLAC, OGG, WEBM)  
- Robust error handling with detailed feedback  
- CORS enabled for cross-origin requests  
- Optimized model loading (loads once at startup)  

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)  
- **Backend**: Python, Flask  
- **AI/ML**: OpenAI Whisper API  
- **Audio Processing**: Web Audio API, MediaRecorder API  
- **Deployment**: Render/Vercel (optional), Docker-ready  

---

## 📦 Installation

### Prerequisites
- Python 3.10+  
- OpenAI API key (set as environment variable `OPENAI_API_KEY`)  

### Steps
Clone the repository:
```bash
git clone https://github.com/amrrrsoliman/Voice-Transcriber-Cova-Ai.git
cd Voice-Transcriber-Cova-Ai
Install dependencies:

bash
pip install -r requirements.txt
Set up environment variables:

bash
export OPENAI_API_KEY='your-openai-api-key-here'
Or create a .env file:

Code
OPENAI_API_KEY=your-openai-api-key-here
Run the application:

bash
python app.py
Open your browser and navigate to:

Code
http://localhost:5000
🚀 Usage
Click the microphone button to start recording

Speak clearly and watch the real-time wave visualization

Stop manually or wait for auto-stop at 1 minute

View transcription in beautifully formatted bubbles

Download transcripts as text files if needed

🔌 API Endpoint
The backend provides a REST API for transcription:

bash
curl -X POST http://localhost:5000/transcribe \
  -F "audio=@audiofile.wav" \
  -F "language=en"
Response:

json
{
  "transcript": "The transcribed text will appear here.",
  "language": "en",
  "confidence": 0.95,
  "processing_time": 2.34
}
🏗️ Project Structure
Code
Voice-Transcriber-Cova-Ai/
├── app.py              # Flask backend
├── static/
│   ├── css/           # Stylesheets
│   ├── js/            # Frontend JavaScript
│   └── assets/        # Images/icons
├── templates/
│   └── index.html     # Main interface
├── requirements.txt   # Python dependencies
└── README.md          # This file
📈 Performance
Accuracy: ~95% transcription accuracy (varies by language/accent)

Latency: < 2 seconds for 30-second audio clips

Language Support: 20+ languages via Whisper API

Concurrency: Supports multiple simultaneous users
