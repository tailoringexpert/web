<script setup>
import { ref, reactive, watch, computed, toValue, inject } from "vue";

import { useNotesDialog } from "@/composables/note/NotesDialog";
import Dialog from "@/layouts/WaitingDialog";

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
const logger = inject("logger");

// internal
const { state, mutations, actions } = useNotesDialog();

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

const waits = reactive({
    default: {
        title: "Loading notes...",
        icon: mdiUpdate,
    },
    new: {
        title: "Creating note..",
        icon: mdiUpdate,
    },
});
const wait = reactive({
    active: false,
    config: waits.default,
});

const notes = computed(() => state.notes);
const noteText = ref(null);

const initialize = () => {
    wait.config = waits.default;
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
const onNew = () => {
    var note = toValue(noteText);
    if (note == null) {
        return;
    }

    wait.config = waits.new;
    wait.active = true;

    actions
        .create(note)
        .then(() => {
            noteText.value = null;
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

const onClose = () => {
    emit("close:closed");
};

// hooks
</script>

<template>
  <Dialog
    :title="$t('tailoring_notes.title')"
    :wait
    :active
  >
    <template #default>
      <v-timeline
        density="compact"
        side="end"
      >
        <v-timeline-item
          fill-dot
          class="text-white mb-12"
          dot-color="orange"
          size="large"
        >
          <template #icon />
          <v-text-field
            v-model="noteText"
            hide-details
            flat
            label="New Note"
            variant="solo"
            autofocus
          >
            <template #append>
              <v-btn
                class="mx-0"
                variant="flat"
                @click="onNew"
              >
                {{ $t("add") }}
              </v-btn>
            </template>
          </v-text-field>
        </v-timeline-item>

        <v-timeline-item
          v-for="note in notes"
          :key="note.number"
          class="mb-4"
          dot-color="teal-lighten-3"
          size="small"
        >
          <v-row justify="space-between">
            <v-col cols="7">
              <span v-text="note.text" />
            </v-col>
            <v-col
              class="text-right"
              cols="5"
            >
              <span v-text="note.creationTimestamp" />
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        rounded
        variant="text"
        @click="onClose"
      >
        {{ $t("close") }}
      </v-btn>
    </template>
  </Dialog>
</template>
