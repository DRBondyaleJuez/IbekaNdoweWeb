<template>
    <div class="translate-word">
        <div class="translate-word__header">
            <div class="translate-word__header-selectors">
                <div class="translate-word__header-selector translate-word__header-selector--input">
                    <LanguageDropdownSelector v-model="inputLanguage"/>
                </div>
                <div class="translate-word__header-selector translate-word__header-selector--translate">
                    <LanguageDropdownSelector v-model="outputLanguage"/>
                </div>
            </div>
            <div class="translate-word__header-text-input">
                <input 
                    v-model="inputText" 
                    class="translate-word__textfield translate-word__textfield--input"
                    placeholder="Introduce termino para traducir..."
                    @keyup.enter="fetchTranslation"
                />
                <button class="translate-word__translate-button" @click="fetchTranslation" :disabled="loading">
                    {{ loading ? 'Searching...' : 'Search' }}
                </button>
            </div>

        </div>
        <div class="translate-word__content">
            <div v-if="translationEntries" class="input-translation-word-card-list-wrapper">
                <InputTranslationWordCards  v-for="(entry, index) in translationEntries"
                    :key=index
                    :input-word-text=inputWord
                    :input-word-phonetic=inputWordPhonetic
                    :input-word-audio-url=inputWordAudioUrl
                    :input-word-sense-content=entry.inputSenseDetails
                    :translated-word-details=entry.translatedWordDetails
                    :translated-sense-details=entry.translatedSenseDetails
                    @click="selectedWordCard(index)"
                    :class="{ 'word-cards--selected': selectedSensePosition === index }"
                ></InputTranslationWordCards >
            </div>
        </div>
    </div>
</template>
<script>
    import LanguageDropdownSelector from '../utils/LanguageDropdownSelector.vue';
    //import InputWordCard from '../word-card/InputWordCard.vue';
    //import TranslationWordCard from '../word-card/TranslationWordCard.vue';
    import InputTranslationWordCards from '../word-card/InputTranslationWordCards.vue';
   
    export default {
        name: 'TranslateWord',
        components: {
            LanguageDropdownSelector,
            //InputWordCard,
            //TranslationWordCard,
            InputTranslationWordCards
        },
        data() {
            return {
                inputText: "",
                inputLanguage: "",
                outputLanguage: "",
                inputWord: "",
                inputWordPhonetic: "",
                inputWordAudioUrl: "",
                translationEntries: [],
                selectedSensePosition: 0,
                loading: false,
                error: null
            };
        },
        methods: {
            selectedWordCard(newIndex) {
                this.selectedSensePosition = newIndex;
            },
            async fetchTranslation() {
                const translationApi = "/api/translated-word-content";
                const searchedWord = this.inputText;
                const inputLanguage = this.inputLanguage;
                const outputLanguage = this.outputLanguage;
                const requestUrl = translationApi + '?searchedWord=' + searchedWord + '&inputLanguage=' + inputLanguage + '&outputLanguage=' + outputLanguage;

                debugger;
                console.log(requestUrl);
                
                try {
                    const response = await fetch(requestUrl);

                    if (!response.ok) {
                        // If not successful, throw an error with the status
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const translationContent = await response.json();

                    this.inputWord = translationContent.inputWord;
                    this.inputWordPhonetic = translationContent.inputWordPhonetic;
                    this.inputWordAudioUrl = translationContent.inputWordAudioUrl;
                    this.translationEntries = translationContent.translationEntries;

                    console.log("translation content:", translationContent);

                } catch (error) {
                    // Catch any network errors or errors thrown above
                    console.error('Error fetching languages:', error);
                    this.error = `Failed to fetch languages: ${error.message}`;
                }
            }
        }
    }
</script>