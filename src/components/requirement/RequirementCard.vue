<script setup>
import { computed } from "vue";

import { mdiPencil, mdiPlus } from "@mdi/js";

// provided interfaces
const emit = defineEmits(["new", "edit", "state"]);
const props = defineProps({
    requirement: {
        type: Object,
        default: null,
    },
});

// injects

// internal
const applicable = computed(() => {
    return props.requirement.raw.selected;
});

// event handlers
const onState = () => {
    emit("state", props.requirement.raw);
};

const onEdit = () => {
    emit("edit", props.requirement.raw);
};

const onNew = () => {
    emit("new", props.requirement.raw);
};

// hooks
</script>

<template>
  <v-card
    min-width="90%"
    max-width="90%"
    elevation="15"
  >
    <v-card-title class="subheading font-weight-bold">
      <v-row
        align="center"
        no-gutters
      >
        <v-col>
          {{ requirement.raw.position
          }}<span v-if="requirement.raw.changed">
            ({{ $t("changed") }})</span>
        </v-col>
        <v-col cols="1">
          <v-tooltip location="bottom">
            <template #activator="{ props: activatorProps }">
              <div
                style="width: min-content"
                v-bind="activatorProps"
              >
                <v-switch
                  v-model="applicable"
                  inset
                  color="green"
                  @update:model-value="onState"
                />
              </div>
            </template>
            <span>{{ $t("tooltip.applicabilty_change") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle>
      <span v-if="requirement.raw.reference != null">{{
        requirement.raw.reference
      }}</span>
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <span v-html="requirement.raw.text" />
    </v-card-text>
    <v-card-actions>
      <v-row justify="end">
        <v-tooltip location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-btn
              class="mx-2"
              color="cyan"
              size="small"
              v-bind="activatorProps"
              @click="onEdit()"
            >
              <v-icon :icon="mdiPencil" />
            </v-btn>
          </template>
          <span>{{ $t("tooltip.requirement_edit") }}</span>
        </v-tooltip>
        <v-tooltip location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-btn
              class="mx-2"
              size="small"
              color="indigo"
              v-bind="activatorProps"
              @click="onNew()"
            >
              <v-icon :icon="mdiPlus" />
            </v-btn>
          </template>
          <span>{{ $t("tooltip.requirement_create") }}</span>
        </v-tooltip>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
