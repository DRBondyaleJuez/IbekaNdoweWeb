<template>
  <main-header/>
  <example/>
</template>

<script>
import MainHeader from './components/header/MainHeader.vue';
import Example from './components/Example.vue';

export default {
  name: 'App',
  components: {
    Example,
    MainHeader
  }
}
</script>

<style lang="scss">
  @import './assets/styles/scss/main.scss';
</style>
