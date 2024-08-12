<script setup>
import { reactive, watch, inject } from "vue";

import { useCompareDialog } from "@/composables/compare/CompareDialog";

import { mdiUpdate } from "@mdi/js";
import Wait from "@/components/wait/Wait";

// provided interfaces
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

// internal
const { state, mutations, actions } = useCompareDialog();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
    },
    { immediate: true }
);

watch(
    [() => state.tailoring, () => props.active],
    () => {
        if (props.active && state.tailoring) {
            initialize();
        }
    },
    { immediate: false }
);

const wait = reactive({
    active: false,
    config: {
        title: "Create comparison document...",
        icon: mdiUpdate,
    },
});

const initialize = () => {
    wait.active = true;

    actions
        .initialize()
        .then(() => {
            wait.active = false;
        })
        .catch(() => {
            wait.active = false;
        });
};

// event handlers

// hooks
</script>
<template>
  <Wait :wait />
</template>

<style scoped></style>
