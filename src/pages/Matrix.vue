<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import MatrixFileDialog from '@/components/matrix/MatrixFileDialog.vue';
import { useMatrix } from '@/composables/Matrix';

// provided interfaces
const emit = defineEmits(['error', 'success']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, actions } = useMatrix();
const { t } = useI18n();

const confirm = useConfirm();
const dialog = ref('none');

const matrices = computed(() => state.matrices);

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.error(error);
    });
};

// event handlers
const onNew = () => {
    logger.debug('onNew');
    dialog.value = 'matrixfile';
}
const onClose = () => {
    logger.debug('onClose');

    dialog.value = 'undefined';
    initialize();
}

const onDelete = (matrix) => {
    logger.debug('onDelete');

    confirm.require({
        message: t('Matrix.delete.text'),
        header: t('Matrix.delete.title'),
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
                .delete(matrix)
                .then(() => {
                    onSuccess(t('Matrix.delete.title'), t('Matrix.delete.state.success'));
                })
                .catch((error) => {
                    console.log(error);
                    onError(t('Matrix.delete.title'), t('Matrix.delete.state.error'));
                });
        }
    });

}

const onDownload = (matrix) => {
    logger.debug('onDownload');

    actions.download(matrix).then(() => {
        console.log("finish")
    });
}

const onSuccess = (title, message) => {
    emit('success', title, message);
};

const onError = (title, message) => {
    emit('error', title, message);
};

// hooks
onBeforeMount(() => {
    store.mutations.breadcrumbs([
        {
            label: t('Matrix.matrices', 2),
            disabled: false,
            exact: true,
            route: { name: 'matrix' }
        }
    ]);
    initialize();
});
</script>

<template>
  <Card>
    <template #content>
      <MatrixFileDialog
        :active="dialog === 'matrixfile'"
        @success="onSuccess"
        @error="onError"
        @close:closed="onClose()"
      />

      <DataTable
        :value="matrices"
        data-key="name"
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
          {{ t('Matrix.empty') }}
        </template>
        <template #loading>
          {{ t('Matrix.loading') }}
        </template>

        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">{{ t('Matrix.matrices', 2) }}</span>
            <div class="flex flex-wrap items-end justify-between gap-2">
              <Button
                v-tooltip.bottom="t('Matrix.new')"
                icon="pi pi-plus"
                rounded
                raised
                @click="onNew"
              />
            </div>
          </div>
        </template>

        <Column
          field="name"
          :header="t('Matrix.name')"
        />
        <Column
          field="description"
          :header="t('Matrix.description')"
        />
        <Column
          field="catalogueVersion"
          :header="t('Matrix.catalogueVersion')"
        />
        <Column
          field="hash"
          :header="t('Matrix.hash')"
        />
        <Column :header="t('Matrix.action')">
          <template #body="slotProps">
            <Button
              v-tooltip.bottom="t('Matrix.tooltip.download')"
              variant="text"
              icon="pi pi-file-excel"
              severity="secondary"
              rounded
              @click="onDownload(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Matrix.tooltip.delete')"
              variant="text"
              icon="pi pi-trash"
              severity="secondary"
              rounded
              @click="onDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
