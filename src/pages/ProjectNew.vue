<script setup>
import { ref, reactive, computed, inject, toValue } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";

import { useProjectNew } from "@/composables/ProjectNew";

import { mdiFolderZip } from "@mdi/js";

import { warnDialog } from "vuetify3-dialog";

import Wait from "@/components/wait/Wait";
import CatalogSelection from "@/components/catalog/CatalogSelection";
import ScreeningsheetUpload from "@/components/screeningsheet/ScreeningsheetUpload";
import SelectionVectorEdit from "@/components/selectionvector/SelectionVectorEdit";
import SelectionVectorComparison from "@/components/selectionvector/SelectionVectorComparison";

// provided interfaces

// injects
const logger = inject("logger");

// internal
const { state, mutations, actions } = useProjectNew();

const { t } = useI18n();
const wait = reactive({
    active: false,
    config: {
        title: "Create Project...",
        icon: mdiFolderZip,
    },
});

const step = ref(1);
const steps = reactive([
    t("catalog"),
    t("screeningsheet"),
    t("selectionvector"),
    t("summary"),
]);

const project = computed(() => state.project);

function prev() {
    step.value = step.value - 1;
}
const next = () => {
    if (toValue(step) == 4) {
        onCreate();
    } else {
        step.value = step.value + 1;
    }
};

// step catalog selection
const onCatalogSelect = (payload) => {
    mutations.catalog(payload);
};
const onNoteEdited = (payload) => {
    mutations.note(payload);
};

// step screeningsheet upload
const screeningsheet = computed(() => state.screeningsheet);

const onScreeningsheetUpload = (payload) => {
    logger.debug("onScreeningsheetUpload");
    mutations.screeningsheet(payload.screeningsheet);
    mutations.project(payload.screeningsheet.project);

    mutations.selectionvector({
        levels: payload.screeningsheet.selectionVector.levels,
    });
};

// step selectionvector edit
const selectionVector = computed(() => state.selectionvector);
const onSelectionVectorModified = (payload) => {
    logger.debug("onSelectionVectorModified");
    mutations.selectionvector(payload.selectionVector);
};

// step summary
const onCreate = () => {
    logger.debug("onCreate");
    wait.active = true;

    actions
        .create()
        .then(() => {
            console.log("then");
            router.push({
                name: "project",
                params: {
                    id: toValue(project),
                },
            });
            wait.active = false;
        })
        .catch((error) => {
            warnDialog({
                title: t("error"),
                text: error.data,
                confirmationText: t("ok"),
            }).then(() => {
                wait.active = false;
            });
        });
};
</script>

<template>
  <Wait :wait />

  <v-stepper
    v-model="step"
    :items="steps"
    position="sticky"
    class="elevation-10"
    hide-actions
  >
    <v-stepper-window
      id="vsw"
      class="fill-height"
    >
      <v-stepper-window-item :value="1">
        <CatalogSelection
          @catalog-select="onCatalogSelect"
          @catalog-note="onNoteEdited"
        />
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <ScreeningsheetUpload
          @screeningsheet:upload="onScreeningsheetUpload"
        />
      </v-stepper-window-item>
      <v-stepper-window-item :value="3">
        <SelectionVectorEdit
          :selection-vector="screeningsheet.selectionVector"
          :project
          @selectionvector-modified="onSelectionVectorModified"
        />
      </v-stepper-window-item>
      <v-stepper-window-item :value="4">
        <SelectionVectorComparison
          :project
          :selection-vector="screeningsheet.selectionVector"
          :edited-selection-vector="selectionVector"
        />
      </v-stepper-window-item>
    </v-stepper-window>

    <v-stepper-actions>
      <template #prev>
        <v-btn
          :disabled="step === 1"
          @click="prev()"
        >
          {{ $t("back") }}
        </v-btn>
      </template>
      <template #next>
        <v-btn
          color="primary"
          :disabled="false"
          @click="next()"
        >
          {{ $t("next") }}
        </v-btn>
      </template>
    </v-stepper-actions>
  </v-stepper>
</template>
