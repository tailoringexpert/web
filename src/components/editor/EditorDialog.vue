<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Editor from 'primevue/editor';

// provided interfaces
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['close:cancel', 'close:save']);

watch(
    () => props.modelValue,
    (value) => {
        text.value = value;
    }
);

const text = ref('');

// injects

// internal
const isActive = computed(() => props.active);
const { t } = useI18n();

// event handlers
const onClose = (payload) => {
    emit('close:cancel', payload);
};

const onSave = (payload) => {
    emit('close:save', text.value);
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('EditorDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
            <Button :label="$t('save')" @click="onSave" />
        </template>

        <div v-if="active" class="flex flex-col gap-1">
            <Editor v-model="text" editor-style="height: 320px" />
        </div>
    </Dialog>
</template>
