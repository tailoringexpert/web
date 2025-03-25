<script setup>
import { ref, computed, inject, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useConfirm } from 'primevue/useconfirm';

import { useScreeningsheetUpload } from '@/composables/screeningsheet/ScreeningsheetUpload';

// provided interfaces
const emit = defineEmits(['screeningsheet:upload', 'error']);

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useScreeningsheetUpload();
const { t } = useI18n();
const confirm = useConfirm();

const screeningsheet = computed(() => state.screeningsheet);
let file = ref();

// event handlers
const onSelect = (event) => {
    file.value = event?.files[0];
};

const onUpload = () => {
    if (!file.value) {
        return;
    }

    actions
        .upload(toValue(file))
        .then((response) => {
            emit('screeningsheet:upload', {
                screeningsheet: response
            });
        })
        .catch((error) => {
            onError(t('error'), error);
        });
};

const onError = (title, message) => {
    emit("error", title, message);
};
// hooks
</script>

<template>
  <FileUpload
    mode="advanced"
    custom-upload="true"
    multiple="false"
    accept="application/pdf"
    @select="onSelect"
    @uploader="onUpload"
  >
    <template #empty>
      <span>{{ t('ScreeningsheetUpload.files') }}</span>
    </template>
  </FileUpload>

  <DataTable
    :value="screeningsheet.parameters"
    data-key="label"
    striped-rows
    scrollable
    scroll-height="400px"
    table-style="min-width: 50rem"
  >
    <template #loading>
      {{ t('ScreeningsheetUpload.loading') }}
    </template>

    <Column
      field="label"
      :header="t('ScreeningsheetUpload.name')"
    />
    <Column
      field="value"
      :header="t('ScreeningsheetUpload.value')"
    />
  </DataTable>
</template>
