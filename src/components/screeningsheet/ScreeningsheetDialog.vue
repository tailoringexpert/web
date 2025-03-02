<script setup>
import { ref, watch, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { useScreeningsheetDialog } from '@/composables/screeningsheet/ScreeningsheetDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    screeningsheet: {
        type: Object,
        default: null
    }
});

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useScreeningsheetDialog();

watch(
    [() => props.screeningsheet, () => props.active],
    () => {
        if (props.active && props.screeningsheet) {
            mutations.screeningsheet(props.screeningsheet);
            initialize();
        }
    },
    { immediate: false }
);

const { t } = useI18n();
const confirm = useConfirm();
const tab = ref(null);

const screeningSheet = computed(() => state.screeningsheet);
const selectionVectorParameter = computed(() => state.selectionvectorParameter);

const initialize = () => {
    actions
        .initialize()
        .then(() => {
            tab.value = null;
        })
        .catch((error) => {
            logger.error(error);
        });
};

// event handlers
const onDownload = () => {
    actions.download().catch((error) => {
        onError(t('error'), error);
    });
};

const onError = (title, message) => {
    emit("error", title, message);
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
  <Dialog
    :visible="active"
    :header="t('ScreeningsheetDialog.title')"
    :modal="true"
    @update:visible="onClose"
  >
    <template #footer>
      <Button
        :label="$t('close')"
        @click="onClose"
      />
    </template>

    <Tabs value="1">
      <TabList>
        <Tab value="1">
          {{ $t('ScreeningsheetDialog.parameter') }}
        </Tab>
        <Tab value="2">
          {{ $t('ScreeningsheetDialog.calculatedSelectionvector') }}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="1">
          <DataTable
            :value="screeningSheet.parameters"
            data-key="label"
            striped-rows
            scrollable
            scroll-height="400px"
            table-style="min-width: 50rem"
          >
            <template #loading>
              {{ t('ScreeningsheetDialog.loading') }}
            </template>

            <Column
              field="label"
              :header="t('ScreeningsheetDialog.name')"
            />
            <Column
              field="value"
              :header="t('ScreeningsheetDialog.value')"
            />
          </DataTable>
        </TabPanel>
        <TabPanel value="2">
          <DataTable
            :value="selectionVectorParameter"
            data-key="label"
            striped-rows
            scrollable
            scroll-height="400px"
            table-style="min-width: 50rem"
          >
            <Column
              field="label"
              :header="t('ScreeningsheetDialog.parameter')"
            />
            <Column
              field="value"
              :header="t('ScreeningsheetDialog.value')"
            />
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>
