<script setup>
import { ref, reactive, computed, inject, toValue } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";

import { useTailoringNew } from "@/composables/TailorimgNew";

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
const { state, mutations, actions } = useTailoringNew();

const { t } = useI18n();
const wait = reactive({
    active: false,
    config: {
        title: "Create Tailoring...",
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

const previous = () => {
    step.value = step.value - 1;
};
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
  >
    <template #item.1>
      <CatalogSelection
        @catalog-select="onCatalogSelect"
        @catalog-note="onNoteEdited"
      />
    </template>
    <template #item.2>
      <ScreeningsheetUpload
        @screeningsheet:upload="onScreeningsheetUpload"
      />
    </template>
    <template #item.3>
      <SelectionVectorEdit
        :selection-vector="screeningsheet.selectionVector"
        :project
        @selectionvector-modified="onSelectionVectorModified"
      />
    </template>
    <template #item.4>
      <SelectionVectorComparison
        :project
        :selection-vector="screeningsheet.selectionVector"
        :edited-selection-vector="selectionVector"
      />
    </template>

    <template #actions>
      <v-card-actions>
        <v-btn @click="previous()">
          {{ $t("back") }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          @click="next()"
        >
          {{ $t("next") }}
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>
