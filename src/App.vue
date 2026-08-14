<script setup>
import api from '@/plugins/api';
import { onBeforeMount, onBeforeUnmount } from 'vue';

const healthCheck = () =>
    api.get(window.location.origin + '/api/actuator/health', {
        headers: {
            'X-Skip-Loading': 'true'
        }
    });

onBeforeMount(() => setInterval(healthCheck, 10 * 60 * 1000));
onBeforeUnmount(() => clearInterval(healthCheck));
</script>

<template>
    <router-view />
</template>

<style scoped></style>
