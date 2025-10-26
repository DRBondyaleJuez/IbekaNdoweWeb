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
            InsertEditWordSenseFields,
            AudioUploadInputManager
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
            }
        }
    }
</script>