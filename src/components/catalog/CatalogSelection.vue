<script setup>
import { ref, reactive, computed, watch, inject, toValue } from "vue";
import { useCatalogSelection } from "@/composables/catalog/CatalogSelection";

import { mdiUpdate } from "@mdi/js";

import Wait from "@/components/wait/Wait";

// provided interfaces
const emit = defineEmits(["catalog-select", "catalog-note"]);

// injects
const logger = inject("logger");

// internal
const { state, mutations, actions } = useCatalogSelection();

const wait = reactive({
    active: false,
    config: {
        title: "Loading basecatalogs...",
        icon: mdiUpdate,
    },
});

const catalogs = computed(() => state.catalogs);
const catalog = computed(() => state.catalog);
const note = ref(null);

watch(catalog, (newValue) => {
    emit("catalog-select", newValue);
});

const initialize = () => {
    wait.active = true;

    actions
        .initialize()
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

// event handlers
const onNoteUpdate = () => {
    mutations.note(note);
    emit("catalog-note", toValue(note));
};

// hooks
initialize();
</script>

<template>
  <Wait :wait />

  <v-container>
    <v-row
      no-gutters
      justify="center"
      align="center"
    >
      <v-select
        v-model="catalog"
        :items="catalogs"
        item-title="version"
        return-object
        label="Choose catalog"
      />
    </v-row>
    <v-row>
      <v-textarea
        v-model="note"
        clearable
        counter
        label="Note"
        @blur="onNoteUpdate"
      />
    </v-row>
  </v-container>
</template>
