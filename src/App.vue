<template>
  <main-header/>
  <main-menu v-model="activeMenuTab" />
  <main-display v-model="activeMenuTab"/>
  <example/>
  <h1 data-translate-key="welcome_message"></h1>
  <h2 data-translate-key="about_us_title"></h2>
  <button data-translate-key="contact_us_button"></button>
  <p data-translate-key="product_description_1"></p>

  <input type="text" data-translate-placeholder="search_placeholder">
</template>

<script>
import MainHeader from './components/header/MainHeader.vue';
import MainMenu from './components/header/MainMenu.vue';
import MainDisplay from './components/main-display/MainDisplay.vue'
import Example from './components/Example.vue';

export default {
  name: 'App',
  components: {
    Example,
    MainHeader,
    MainMenu,
    MainDisplay
  },
  data() {
    return {
      // Initialize with the default active tab key
      activeMenuTab: 'translateWord',
    }
  }
}
</script>

<style lang="scss">
  @import './assets/styles/scss/main.scss';
</style>
