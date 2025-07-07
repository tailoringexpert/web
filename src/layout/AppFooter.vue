<script setup>
const emit = defineEmits(['open']);
</script>

<template>
    <div class="layout-footer">
        Tailoring by
        <a href="https://www.tailoringexpert.eu" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">TailoringeXpert</a>
        |
        <a target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline" @click="emit('open', 'impressum.html')">Impress</a>
        |
        <a target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline" @click="emit('open', 'dataprotection.html')">Data Protection</a>
    </div>
</template>
