<script setup>
import { ref, reactive, inject, watch, computed, toValue } from "vue";

import { useNametDialog } from "@/composables/name/NameDialog";
import Dialog from "@/layouts/WaitingDialog";

import { mdiUpdate } from "@mdi/js";

// provided interfaces
const emit = defineEmits(["close:cancel", "close:close"]);
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
const logger = inject("logger");

// internal
const { mutations, actions } = useNametDialog();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
        if (props.active) {
            name.value = value.name;
        }
    }
);

const wait = reactive({
    active: false,
    config: {
        title: "Updating tailoring name...",
        icon: mdiUpdate,
    },
});

const name = ref();

// event handlers
const onCancel = () => {
    name.value = props.tailoring.name;
    emit("close:cancel");
};

const onSave = () => {
    wait.active = true;

    actions
        .save(toValue(name))
        .then(() => {
            wait.active = false;
            emit("close:close");
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

// hooks
</script>

<template>
  <Dialog
    :title="$t('tailoring_name')"
    :wait
    :active
  >
    <template #default>
      <v-container>
        <v-row>
          <v-col>
            <span>Name</span>
          </v-col>

          <v-col>
            <v-text-field
              v-model="name"
              label="New Name"
              single-line
              counter
              autofocus
            />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        rounded
        variant="text"
        @click="onCancel"
      >
        {{ $t("cancel") }}
      </v-btn>
      <v-btn
        rounded
        variant="text"
        @click="onSave"
      >
        {{ $t("save") }}
      </v-btn>
    </template>
  </Dialog>
</template>
