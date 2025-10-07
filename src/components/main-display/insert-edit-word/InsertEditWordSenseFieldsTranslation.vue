<template>
    <div class="insert-edit-word-sense-fields-translations-wrapper">
        <div class="translation-removing-icon-container">
            <img class="translation-removing-icon" 
                src="../../../assets/static/icons/minus-red-icon.png"
                @click="$emit('remove')"
            >
        </div>
        <div class="insert-edit-word-sense-fields-translations">
            <details open>
                <summary>
                    <div class="translation-field translation-field-language">
                        <div class="translation-field__label">
                            Idioma
                        </div>
                        <div class="translation-field__value">
                            <LanguageDropdownSelector 
                                v-model="selectedTranslationLanguage"
                                :languages-to-avoid="currentLanguagesToAvoidInSelector"
                                @change="updateSenseFieldsTranslationLanguage"
                            />
                        </div>
                    </div>
                    <div class="chevron-icon-container">
                        <img class="chevron-icon" src="../../../assets/static/icons/yellow-chevron-down-icon.png">
                    </div>
                </summary>
                <div class="details__content">
                    <div class="translation-field translation-field-definition">
                        <div class="translation-field__label">
                            Definición en {{ translationData.translationLanguage}}
                        </div>
                        <div class="translation-field__value">
                            <input 
                                v-model="translationData.definitionTranslation" 
                                class="translation__textfield definición__textfield--input"
                                placeholder="Introduce la definición ..."
                                @input="updateSenseTranslationFields"
                            />
                        </div>
                        <div class="translartion-field__tooltip">
                        </div>
                    </div>
                    <div class="translation-field translation-field-conceptual-domain">
                        <div class="translation-field__label">
                            Ejemplo oración en {{ translationData.translationLanguage }}
                        </div>
                        <div class="translation-field__value">
                            <textarea 
                                v-model="translationData.exampleSentenceTranslation" 
                                class="translation__textfield example-sentence__textfield--input"
                                placeholder="Introduce la oración ..."
                                @input="updateSenseTranslationFields"
                            />
                        </div>
                        <div class="translation-field__tooltip">
                        </div>
                    </div>
                    <div class="translation-field translation-field-sentence-audio">
                        <div class="translation-field__label">
                            Audio de la Oración
                        </div>
                        <div class="translation-field__value">
                            <textarea 
                                v-model="translationData.exampleSentenceTranslationAudio" 
                                class="translation__textfield audio__textfield--input"
                                placeholder="Introduce url, sube archivo, graba audio ..."
                                @input="updateSenseTranslationFields"
                            />
                        </div>
                        <div class="translation-field__tooltip">
                        </div>
                        <div class="translation-field-audio__icons">
                            <div class="translation-field-audio__icon upload-icon-container">
                                <img class="upload-icon" src="../../../assets/static/icons/upload-icon.png">
                            </div>
                            <div class="translation-field-audio__icon record-icon-container">
                                <img class="record-icon" src="../../../assets/static/icons/record-icon.png">
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    </div>
</template>
<script>
    import LanguageDropdownSelector from '../../utils/LanguageDropdownSelector.vue';

    export default {
        name: 'InsertEditWordSenseFieldsTranslation',
        components: {
            LanguageDropdownSelector
        },
        data() {
            return {
                translationData: {...this.initialData},
                selectedTranslationLanguage: ""
            };
        },
        computed: {
            currentLanguagesToAvoidInSelector() {
                debugger;
                return this.alreadySelectedLanguages.filter(language => language !== this.selectedTranslationLanguage)
            }
        },
        props: {
            index: {
                type: String,
                default: ''
            },
            initialData: {
                type: Object,
                default: () => ({
                    translationLanguage: "",
                    definitionTranslation: "",
                    exampleSentenceTranslation: "",
                    exampleSentenceTranslationAudio: ""
                })
            },
            alreadySelectedLanguages: {
                type: Array,
                default: () => []
            },
        },
        methods: {
            updateSenseTranslationFields(){
                this.$emit("update-translation", this.translationData)
            },
            updateSenseFieldsTranslationLanguage(){
                this.translationData.translationLanguage = this.selectedTranslationLanguage;
                this.updateSenseTranslationFields()
            }
        }
    }
</script>