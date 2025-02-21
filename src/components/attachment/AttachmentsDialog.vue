<script setup>
import { ref, reactive, watch, computed, inject } from "vue";
import { confirmDialog } from "vuetify3-dialog";
import { useI18n } from "vue-i18n";

import { useAttachmentsDialog } from "@/composables/attachment/AttachmentsDialog";
import Dialog from "@/layouts/WaitingDialog.vue";

import {
    mdiUpdate,
    mdiFilePdfBox,
    mdiCodeJson,
    mdiMicrosoftExcel,
    mdiCloudUpload,
    mdiDownloadCircle,
    mdiDelete,
} from "@mdi/js";

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
const { state, mutations, actions } = useAttachmentsDialog();

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

const waits = reactive({
    default: {
        title: "Loading data...",
        icon: mdiUpdate,
    },
    download: {
        title: "Downloading file",
        icon: mdiFilePdfBox,
    },
    upload: {
        title: "Uploading file",
        icon: mdiCodeJson,
    },
    delete: {
        title: "Deleting file",
        icon: mdiMicrosoftExcel,
    },
});
const wait = reactive(waits.default);

const headers = [
    {
        title: t("attachment.file"),
        sortable: true,
        value: "name",
    },
    {
        title: "Typ",
        sortable: true,
        value: "type",
    },
    {
        title: t("attachment.checksum"),
        sortable: true,
        value: "hash",
    },
    {
        title: "Actions",
        value: "actions",
        sortable: false,
    },
];
const attachments = computed(() => state.attachments);

const file = ref({});

const initialize = () => {
    wait.active = true;
    wait.config = waits.default;

    actions
        .initialize()
        .then(() => {
            console.log("ferig");
            wait.active = false;
        })
        .catch(() => {
            wait.active = false;
        });
};

// event handlers
const onSelectFile = (files) => {
    file.value = files.target.files[0];
};

const onUpload = () => {
    if (!file.value) {
        return;
    }

    var data = new FormData();
    data.append("datei", file.value);

    wait.config = waits.upload;
    wait.active = true;

    actions
        .upload(data)
        .then(() => {
            wait.active = false;
            file.value = null;
        })
        .catch(() => {
            wait.active = false;
        });
};

const onDownload = (item) => {
    wait.value = true;

    wait.config = waits.download;
    wait.active = true;

    actions
        .download(item)
        .then(() => {
            wait.active = false;
            file.value = null;
        })
        .catch(() => {
            wait.active = false;
        });
};

const onDelete = (item) => {
    confirmDialog({
        title: t("attachment_delete.title"),
        text: t("attachment_delete.text"),
        confirmationText: t("ja"),
        cancelText: t("nein"),
    }).then((confirmed) => {
        if (confirmed) {
            wait.config = waits.delete;
            wait.active = true;
            actions
                .delete(item)
                .then(() => {
                    wait.active = false;
                    file.value = null;
                })
                .catch(() => {
                    wait.active = false;
                });
        }
    });
};

const onClose = () => {
    emit("close:closed");
};

// hooks
</script>

<template>
  <Dialog
    :title="$t('attachment.title')"
    :wait
    :active
  >
    <template #default>
      <v-row
        no-gutters
        justify="center"
        align="center"
      >
        <v-col cols="8">
          <v-file-input
            show-size
            clearable
            label="File input"
            @change="onSelectFile"
          />
        </v-col>

        <v-col
          cols="4"
          class="pl-2"
        >
          <v-btn
            color="success"
            @click="onUpload()"
          >
            {{ $t("upload") }}
            <v-icon
              :icon="mdiCloudUpload"
              class="me-2"
              v-bind="attrs"
              v-on="on"
              @click="onPDF(item)"
            />
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :items="attachments"
        :headers="headers"
        class="elevation-1"
      >
        <template #item.name="{ item }">
          <span @click.self="onDownload(item)">{{ item.name }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-tooltip location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-icon
                :icon="mdiDownloadCircle"
                class="me-2"
                v-bind="activatorProps"
                @click="onDownload(item)"
              />
            </template>
            <span>{{ $t("tooltip.attachment_download") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-icon
                :icon="mdiDelete"
                class="me-2"
                v-bind="activatorProps"
                @click="onDelete(item)"
              />
            </template>
            <span>{{ $t("tooltip.attachment_delete") }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
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
</template>
