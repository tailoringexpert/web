<script setup>
import { ref, reactive, computed, inject, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useImportDialog } from "@/composables/tailoring/ImportDialog";

import { notifySuccess, warnDialog } from "vuetify3-dialog";
import { mdiUpdate } from "@mdi/js";

import Wait from "@/components/wait/Wait";

// provided interfaces
const emit = defineEmits(["close:closed"]);
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    tailoring: {
        type: Object,
        default: null,
    },
});

// injects
const logger = inject("logger");

// internal
const { mutations, actions } = useImportDialog();
const { t } = useI18n();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
    }
);

const wait = reactive({
    active: false,
    config: {
        title: "Importing requirments...",
        icon: mdiUpdate,
    },
});

const isActive = computed(() => {
    return props.active && !wait.active;
});

const file = ref(null);
const onSelectFile = (files) => {
    file.value = files.target.files[0];
};

// event handlers
const onImport = () => {
    if (!file.value) {
        return;
    }

    var data = new FormData();
    data.append("datei", file.value);

    wait.active = true;

    actions
        .importRequirements(data)
        .then(() => {
            wait.active = false;
            emit("close:closed");
            notifySuccess(t("requirement_import.state.success"), {
                location: "bottom center",
            }).then(() => {});
        })
        .catch((error) => {
            console.error(error);
            warnDialog({
                title: t("error"),
                text: error,
                confirmationText: t("ok"),
            }).then(() => {
                wait.active = false;
            });
        });
};

const onClose = () => {
    emit("close:closed");
};

// hooks
</script>

<template>
  <Wait :wait />

  <v-dialog
    v-model="isActive"
    max-width="75%"
    justify="center"
  >
    <v-card elevation="2">
      <v-card-title>{{ $t("requirement_import.title") }}</v-card-title>
      <v-card-text justify="center">
        <v-row
          no-gutters
          justify="center"
          align="center"
        >
          <v-col cols="8">
            <v-file-input
              show-size
              label="File input"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              @change="onSelectFile"
            />
          </v-col>

          <v-col
            cols="4"
            class="pl-2"
          >
            <v-btn
              color="success"
              size="small"
              @click="onImport"
            >
              {{ $t("upload") }}
              <v-icon
                :icon="mdiCloudUpload"
                end
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          rounded
          variant="text"
          @click="onClose()"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
