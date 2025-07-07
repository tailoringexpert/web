<script setup>
import { computed } from 'vue';

import { mdiCloseCircleOutline } from '@mdi/js';

// provided interfaces
const emit = defineEmits(['close:closed']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    html: {
        type: String,
        default: ''
    }
});

// injects

// interal
const isActive = computed(() => props.active);

// event handlers
const onClose = () => {
    emit('close:closed');
};

// hooks
</script>
<template>
    <v-bottom-sheet v-model="isActive">
        <v-card class="overflow-y-auto" max-height="400">
            <v-banner class="justify-end text-h5 font-weight-light" sticky>
                <v-icon :icon="mdiCloseCircleOutline" @click="onClose" />
            </v-banner>

            <v-card-text>
                <v-card-text>
                    <span v-html="$sanitize(html)" />
                </v-card-text>
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
</template>
