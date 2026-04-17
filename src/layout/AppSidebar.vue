<script setup>
import AppMenu from './AppMenu.vue';

const emit = defineEmits(['help', 'about', "screeningsheet"]);
</script>

<template>
  <div class="layout-sidebar">
    <slot>
      <app-menu
        @help="emit('help')"
        @about="emit('about')"
        @screeningsheet="emit('screeningsheet')"
      />
    </slot>
  </div>
</template>

<style lang="scss" scoped></style>
