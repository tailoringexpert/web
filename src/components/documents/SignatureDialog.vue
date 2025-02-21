<script setup>
import { reactive, watch, computed, inject } from "vue";

import { useSignatureDialog } from "@/composables/documents/SignatureDialog";
import Dialog from "@/layouts/WaitingDialog";

import { mdiUpdate } from "@mdi/js";

// provided interfaces
const emit = defineEmits(["close:canceled", "close:closed"]);
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    signature: {
        type: Object,
        default: () => {
            return {};
        },
    },
});

// injects
const logger = inject("logger");

// internal
const { mutations, actions } = useSignatureDialog();
const _signature = reactive({});

watch(
    () => props.signature,
    (value) => {
        _signature._links = value._links;
        _signature.signee = value.signee;
        _signature.state = value.state;
        _signature.faculty = value.faculty;
        _signature.applicable = value.applicable;
        mutations.signature(_signature);
    }
);

const waits = {
    default: {
        title: "Loading data...",
        icon: mdiUpdate,
    },
    update: {
        title: "Updating signature...",
        icon: mdiUpdate,
    },
};
const wait = reactive({
    active: false,
    config: waits.default,
});

const isActive = computed(() => {
    return props.active && !wait.active;
});

// event handlers
const onClose = () => {
    emit("close:canceled");
};

const onSave = () => {
    wait.config = waits.update;
    wait.active = true;

    mutations.signature(_signature);
    actions
        .save()
        .then(() => {
            wait.active = false;
            emit("close:closed");
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

// hooks
</script>

<template>
  <Dialog
    :title="_signature.faculty"
    :wait
    :active
  >
    <template #default>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="_signature.signee"
              label="Name"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="_signature.state"
              label="State"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-checkbox
              v-model="_signature.applicable"
              label="applicable"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="onClose()"
      >
        {{ $t("cancel") }}
      </v-btn>
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="onSave()"
      >
        {{ $t("save") }}
      </v-btn>
    </template>
  </Dialog>
</template>

<style scoped></style>
