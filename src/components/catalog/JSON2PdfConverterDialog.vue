<script setup>
import { ref, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { useJSON2PdfConverterDialog } from '@/composables/catalog/JSON2PdfConverterDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

// injects
const logger = inject('logger');

// internal
const { actions } = useJSON2PdfConverterDialog();
const { t } = useI18n();
const confirm = useConfirm();

const active = computed(() => {
    return props.active;
});

const file = ref({});

// event handlers
const onSelect = (event) => {
    logger.debug('onSelect');
    file.value = event?.files[0];
};

const onUpload = () => {
    if (!file.value) {
        return;
    }

    actions
        .convert(file)
        .then(() => {
            onClose();
        })
        .catch((error) => {
            onError(t('error'), String.fromCharCode.apply(null, new Uint8Array(error)));
        });
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
    <Dialog :header="t('JSON2PdfconverterDialog.title')" :visible="active" :wait :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>

        <div v-if="active" class="flex flex-col gap-1">
            <FileUpload mode="advanced" multiple="false" :upload-label="t('JSON2PdfconverterDialog.convert')" custom-upload="true" accept="application/json" @select="onSelect" @uploader="onUpload">
                <template #empty>
                    <span>{{ t('JSON2PdfconverterDialog.files') }}</span>
                </template>
            </FileUpload>
        </div>
    </Dialog>
</template>
