<script setup>
import { ref, watch, computed, toValue, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { useAttachmentsDialog } from '@/composables/tailoring/AttachmentsDialog';

// provided interfaces
const emit = defineEmits(['close:closed']);
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
const { state, mutations, actions } = useAttachmentsDialog();

watch(
    [() => props.tailoring, () => props.active],
    () => {
        if (props.active && props.tailoring) {
            mutations.tailoring(props.tailoring);
            initialize();
        }
    },
    { immediate: false }
);

const { t } = useI18n();
const confirm = useConfirm();

const attachments = computed(() => state.attachments);

const file = ref();

const initialize = () => {
    actions.initialize();
};

// event handlers
const onSelect = (event) => {
    file.value = event?.files[0];
};

const onUpload = () => {
    if (!file.value) {
        return;
    }

    let data = new FormData();
    data.append('datei', toValue(file));

    actions.upload(data).then(() => {
        file.value = null;
    });
};

const onDownload = (item) => {
    actions.download(item).then(() => {
        file.value = null;
    });
};

const onDelete = (item) => {
    confirm.require({
        message: t('AttachmentsDialog.delete.text'),
        header: t('AttachmentsDialog.delete.title'),
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: t('no'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('yes'),
            severity: 'danger'
        },
        accept: () => {
            actions
                .delete(item)
                .then(() => {
                    file.value = null;
                    onSuccess(t('AttachmentsDialog.title'), t('AttachmentsDialog.delete.state.success'));
                })
                .catch((error) => {
                    console.log(error);
                    onError(t('AttachmentsDialog.title'), t('AttachmentsDialog.delete.state.error'));
                });
        }
    });
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('AttachmentsDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>

        <FileUpload mode="advanced" custom-upload="true" multiple="false" @select="onSelect" @uploader="onUpload">
            <template #empty>
                <span>{{ t('AttachmentsDialog.files') }}</span>
            </template>
        </FileUpload>

        <DataTable
            :value="attachments"
            data-key="hash"
            striped-rows
            scrollable
            scroll-height="400px"
            table-style="min-width: 50rem"
            paginator
            :rows="10"
            :rows-per-page-options="[10, 15, 20, 25]"
            paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            current-page-report-template="{first} to {last} of {totalRecords}"
        >
            <template #loading>
                {{ t('AttachmentsDialog.loading') }}
            </template>

            <Column :header="t('AttachmentsDialog.file')">
                <template #body="slotProps">
                    <span @click.self="onDownload(slotProps.data.name)">{{ slotProps.data.name }}</span>
                </template>
            </Column>
            <Column field="type" :header="t('AttachmentsDialog.type')" />
            <Column field="hash" :header="t('AttachmentsDialog.checksum')" />
            <Column :header="t('AttachmentsDialog.action')">
                <template #body="slotProps">
                    <Button v-tooltip.bottom="t('AttachmentsDialog.tooltip.download')" variant="text" rounded icon="pi pi-download" severity="secondary" @click="onDownload(slotProps.data)" />
                    <Button v-tooltip.bottom="t('AttachmentsDialog.tooltip.delete')" variant="text" rounded icon="pi pi-trash" severity="secondary" @click="onDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>
