class VoiceTranscriber {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.audioBlob = null;
        this.recordingTimer = null;
        this.recordingDuration = 5000; // 5 seconds in milliseconds
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.recordBtn = document.getElementById('recordBtn');
        this.audioFileInput = document.getElementById('audioFile');
        this.submitBtn = document.getElementById('submitBtn');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.transcriptionResult = document.getElementById('transcriptionResult');
        this.loadingSpinner = document.getElementById('loadingSpinner');
    }
    
    bindEvents() {
        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.audioFileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.submitBtn.addEventListener('click', () => this.submitAudio());
    }
    
    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }
    
    async startRecording() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });
            
            // Create MediaRecorder with WAV format
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.audioChunks = [];
            
            // Handle data available event
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            // Handle recording stop event
            this.mediaRecorder.onstop = () => {
                // Convert to WAV format blob
                this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.enableSubmit();
                this.updateRecordingStatus('Recording completed! Ready to transcribe.');
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            // Start recording
            this.mediaRecorder.start(100); // Collect data every 100ms
            
            this.isRecording = true;
            this.recordBtn.textContent = '⏹️ Stop Recording';
            this.recordBtn.classList.add('recording');
            this.updateRecordingStatus('Recording... Speak now! (5 seconds)');
            
            // Show countdown timer
            let timeLeft = 5;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    this.updateRecordingStatus(`Recording... Speak now! (${timeLeft} seconds left)`);
                }
            }, 1000);
            
            // Set timer to automatically stop after 5 seconds
            this.recordingTimer = setTimeout(() => {
                if (this.isRecording) {
                    clearInterval(countdownInterval);
                    this.stopRecording();
                }
            }, this.recordingDuration);
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            let errorMessage = 'Could not access microphone.';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No microphone found. Please connect a microphone and try again.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Your browser does not support audio recording. Please try a different browser.';
            }
            
            this.updateRecordingStatus(`Error: ${errorMessage}`);
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            // Clear the timer
            if (this.recordingTimer) {
                clearTimeout(this.recordingTimer);
                this.recordingTimer = null;
            }
            
            // Stop recording
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.recordBtn.textContent = '🎤 Start Recording (5s)';
            this.recordBtn.classList.remove('recording');
            this.updateRecordingStatus('Processing recording...');
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/flac', 'audio/ogg', 'audio/webm'];
            const allowedExtensions = /\.(wav|mp3|m4a|flac|ogg|webm)$/i;
            
            if (!allowedTypes.includes(file.type) && !file.name.match(allowedExtensions)) {
                this.updateRecordingStatus('Error: Please select a valid audio file (WAV, MP3, M4A, FLAC, OGG, or WebM).');
                this.audioFileInput.value = ''; // Clear the input
                return;
            }
            
            // Check file size (limit to 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                this.updateRecordingStatus('Error: File is too large. Please select a file smaller than 50MB.');
                this.audioFileInput.value = ''; // Clear the input
                return;
            }
            
            this.audioBlob = file;
            this.enableSubmit();
            this.updateRecordingStatus(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        }
    }
    
    enableSubmit() {
        this.submitBtn.disabled = false;
    }
    
    updateRecordingStatus(message) {
        this.recordingStatus.textContent = message;
    }
    
    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }
    
    displayTranscription(data) {
        const resultBox = this.transcriptionResult;
        
        if (data.error) {
            resultBox.innerHTML = `
                <div class="result-text" style="color: #dc3545;">
                    <strong>Error:</strong> ${data.error}<br>
                    <em>${data.message}</em>
                </div>
            `;
        } else {
            resultBox.innerHTML = `
                <div class="result-text">${data.transcription}</div>
                <div class="result-info">
                    <strong>Language:</strong> ${data.language} 
                    (${(data.language_probability * 100).toFixed(1)}% confidence)
                </div>
            `;
        }
    }
    
    async submitAudio() {
        if (!this.audioBlob) {
            alert('Please record audio or upload a file first.');
            return;
        }
        
        this.showLoading();
        
        try {
            const formData = new FormData();
            
            // Create a proper filename based on the blob type
            let filename = 'audio.wav';
            if (this.audioBlob instanceof File) {
                filename = this.audioBlob.name;
            }
            
            formData.append('file', this.audioBlob, filename);
            
            const response = await fetch('http://localhost:5000/transcribe', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.displayTranscription(data);
            } else {
                this.displayTranscription({
                    error: 'Transcription Failed',
                    message: data.message || 'An error occurred during transcription.'
                });
            }
            
        } catch (error) {
            console.error('Error submitting audio:', error);
            this.displayTranscription({
                error: 'Connection Error',
                message: 'Could not connect to the transcription service. Please check if the server is running.'
            });
        } finally {
            this.hideLoading();
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceTranscriber();
}); 