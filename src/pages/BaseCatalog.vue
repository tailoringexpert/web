<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import CompareDialog from '@/components/catalog/CompareDialog.vue';
import Excel2JSONConverterDialog from '@/components/catalog/Excel2JSONConverterDialog.vue';
import JSON2PdfConverterDialog from '@/components/catalog/JSON2PdfConverterDialog.vue';

import { useBaseCatalog } from '@/composables/BaseCatalog';
// provided interfaces
const emit = defineEmits(['error']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, actions } = useBaseCatalog();
const { t } = useI18n();

const confirm = useConfirm();
const dialog = ref('none');

const catalogs = computed(() => state.catalogs);

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.error(error);
    });
};

// event handlers
const onPDF = (item) => {
    logger.debug('onPDF');
    actions.pdf(item).catch((error) => {
        logger.error(error);
        onError(t('BaseCatalog.error.download'), error);
    });
};

const onJSON = (item) => {
    logger.debug('onJSON');
    actions.json(item).catch((error) => {
        logger.error(error);
        onError(t('BaseCatalog.error.download'), error);
    });
};

const onExcel = (item) => {
    logger.debug('onExcel');
    actions.excel(item).catch((error) => {
        logger.error(error);
        onError(t('BaseCatalog.error.download'), error);
    });
};

const onZip = (item) => {
    actions.zip(item).catch((error) => {
        logger.error(error);
        onError(t('BaseCatalog.error.download'), error);
    });
};

const onConvert = () => {
    logger.debug('onConvert');
    dialog.value = 'excel2Json';
};

const onPreview = () => {
    logger.debug('onPreview');
    dialog.value = 'json2pdf';
};

const onCompare = () => {
    logger.debug('onCompare');
    dialog.value = 'compare';
}

const onError = (title, message) => {
    emit('error', title, message);
};

// hooks
onBeforeMount(() => {
    store.mutations.breadcrumbs([
        {
            label: t('BaseCatalog.catalog', 2),
            disabled: false,
            exact: true,
            route: { name: 'basecatalog' }
        }
    ]);
    initialize();
});
</script>

<template>
    <CompareDialog :active="dialog === 'compare'" @success="onSuccess" @error="onError" @close:closed="dialog = 'none'" />

    <Excel2JSONConverterDialog :active="dialog === 'excel2Json'" @success="onSuccess" @error="onError" @close:closed="dialog = 'none'" />

    <JSON2PdfConverterDialog :active="dialog === 'json2pdf'" @success="onSuccess" @error="onError" @close:closed="dialog = 'none'" />

    <Card>
        <template #content>
            <DataTable
                :value="catalogs"
                data-key="version"
                striped-rows
                table-style="min-width: 50rem"
                class="col-span-full"
                paginator
                :rows="10"
                :rows-per-page-options="[10, 15, 20, 25]"
                paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                current-page-report-template="{first} to {last} of {totalRecords}"
            >
                <template #empty>
                    {{ t('BaseCatalog.empty') }}
                </template>
                <template #loading>
                    {{ t('BaseCatalog.loading') }}
                </template>

                <template #header>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xl font-bold">{{ t('BaseCatalog.catalog') }}</span>
                        <div class="flex flex-wrap items-end justify-between gap-2">
                            <Button v-tooltip.bottom="t('BaseCatalog.compare')" icon="pi pi-arrow-right-arrow-left" rounded raised @click="onCompare" />
                            <Button v-tooltip.bottom="t('BaseCatalog.convert')" icon="pi pi-file-import" rounded raised @click="onConvert" />
                            <Button v-tooltip.bottom="t('BaseCatalog.preview')" icon="pi pi-file-export" rounded raised @click="onPreview" />
                        </div>
                    </div>
                </template>

                <Column field="version" :header="t('BaseCatalog.catalog')" />
                <Column field="validFrom" :header="t('BaseCatalog.validFrom')" />
                <Column :header="t('BaseCatalog.action')">
                    <template #body="slotProps">
                        <Button v-tooltip.bottom="t('BaseCatalog.tooltip.downloadPDF')" variant="text" icon="pi pi-file-pdf" severity="secondary" rounded @click="onPDF(slotProps.data)" />
                        <Button v-tooltip.bottom="t('BaseCatalog.tooltip.downloadJSON')" variant="text" icon="pi pi-file" severity="secondary" rounded @click="onJSON(slotProps.data)" />
                        <Button v-tooltip.bottom="t('BaseCatalog.tooltip.downloadExcel')" variant="text" icon="pi pi-file-excel" severity="secondary" rounded @click="onExcel(slotProps.data)" />
                        <Button v-tooltip.bottom="t('BaseCatalog.tooltip.downloadZip')" variant="text" icon="pi pi-folder" severity="secondary" rounded @click="onZip(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>
