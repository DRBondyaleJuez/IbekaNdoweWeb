<template>
    <div class="word-field word-field-audio">
        <div class="word-field__label">
            Audio del Término
        </div>
        <div class="word-field__value">
            <input 
                :value="modelValue" 
                class="word__textfield audio__textfield--input"
                placeholder="Introduce url, sube archivo, graba audio ..."
                @input="handleAudioUrlChange"
            />
        </div>
        <div class="word-field__tooltip">
        </div>
        <div class="word-field-audio__icons">
            <input 
                type="file" 
                id="audioFileUpload" 
                @change="handleFileUpload" 
                accept="audio/*" 
                style="display: none;"
            />
            <div 
                class="word-field-audio-icon upload-icon-container"
                @click="triggerFileInput"
            >
                <img class="upload-icon" src="@/assets/static/icons/upload-icon.png">
            </div>
            <div 
                class="word-field-audio-icon record-icon-container"
                :class="{ 'is-recording': isRecording }"
                @click="toggleRecording"
            >
                <img class="record-icon" src="@/assets/static/icons/record-icon.png">
            </div>
        </div>
        <div v-if="statusMessage" class="status-message">
            {{ statusMessage }}
        </div>
    </div>

</template>
<script>
    export default {
        name: 'AudioUploadInputManager',
        data() {
            return {
                statusMessage: "",
                isRecording: false,
                mediaRecorder: null,
                audioChunks: [],
                mediaStream: null, // To hold the stream and stop the mic
                recordedAudioBlob: null,
            };
        },
        props: {
            modelValue: {
                type: String,
                default: ''
            },
            sectionLabel: {
                type: String,
                default: 'word'
            },
        },
        methods: {
            // 1. Method to trigger the hidden file input when the icon is clicked
            triggerFileInput() {
                // Find the hidden input element by its ID
                const fileInput = document.getElementById('audioFileUpload');
                
                // Programmatically click the input to open the file selection dialog
                if (fileInput) {
                    fileInput.click();
                }
            },

            // 2. Method called when a file is selected (due to @change on the input)
            async handleFileUpload(event) {
                const file = event.target.files[0];

                if (file) {
                    // Display a loading state (optional)
                    console.log('File selected:', file.name);

                    try {
                        // IMPORTANT: This API call should go to your SECURE backend endpoint.
                        // The backend handles the secure upload to Cloudinary.
                        const uploadUrl = await this.uploadToCloudinary(file);
                        
                        // 3. Update the v-model with the returned URL
                        if(uploadUrl) {
                            this.$emit('update:modelValue', uploadUrl);
                            this.handleStatusMessage("success");
                        } else {
                            this.handleStatusMessage("error");
                        }
                        

                    } catch (error) {
                        console.error('Upload failed:', error);
                        this.handleStatusMessage("error");
                    }
                }
            },

            // 4. Placeholder for the secure upload logic
            async uploadToCloudinary(audioFile) {
                this.handleStatusMessage("uploading");
                const audioFileFormData = new FormData();
                audioFileFormData.append('file',audioFile);

                const backendEndpoint = '/api/cloudinary/upload-audio-file';

                try {
                    const response = await fetch(backendEndpoint, {
                        method: 'POST',
                        body: audioFileFormData // The browser automatically sets the correct 'Content-Type: multipart/form-data'
                    });
                    debugger;

                    const data = await response.text();

                    if (response.ok) {
                        console.log(`✅ Success! Cloudinary URL: ${data}`);
                        return data;
                    } else {
                        // Note: The back-end should return a clear error message here
                        console.log(`❌ Upload failed (Backend Error): ${data || 'Unknown error'}`);
                        return null;
                    }

                } catch (error) {
                    debugger;
                    console.error(error + '\n'+'❌ Network error or backend is unreachable.');
                    this.handleStatusMessage("error");
                }
            },

            // 5. Placeholder for the audio recording logic
            handleRecordAudio() {
                switch(statusType) {
                    case "recording":
                        this.statusMessage = "🔴 Grabando... Click para detener.";
                        break;
                    case "processing":
                        this.statusMessage = "Procesando y subiendo audio...";
                        break;
                    case "success":
                        this.statusMessage = "✅ Audio subido con éxito.";
                        break;
                    case "uploading":
                        this.statusMessage = "⬆️ Subiendo su audio...";
                        break;
                    case "error":
                        this.statusMessage = "❌ Error! Audio no subido. Intente de nuevo.";
                        break;
                    case "micError":
                        this.statusMessage = "❌ Error al acceder al micrófono. Verifique permisos.";
                        break;
                    case "networkError": // New case for network issues
                        this.statusMessage = "❌ Error de red. El backend no es accesible.";
                        break;
                    default:
                        this.statusMessage = "";
                }
            },
            toggleRecording() {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            },
            async startRecording() {
this.audioChunks = [];
                this.recordedAudioBlob = null;
                this.handleStatusMessage("recording");

                if (!navigator.mediaDevices || !window.MediaRecorder) {
                    this.handleStatusMessage("error");
                    this.statusMessage = "❌ Error: Su navegador no soporta grabación.";
                    return;
                }

                try {
                    // Request access to the microphone and store the stream
                    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    
                    // Use 'audio/webm' with 'opus' codec for better compression/quality and wide support
                    this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: 'audio/webm; codecs=opus' }); 

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            this.audioChunks.push(event.data);
                        }
                    };

                    this.mediaRecorder.onstop = async () => {
                        // 1. Create the Blob from chunks
                        const mimeType = this.mediaRecorder.mimeType;
                        this.recordedAudioBlob = new Blob(this.audioChunks, { type: mimeType }); 
                        
                        // 2. Create a File object for the upload method
                        const recordedFile = new File([this.recordedAudioBlob], `recorded-audio-${Date.now()}.${mimeType.split('/')[1].split(';')[0]}`, { type: mimeType });

                        // 3. Stop the stream tracks (turns off the microphone light)
                        this.mediaStream.getTracks().forEach(track => track.stop());
                        this.mediaStream = null;

                        this.handleStatusMessage("processing");
                        
                        // 4. Call the existing upload method
                        const uploadUrl = await this.uploadToCloudinary(recordedFile);
                        
                        if (uploadUrl) {
                            this.$emit('update:modelValue', uploadUrl);
                            this.handleStatusMessage("success");
                        } else {
                            // uploadToCloudinary will have already set an error message
                        }
                    };

                    this.mediaRecorder.start();
                    this.isRecording = true;
                    this.handleStatusMessage("recording");
                    
                } catch (error) {
                    console.error('Microphone access denied or error:', error);
                    this.isRecording = false; // Ensure state is reset
                    this.handleStatusMessage("micError");
                }
            },

            stopRecording() {
                if (this.mediaRecorder && this.isRecording && this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.stop();
                    this.isRecording = false;
                    // The onstop handler takes over from here to process and upload
                }
            },
            beforeUnmount() {
                // Ensure the microphone is turned off when the component is destroyed
                if (this.mediaStream) {
                    this.mediaStream.getTracks().forEach(track => track.stop());
                }
            }
        }
    }
</script>