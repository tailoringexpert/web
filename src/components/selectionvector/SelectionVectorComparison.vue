<script setup>
import { ref, inject, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useSelectionvectorComparison } from "@/composables/selectionvector/SselectionvectorComparison";

// provided interfaces
const props = defineProps({
    project: {
        type: String,
        default: "",
    },
    selectionVector: {
        type: Object,
        default: () => {
            return { levels: {} };
        },
    },
    editedSelectionVector: {
        type: Object,
        default: () => {
            return { levels: {} };
        },
    },
});

// injects
const store = inject("store");

// internal
const { state, mutations, actions } = useSelectionvectorComparison();

watch(
    () => props.selectionVector,
    (value) => {
        mutations.calculatedSelectionvector(value);
        actions.initialize();
    },
    { immediate: true }
);

watch(
    () => props.editedSelectionVector,
    (value) => {
        mutations.editedSelectionvector(value);
        actions.initialize();
    },
    { immediate: true }
);

const { t } = useI18n();
const headers = ref([
    {
        title: t("name"),
        align: "start",
        sortable: true,
        value: "label",
    },
    {
        title: t("selectionvector_calculated"),
        value: "calculated",
    },
    {
        title: t("selectionvector_applied"),
        value: "modified",
    },
]);
const items = computed(() => state.comparedSelectionvectors);

// event handlers

// hooks
</script>

<template>
  <v-row>
    <v-col class="col">
      {{ $t("project") }}
    </v-col>
    <v-col>{{ project }}</v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          {{ $t("selectionvector_comparison") }}
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
        />
      </v-card>
    </v-col>
  </v-row>
</template>
