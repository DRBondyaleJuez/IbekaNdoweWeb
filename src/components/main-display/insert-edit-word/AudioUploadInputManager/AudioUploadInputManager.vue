<template>
    <div class="word-field word-field-audio">
        <div class="word-field__label">
            Audio del Término
        </div>
        <div class="word-field__value">
            <input 
                v-model="modelValue" 
                class="word__textfield audio__textfield--input"
                placeholder="Introduce url, sube archivo, graba audio ..."
                @change="handleAudioUrlChange"
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
                <img class="upload-icon" src="../../../assets/static/icons/upload-icon.png">
            </div>
            <div class="word-field-audio-icon record-icon-container">
                <img class="record-icon" src="../../../assets/static/icons/record-icon.png">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'AudioUploadInputManager',
        data() {
            return {
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
                        this.wordData.wordAudioUrl = uploadUrl;

                    } catch (error) {
                        console.error('Upload failed:', error);
                        // Handle error (e.g., show an error message to the user)
                    }
                }
            },

            // 4. Placeholder for the secure upload logic
            async uploadToCloudinary(file) {
                // In a secure, production application, you would send the file 
                // to a **backend server** (e.g., Node.js, Python) which then 
                // securely uploads it to Cloudinary using your API keys.

                // --- Mocking the secure upload process ---
                
                // const formData = new FormData();
                // formData.append('file', file);
                
                // const response = await fetch('/api/upload-to-cloudinary', { 
                //     method: 'POST', 
                //     body: formData 
                // });
                
                // if (!response.ok) {
                //     throw new Error('Server upload failed.');
                // }
                
                // const data = await response.json();
                // return data.secure_url; // The URL returned by Cloudinary (via your server)

                // --- Mocking for demonstration ---
                return 'https://res.cloudinary.com/your-account/audio/upload/v123456789/uploaded-audio.mp3';
            },

            // 5. Placeholder for the audio recording logic
            handleRecordAudio() {
                // 1. Request microphone access
                // 2. Start/stop recording
                // 3. Get the recorded audio blob
                // 4. Call `this.uploadToCloudinary(recordedBlob)`
                // 5. Update `this.wordData.wordAudioUrl`
                console.log('Recording audio functionality triggered.');
            },
            handleAudioUrlChange(event) {
                this.$emit('update:modelValue', event.target.value);
            },
        }
    }
</script>