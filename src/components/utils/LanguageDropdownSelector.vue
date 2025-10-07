<template>
    <div class="language-dropdown-selector">
        <div v-if="selectorTitle" class="language-selector__title">
            {{ selectorTitle }}
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
                unfilteredOptions: [],
                options: [],
                fetchError: null
            };
        },
        props: {
            modelValue: {
                type: String,
                default: ''
            },
            selectorTitle: {
                type: String,
                default: ''
            },
            languagesToAvoid: {
                type: Array,
                default: () => []
            }
        },
        created() {
            this.fetchLanguages();
        },
        watch: {
            languagesToAvoid () {
                this.filterAvoidedOptions();
            }
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
                        this.unfilteredOptions = this.options;
                        this.filterAvoidedOptions();
                    } else {
                        console.error("API response was not an array:", languageListRaw);
                        this.fetchError = "Data format incorrect: Expected an array of strings.";
                        this.options = []; // Clear options to prevent rendering issues
                    }

                } catch (error) {
                    // Catch any network errors or errors thrown above
                    console.error('Error fetching languages:', error);
                    this.fetchError = `Failed to fetch languages: ${error.message}`;
                }
            },
            handleSelectionChange(event) {
                this.$emit('update:modelValue', event.target.value);
            },
            filterAvoidedOptions() {
                this.options = this.unfilteredOptions.filter(option => !this.languagesToAvoid.includes(option.value));
            }
        }
    };
</script>