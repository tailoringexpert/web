<script setup>
import { ref, computed, toValue, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useImportDialog } from '@/composables/tailoring/ImportDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'success', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    tailoring: {
        type: Object,
        default: null
    }
});

// injects
const logger = inject('logger');

// internal
const { mutations, actions } = useImportDialog();
const { t } = useI18n();
const toast = useToast();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
    }
);

const active = computed(() => {
    return props.active;
});

const file = ref(null);

// event handlers
const onSelect = (event) => {
    logger.debug('onSelect');
    file.value = event?.files[0];
};

const onUpload = () => {
    logger.debug('onUpload');
    if (!file.value) {
        return;
    }

    actions
        .importRequirements(toValue(file))
        .then(() => {
            emit('close:closed');
            onSuccess(t('ImportDialog.title'), t('ImportDialog.state.success'));
        })
        .catch((error) => {
            console.error(error);
            onSuccess(t('ImportDialog.title'), t('ImportDialog.state.error'));
        });
};

const onSuccess = (title, message) => {
    emit('success', title, message);
};

const onError = (title, message) => {
    emit('error', title, message);
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('ImportDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>

        <div v-if="active" class="flex flex-col gap-1">
            <FileUpload mode="advanced" custom-upload="true" :upload-label="t('ImportDialog.upload')" multiple="false" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @select="onSelect" @uploader="onUpload">
                <template #empty>
                    <span>{{ t('ImportDialog.files') }}</span>
                </template>
            </FileUpload>
        </div>
    </Dialog>
</template>
