<template>
  <div class="header-menu">
    <div class="header-menu__tabs">
      <h2
        v-for="tab in menuTabs"
        :key="tab.key"
        :class="['menu-tab', { 'menu-tab--active': modelValue === tab.key }]"
        @click="selectTab(tab.key)"
      >
        {{ tab.title }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
    name: 'MainMenu',
  // 1. v-model setup: 'modelValue' as prop, 'update:modelValue' as event
  props: {
    modelValue: {
      type: String, // The key of the currently selected tab
      required: true,
    },
  },
  data() {
    return {
      // 2. Array for menu tabs, with a 'key' for identification
      menuTabs: [
        { key: 'translateWord', title: 'Traducir Palabra' },
        { key: 'insertEditWord', title: 'Insertar/Editar Palabra' },
        { key: 'createEditTranslation', title: 'Crear/Editar Traducción' },
      ],
    };
  },
  methods: {
    // 3. Method to handle tab clicks
    selectTab(key) {
      // Emit the 'update:modelValue' event to update the parent's v-model
      this.$emit('update:modelValue', key);
    },
  },
};
</script>