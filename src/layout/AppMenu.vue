<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const emit = defineEmits(["about"]);
const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Projects', icon: 'pi pi-fw pi-list', to: '/project' },
            { label: 'Catalogs', icon: 'pi pi-fw pi-book', to: '/catalog' }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'TailoringeXpert Homepage',
                icon: 'pi pi-fw pi-github',
                url: 'https://www.tailoringexpert.eu',
                target: '_blank'
            },
            {
                    label: 'About',
                    icon: 'pi pi-info',
                    command: () => emit("about")
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" />
            <li v-if="item.separator" class="menu-separator" />
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
