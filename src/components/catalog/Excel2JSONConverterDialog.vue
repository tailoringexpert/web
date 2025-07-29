<script setup>
import { ref, computed, toValue, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { useExcel2JSONConverterDialog } from '@/composables/catalog/Excel2JSONConverterDialog';

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
const { actions } = useExcel2JSONConverterDialog();
const { t } = useI18n();
const confirm = useConfirm();

const active = computed(() => {
    return props.active;
});

const file = ref({});

// event handlers
const onSelect = (event) => {
    file.value = event?.files[0];
};

const onUpload = () => {
    if (!file.value) {
        return;
    }

    let data = new FormData();
    data.append('file', toValue(file.value));

    actions
        .convert(data)
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
    <Dialog :visible="active" :wait :header="t('Excel2JSONConverterDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>

        <div v-if="active" class="flex flex-col gap-1">
            <FileUpload mode="advanced" multiple="false" custom-upload="true" :upload-label="t('Excel2JSONConverterDialog.convert')" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @select="onSelect" @uploader="onUpload">
                <template #empty>
                    <span>{{ t('Excel2JSONConverterDialog.files') }}</span>
                </template>
            </FileUpload>
        </div>
    </Dialog>
</template>
