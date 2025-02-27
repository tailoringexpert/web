<script setup>
import AppMenu from './AppMenu.vue';

const emit = defineEmits(["help"]);

</script>

<template>
    <div class="layout-sidebar">
        <slot>
            <app-menu @help="emit('help')" @about="emit('about')"/>
        </slot>
    </div>
</template>

<style lang="scss" scoped></style>
