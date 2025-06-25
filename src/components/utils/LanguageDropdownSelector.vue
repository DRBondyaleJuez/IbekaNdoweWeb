<template>
    <div class="language-dropdown-selector">
        <div v-if="selectorTitle" class="language-selector__title">
            {{ this.selectorTitle }}
        </div>
        <select
            id="language-select"
            :value="modelValue"
            @change="handleSelectionChange"
            class="language-selector__select"
        >
            <option disabled value="">Please select one</option>
            <!-- Loop through the options prop to create each dropdown item -->
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>
<script>
    export default {
        name: 'LanguageDropdownSelector',
        data() {
            return {
                viewCount: 0,
                statusMessage: 'Ready to display word.',
                // You could simulate an audio URL here, though in a real app it would likely come from props/API
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Example public audio URL
                options: []
            };
        },
        props: {
            // modelValue is the standard prop name for components that support v-model
            modelValue: {
                type: String,
                default: ''
            },
            selectorTitle: {
                type: String,
                default: ''
            },
        },
         created() {
            this.fetchLanguages();
        },
        methods: {
            async fetchLanguages() {

                const languagesApi = "http://localhost:8080/api/languages";
                
                try {
                    const response = await fetch(languagesApi);

                    if (!response.ok) {
                        // If not successful, throw an error with the status
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const languageListRaw = await response.json();

                    if (Array.isArray(languageListRaw)) {
                        this.options = languageListRaw.map(lang => ({
                            value: lang, 
                            text: lang
                        }));
                    } else {
                        console.error("API response was not an array:", languageListRaw);
                        this.fetchError = "Data format incorrect: Expected an array of strings.";
                        this.options = []; // Clear options to prevent rendering issues
                    }

                    console.log("Fetched Languages:", this.options);

                } catch (error) {
                    // Catch any network errors or errors thrown above
                    console.error('Error fetching languages:', error);
                    this.fetchError = `Failed to fetch languages: ${error.message}`;
                }
            }
        }
    };
</script>