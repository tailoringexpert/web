<script setup>
import { computed, reactive, toRef } from "vue";

import Wait from "@/components/wait/Wait";

// provided interfaces
const props = defineProps({
    title: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
    wait: {
        type: Object,
        default() {
            return { active: false };
        },
    },
});

const active = toRef(props, "active");
const wait = reactive(props.wait);

// injects

// internal
const isActive = computed(() => active.value && !wait.active);

// event handlers

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
      <v-card-title>
        <slot name="title">
          {{ title }}
        </slot>
      </v-card-title>

      <v-card-text justify="center">
        <slot name="default" />
      </v-card-text>

      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
