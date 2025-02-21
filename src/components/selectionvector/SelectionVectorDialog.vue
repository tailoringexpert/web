<script setup>
import { reactive, inject, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useSelectionvectorDialog } from "@/composables/selectionvector/SelectionvectorDialog";
import Dialog from "@/layouts/WaitingDialog.vue";

import { mdiUpdate } from "@mdi/js";

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
const store = inject("store");
const logger = inject("logger");

// internal
const { state, mutations, actions } = useSelectionvectorDialog();

watch(
    [() => props.tailoring, () => props.active],
    () => {
        if (props.active && props.tailoring) {
            mutations.tailoring(props.tailoring);
            initialize();
        }
    },
    { immediate: false }
);

const { t } = useI18n();

const wait = reactive({
    active: false,
    config: {
        title: "Loading applied selectionvector...",
        icon: mdiUpdate,
    },
});

const isActive = computed(() => props.active && !wait.active);

const headers = reactive([
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
const items = computed(() => state.levels);

const initialize = () => {
    wait.active = true;

    actions
        .initialize()
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

// event handlers
const onClose = () => {
    emit("close:closed");
};

// hooks
</script>

<template>
  <Dialog
    :title="$t('selectionvector_applied')"
    :wait
    :active
  >
    <template #default>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
      />
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
  <!-- <Wait :wait /> -->

  <!--   <v-dialog
    v-model="isActive"
    max-width="75%"
  >
    <v-card elevation="2">
      <v-card-title>{{ $t("selectionvector_applied") }}</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
        />
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
  </v-dialog> -->
</template>

<style scoped></style>
