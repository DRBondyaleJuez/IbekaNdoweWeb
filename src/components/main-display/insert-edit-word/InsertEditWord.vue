<template>
    <div class="insert-edit-word">
        <div class="insert-edit-word__main-top-fields">
            <div class="word-field word-field-language">
                <div class="word-field__label">
                    Idioma
                </div>
                <div class="word-field__value">
                    <LanguageDropdownSelector v-model="wordData.wordLanguage"/>
                </div>
            </div>
            <div class="word-field word-field-text">
                <div class="word-field__label">
                    Término
                </div>
                <div class="word-field__value">
                    <input 
                        v-model="wordData.wordText" 
                        class="word__textfield word__textfield--input"
                        placeholder="Introduce termino..."
                    />
                </div>
            </div>
            <div class="word-field word-field-phonetics">
                <div class="word-field__label">
                    Fonética
                </div>
                <div class="word-field__value">
                    <input 
                        v-model="wordData.wordPhonetic" 
                        class="word__textfield phonetic__textfield--input"
                        placeholder="Introduce fonética del término ..."
                    />
                </div>
                <div class="word-field__tooltip">
                </div>
            </div>
            <AudioUploadInputManager v-model="wordData.wordAudioUrl" :section-label="word"/>
            <div class="word-field word-field-audio">
                <div class="word-field__label">
                    Audio del Término
                </div>
                <div class="word-field__value">
                    <input 
                        v-model="wordData.wordAudioUrl" 
                        class="word__textfield audio__textfield--input"
                        placeholder="Introduce url, sube archivo, graba audio ..."
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
            <hr>
        </div>
        <div class="insert-edit-word__senses-section">
            <h2 class="insert-edit-word__senses-section-title">
                Sentidos
            </h2>
            <div class="insert-edit-word__senses-list">
                <div v-for="(sense,index) in wordData.senseContentFields" :key="sense.id || index" class="insert-edit-word-sense-fields-wrapper">
                    <InsertEditWordSenseFields 
                        :key=sense.id
                        :initial-data="sense"
                        :main-language=wordData.wordLanguage
                        @update-sense="updateSense($event,index)"
                        @remove="removeSense(index)"
                    ></InsertEditWordSenseFields>
                </div>
            </div>
        </div>
        <div class="sense-adding-icon-container">
            <img class="sense-adding-icon" 
                src="../../../assets/static/icons/plus-green-icon.png"
                @click="addSenseFields"
            >
        </div>
        <div class="submit-new-word-content">
            <p class="submit-new-word-content__button"
                @click="submitWordContent()"
            >
                SUBMIT WORD CONTENT
            </p>
            <p ref="submissionResponse" class="submit-new-word-content__submission-response">
                {{ responseMessage }}
            </p>
        </div>
    </div>
</template>
<script>
    import LanguageDropdownSelector from '../../utils/LanguageDropdownSelector.vue';
    import InsertEditWordSenseFields from './InsertEditWordSenseFields.vue';
    import AudioUploadInputManager from './AudioUploadInputManager/AudioUploadInputManager.vue';
    import axios from 'axios';

    export default {
        name: 'InsertEditWord',
        components: {
            LanguageDropdownSelector,
            InsertEditWordSenseFields
        },
        data() {
            return {
                wordData: {
                    wordLanguage: "",
                    wordText:"",
                    wordPhonetic:"",
                    wordAudioUrl:"",
                    senseContentFields: [],
                },
                timeoutId: null,
                responseMessage: "",
                nextSenseId: 0
            };
        },
        watch: {
            'wordData.wordLanguage'(newVal, oldVal) {
                console.log('Parent: wordData.wordLanguage changed from', oldVal, 'to', newVal);
            }
        },
        methods: {
            addSenseFields() {
                this.wordData.senseContentFields.push({
                    id: this.nextSenseId++,
                    lexiconType: "",
                    conceptualDomain: "",
                    definition: "",
                    sentenceExample: "",
                    sentenceExampleAudio: "",
                    senseTranslations: []
                });
            },
            updateSense(updatedData, index) {
                this.wordData.senseContentFields[index] = updatedData;
            },
            removeSense(index) {
                this.wordData.senseContentFields.splice(index, 1);
            },
            submitWordContent(){
                // Clear any existing classes and timeouts before starting a new request
                this.clearResponseClasses();
                const url = "http://localhost:8080/api/upsert-word";

                // Send the POST request using Axios
                axios.post(url, this.wordData)
                .then(response => {
                    // Add the success class
                    this.$refs.submissionResponse.classList.add('submit-new-word-content__submission-response--success');
                    this.responseMessage = 'Successful word submission';
                    console.log('Success:', response.data);
                })
                .catch(error => {
                    // Add the error class
                    this.$refs.submissionResponse.classList.add('submit-new-word-content__submission-response--error');
                    this.responseMessage = 'Error: word submission incorrect. Review fields';
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Set a timeout to clear the classes after 6 seconds
                    this.timeoutId = setTimeout(() => {
                        this.clearResponseClasses();
                        this.responseMessage = '';
                    }, 6000);
                });
            },
            clearResponseClasses() {
                // Clear any existing timeout
                clearTimeout(this.timeoutId);

                // Remove the success and error classes from the element
                const responseElement = this.$refs.submissionResponse;
                if (responseElement) {
                    responseElement.classList.remove('submit-new-word-content__submission-response--success', 'submit-new-word-content__submission-response--error');
                }
            },
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
            }
        }
    }
</script>