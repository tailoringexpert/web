<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useI18n } from "vue-i18n";

import {useScreeningsheetUpload} from "@/composables/screeningsheet/ScreeningsheetUpload";

import { mdiFilePdfBox, mdiCloudUpload } from "@mdi/js";

import Wait from "@/components/wait/Wait";

// provided interfaces
const emit = defineEmits(["screeningsheet:upload"]);

// injects
const logger = inject("logger");

// internal
const { state, mutations, actions } = useScreeningsheetUpload();
const { t } = useI18n();

const wait = reactive({
    active: false,
    config: {
        title: "Uploading screeningsheet...",
        icon: mdiFilePdfBox,
    },
});

const headers = ref([
    {
        text: t("name"),
        align: "start",
        sortable: true,
        value: "label",
    },
    {
        text: t("value"),
        sortable: true,
        value: "value",
    },
]);

const screeningsheet = computed(() => state.screeningsheet);
var file = null;

const onSelect = (files) => {
    file = files.target.files[0];
};

// event handlers
const onUpload = () => {
    if (!file) {
        return;
    }

    let data = new FormData();
    data.append("datei", file);

    wait.active = true;
    actions
        .upload(data)
        .then((response) => {
            wait.active = false;
            emit("screeningsheet:upload", {
                screeningsheet: response
            });
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

// hooks
</script>

<template>
  <Wait :wait />

  <v-row
    no-gutters
    justify="center"
    align="center"
  >
    <v-col cols="8">
      <v-file-input
        show-size
        label="File input"
        accept="application/pdf"
        @change="onSelect"
      />
    </v-col>

    <v-col
      cols="4"
      class="pl-2"
    >
      <v-btn
        color="success"
        size="small"
        @click="onUpload"
      >
        Upload
        <v-icon
          :icon="mdiCloudUpload"
          end
        />
      </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="screeningsheet.parameters"
        class="elevation-1"
      />
    </v-col>
  </v-row>
</template>
