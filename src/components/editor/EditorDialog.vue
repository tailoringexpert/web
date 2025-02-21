<script setup>
import { computed } from "vue";

import Editor from "@/components/editor/Editor";

// provided interfaces
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: String,
        default: "",
    },
});
const emit = defineEmits(["close:cancel", "close:save"]);

// injects

// internal
const isActive = computed(() =>  props.active);

// event handlers
const onCancel = (payload) => {
    emit("close:cancel", payload);
};

const onSave = (payload) => {
    emit("close:save", payload);
};

// hooks
</script>

<template>
  <v-dialog
    v-model="isActive"
    persistent
    transition="dialog-bottom-transition"
    justify="center"
  >
    <v-card elevation="2">
      <v-card-title>{{ $t("requirement_edit.title") }}</v-card-title>
      <v-card-text justify="center">
        <Editor
          :model-value="modelValue"
          @close:cancel="onCancel"
          @close:save="onSave"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
