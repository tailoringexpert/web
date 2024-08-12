<script setup>
import { computed, inject } from "vue";

import { mdiUpdate } from "@mdi/js";

// provided interfaces
const props = defineProps({
    wait: {
        type: Object,
        default: () => {
            return {
                active: false,
                config: {
                    title: "Loading data...",
                    icon: mdiUpdate,
                },
            };
        },
    },
});

// injects

// internal
const active = computed(() => {
    return props.wait.active;
});

const title = computed(() => {
    return props.wait.config.title;
});

const icon = computed(() => {
    return props.wait.config.icon;
});

// event handlers

// hooks
</script>

<template>
  <v-dialog
    v-model="active"
    max-width="320"
    persistent
  >
    <v-list
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <v-list-item :title="title">
        <template #prepend>
          <div class="pe-4">
            <v-icon :icon="icon" />
          </div>
        </template>

        <template #append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
