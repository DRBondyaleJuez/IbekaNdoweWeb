<template>
    <div class="create-edit-translation">
         <div class="translate-word__section translate-word__section--input">
            <LanguageDropdownSelector/>
            <input v-model="inputText" class="translate-word__textfield translate-word__textfield--input">
            <p>INPUT</p>
        </div>
        <div class="translate-word__section translate-word__section--output">
            <LanguageDropdownSelector/>
            <input v-model="outputText" class="translate-word__textfield translate-word__textfield--output">
            <p>OUTPUT</p>
        </div>
    </div>
</template>
<script>
</script>