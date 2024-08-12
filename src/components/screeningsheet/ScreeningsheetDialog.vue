<script setup>
import { ref, reactive, inject, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useScreeningsheetDialog } from "@/composables/screeningsheet/ScreeningsheetDialog";
import Dialog from "@/layouts/WaitingDialog";

import { mdiUpdate, mdiFilePdfBox } from "@mdi/js";

// provided interfaces
const emit = defineEmits(["close:closed"]);
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    screeningsheet: {
        type: Object,
        default: null,
    },
});

// injects
const logger = inject("logger");

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

const waits = {
    default: {
        title: "Loading screeningsheet data...",
        icon: mdiUpdate,
    },
    download: {
        title: "Downloading PDF",
        icon: mdiFilePdfBox,
    },
};
const wait = reactive({
    active: false,
    config: waits.default,
});

const tab = ref(null);

const screeningSheetHeader = reactive([
    {
        title: t("name"),
        sortable: true,
        value: "label",
    },
    {
        title: t("value"),
        sortable: true,
        value: "value",
    },
]);
const screeningSheet = computed(() => state.screeningsheet);
const selectionVectorHeader = [
    {
        title: t("screeningsheet_parameter"),
        align: "start",
        sortable: true,
        value: "label",
    },
    {
        title: t("value"),
        value: "value",
    },
];
const selectionVectorParameter = computed(() => state.selectionvectorParameter);

const initialize = () => {
    wait.config = waits.default;
    wait.active = true;

    actions
        .initialize()
        .then(() => {
            tab.value = null;
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

// event handlers
const onDownload = () => {
    wait.config = waits.download;
    wait.active = true;

    actions
        .download()
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

const onClose = () => {
    emit("close:closed");
};

// hooks
</script>

<template>
  <Dialog
    :title="$t('screeningsheet')"
    :wait
    :active
  >
    <template #title>
      {{ $t("screeningsheet") }}
      <v-icon
        :icon="mdiFilePdfBox"
        @click="onDownload()"
      />
    </template>

    <template #default>
      <v-tabs v-model="tab">
        <v-tab value="screeningsheet">
          {{ $t("screeningsheet_parameter") }}
        </v-tab>
        <v-tab value="selectionvector">
          {{ $t("selectionvector_calculated") }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="screeningsheet">
          <v-data-table
            :headers="screeningSheetHeader"
            :items="screeningSheet.parameters"
            class="elevation-1"
          />
        </v-window-item>

        <v-window-item value="selectionvector">
          <v-data-table
            :headers="selectionVectorHeader"
            :items="selectionVectorParameter"
            class="elevation-1"
          />
        </v-window-item>
      </v-window>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        rounded
        variant="text"
        @click="onClose()"
      >
        {{ $t("close") }}
      </v-btn>
    </template>
  </Dialog>
</template>

<styles scoped>
</styles>
