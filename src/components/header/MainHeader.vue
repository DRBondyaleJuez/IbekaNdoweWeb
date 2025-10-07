<template>
    <div class="header">
        <div class="header-wrapper">
            <div class="header__logo">
                <img src="../../assets/static/logo/logo1.png">
            </div>
            <div class="header__title">
                <span class="title-translator">TRADUCTOR </span>
                <span class="title-ndowe"> NDOWE</span>
            </div>
            <div class="header__language-dropdown-selector">
                <LanguageDropdownSelector
                    selector-title = "Website Language:"
                    @change = "HandleWebsiteLanguageChange"
                />
            </div>
        </div>
        <div class="header-menu">
        </div>
    </div>
</template>
<script>
    import LanguageDropdownSelector from '../utils/LanguageDropdownSelector.vue';

    export default {
        name: 'MainHeader',
        components: {
            LanguageDropdownSelector
        },
        /*
        props: {
            // modelValue is the standard prop name for components that support v-model
            modelValue: {
            type: String,
            default: ''
            },
            // The list of options to display in the dropdown
            options: {
            type: Array,
            required: true,
            // Default to an empty array to prevent errors if not provided
            default: () => []
            }
        },
        */
        methods: {
            handleWebsiteLanguageChange(event) {
            // Emit an 'update:modelValue' event with the new selected value.
            // This is the standard way to support v-model on custom components.
            //this.$emit('update:modelValue', event.target.value);
            console.log(event);
            }
        }
    };
</script>