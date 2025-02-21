<script setup>
import { ref, reactive, computed, toValue, inject } from "vue";

import { useJson2PdfConverter } from "@/composables/catalog/Json2PdfConverter";

import {
    mdiUpdate,
    mdiCodeJson,
} from "@mdi/js";

import Wait from "@/components/wait/Wait";

// provided interfaces
const emit = defineEmits(["close:closed"]);
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
});

// injects
const logger = inject("logger");

// internal
const { actions } = useJson2PdfConverter();

const wait = reactive({
    active: false,
    config: {
        title: "Converting catalog",
        icon: mdiUpdate,
    },
});

const isActive = computed(() => {
    return props.active && !wait.active;
});

const file = ref({});

// event handlers
const onSelect = (files) => {
    file.value = files.target.files[0];
};

const onConvert = () => {
    wait.active = true;
    actions
        .convert(file)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

const onClose = () => {
    emit("close:closed");
};

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
      <v-card-title>{{ $t("basecatalog_preview.title") }}</v-card-title>
      <v-card-text justify="center">
        <v-row
          no-gutters
          justify="center"
          align="center"
        >
          <v-col cols="8">
            <v-file-input
              ref="uploadFile"
              show-size
              label="File input"
              accept="application/json"
              @change="onSelect"
            />
          </v-col>

          <v-col
            cols="4"
            class="pl-2"
          >
            <v-btn
              color="success"
              @click="onConvert"
            >
              {{ $t("basecatalog_preview.convert") }}
              <v-icon
                :icon="mdiCodeJson"
                class="me-2"
                end
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          rounded
          variant="text"
          @click="onClose"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
