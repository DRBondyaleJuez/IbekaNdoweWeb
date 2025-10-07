<template>
    <div class="insert-edit-word-sense-fields-wrapper">
        <div class="sense-removing-icon-container">
            <img class="sense-removing-icon" 
                src="../../../assets/static/icons/minus-red-icon.png"
                @click="$emit('remove')"
            >
        </div>
        <div class="insert-edit-word-sense-fields">
            <details open>
                <summary>
                    <div class="sense-field sense-field-lexicon-type">
                        <div class="sense-field__label">
                            Tipo Léxico
                        </div>
                        <div class="sense-field__value">
                            <select
                                v-model="senseContentFields.lexiconType"
                                class="lexicon-type-selector__select"
                                @change="updateSenseFields"
                            >
                                <option disabled value="">Please select one</option>
                                <option v-for="option in lexiconTypeOptions" :key="option.value" :value="option.value">
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                        <div class="ssense-field__tooltip">
                        </div>
                    </div>
                    <div class="sense-field sense-field-conceptual-domain">
                        <div class="sense-field__label">
                            Dominio Conceptual
                        </div>
                        <div class="sense-field__value">
                            <input 
                                v-model="senseContentFields.conceptualDomain" 
                                class="sense__textfield coneptual-domain__textfield--input"
                                placeholder="Introduce dominio conceptual ..."
                                @input="updateSenseFields"
                            />
                        </div>
                        <div class="sense-field__tooltip">
                        </div>
                    </div>
                    <div class="chevron-icon-container">
                        <img class="chevron-icon" src="../../../assets/static/icons/green-chevron-down-icon.png">
                    </div>
                </summary>
                <div class="details__content">
                    <div class="sense-field sense-field-definition">
                        <div class="sense-field__label">
                            Definición en {{ mainLanguage }}
                        </div>
                        <div class="sense-field__value">
                            <textarea
                                v-model="senseContentFields.definition" 
                                class="sense__textfield definition__textfield--input"
                                placeholder="Introduce la definición ..."
                                @input="updateSenseFields"
                            />
                        </div>
                        <div class="sense-field__tooltip">
                        </div>
                    </div>
                    <div class="sense-field sense-field-sentence-example">
                        <div class="sense-field__label">
                            Ejemplo Oración en {{ mainLanguage }}
                        </div>
                        <div class="sense-field__value">
                            <textarea 
                                v-model="senseContentFields.sentenceExample" 
                                class="sense__textfield sentence-example__textfield--input"
                                placeholder="Introduce un ejemplo de oración ..."
                                @input="updateSenseFields"
                            />
                        </div>
                        <div class="sense-field__tooltip">
                        </div>
                    </div>
                    <div class="sense-field sense-field-sentence-audio">
                        <div class="sense-field__label">
                            Audio de la Oración
                        </div>
                        <div class="sense-field__value">
                            <input 
                                v-model="senseContentFields.sentenceExampleAudio" 
                                class="sense__textfield sentence-example-audio__textfield--input"
                                placeholder="Introduce url, sube archivo, graba audio ..."
                                @input="updateSenseFields"
                            />
                        </div>
                        <div class="sense-field__tooltip">
                        </div>
                        <div class="sense-field-audio__icons">
                            <div class="sense-field-audio__icon upload-icon-container">
                                <img class="upload-icon" src="../../../assets/static/icons/upload-icon.png">
                            </div>
                            <div class="sense-field-audio__icon record-icon-container">
                                <img class="record-icon" src="../../../assets/static/icons/record-icon.png">
                            </div>
                        </div>
                    </div>
                    <hr>
                    <h3 class="insert-edit-word__senses-section-title">
                        Translation
                    </h3>
                    <div class="insert-edit-word-sense__translations-list">
                        <div v-for="(senseTranslation,index) in senseContentFields.senseTranslations" :key="senseTranslation.id || index" class="insert-edit-word-sense-fields-wrapper">
                            <InsertEditWordSenseFieldsTranslation 
                                :key=senseTranslation.id 
                                :main-language=mainLanguage
                                :initial-data="senseTranslation"
                                :already-selected-languages="alreadySelectedLanguages"
                                @update-language-selection="updateAlreadySelectedLanguages(index, $event)"
                                @update-translation="updateTranslation($event, index)"
                                @remove="removeTranslation(index)"
                            ></InsertEditWordSenseFieldsTranslation>
                        </div>
                        <div class="translation-adding-icon-container">
                            <img class="translation-adding-icon" 
                                src="../../../assets/static/icons/plus-yellow-icon.png"
                                @click="addSenseFieldsTranslations"
                            >
                        </div>
                    </div>       

                </div>         
            </details>
        </div>
    </div>
</template>
<script>
    import InsertEditWordSenseFieldsTranslation from './InsertEditWordSenseFieldsTranslation.vue';

    export default {
        name: 'InsertEditWordSenseFields',
        components: {
            InsertEditWordSenseFieldsTranslation
        },
        data() {
            return {
                senseContentFields: {...this.initialData},
                lexiconTypeOptions: [],
                nextSenseTranslationId: 0
            };
        },
        computed: {
            alreadySelectedLanguages() {
                debugger;
                return [
                    this.mainLanguage,
                    ...this.senseContentFields.senseTranslations.map(senseTranslation => senseTranslation.translationLanguage)
                ]
            },
        },
        props: {
            initialData: {
                type: Object,
                default: () => ({
                    id: 0,
                    lexiconType: "",
                    conceptualDomain: "",
                    definition: "",
                    sentenceExample: "",
                    sentenceExampleAudio: "",
                    senseTranslations: []
                })
            },
            mainLanguage: {
                type: String,
                default: ''
            }
        },
        created() {
            this.fetchLexiconType();
        },
        watch: {
            initialData: {
                deep: true,
                handler(newVal) {
                    this.translationData = {...newVal}
                },
            },
        },
        methods: {
            addSenseFieldsTranslations() {
                this.senseContentFields.senseTranslations.push({
                    id: this.nextSenseTranslationId++,
                    translationLanguage: "",
                    definitionTranslation: "",
                    exampleSentenceTranslation: "",
                    exampleSentenceTranslationAudio: ""
                });
            },
            updateSenseFields(){
                this.$emit("update-sense", this.senseContentFields)
            },
            updateTranslation(updatedData, index) {
                this.senseContentFields.senseTranslations[index] = updatedData;
            },
            removeTranslation(index) {
                debugger;
                this.senseContentFields.senseTranslations.splice(index, 1);
                this.alreadySelectedLanguages.splice(index+1, 1);
            },
            async fetchLexiconType() {
                const lexiconTypeApi = "http://localhost:8080/api/lexicon-type";
                
                try {
                    const response = await fetch(lexiconTypeApi);

                    if (!response.ok) {
                        // If not successful, throw an error with the status
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    debugger;
                    const lexiconTypeListRaw = await response.json();

                    if (Array.isArray(lexiconTypeListRaw)) {
                        this.lexiconTypeOptions = lexiconTypeListRaw.map(lexiconType => ({
                            value: lexiconType, 
                            text: lexiconType
                        }));
                    } else {
                        console.error("API response was not an array:", lexiconTypeListRaw);
                        this.fetchError = "Data format incorrect: Expected an array of strings.";
                        this.lexiconTypeOptions = []; // Clear options to prevent rendering issues
                    }
                } catch (error) {
                    // Catch any network errors or errors thrown above
                    console.error('Error fetching lexiconType:', error);
                    this.fetchError = `Failed to fetch lexicontype: ${error.message}`;
                }
            },
        }
    }
</script>