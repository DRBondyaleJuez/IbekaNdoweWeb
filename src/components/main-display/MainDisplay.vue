<template>
    <div class="main-display">
        <p>MAIN DISPLAY BODY</p>
        <div class="main-display__content">
            <div v-if="modelValue === 'translateWord'">
                <translate-word/>
            </div>
            <div v-else-if="modelValue === 'insertEditWord'">
                <insert-edit-word/>
            </div>
            <div v-else-if="modelValue === 'createEditTranslation'">
                <create-edit-translation/>
            </div>
        </div>
    </div>
</template>
<script>
import TranslateWord from './TranslateWord.vue';
import InsertEditWord from './InsertEditWord.vue';
import CreateEditTranslation from './CreateEditTranslation.vue';

export default {
    name: 'MainDisplay',
    props: {
        modelValue: {
        type: String, // The key of the currently selected tab
        required: true,
        },
    },
    components: {
        TranslateWord,
        InsertEditWord,
        CreateEditTranslation
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>