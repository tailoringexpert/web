<script setup>
import { ref, reactive, watch, computed } from "vue";
import { confirmDialog } from "vuetify3-dialog";
import { useI18n } from "vue-i18n";

import { useDocumentsDialog } from "@/composables/documents/DocumentsDialog";
import Dialog from "@/layouts/WaitingDialog";
import SignatureDialog from "@/components/documents/SignatureDialog";

import {
    mdiUpdate,
    mdiFilePdfBox,
    mdiFolderZip,
    mdiPencilBoxOutline,
    mdiCheckboxBlankOutline,
    mdiCheckboxOutline,
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

// internal
const { state, mutations, actions } = useDocumentsDialog();

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
        title: "Loading data...",
        icon: mdiUpdate,
    },
    catalog: {
        title: "Downloading internal catalog",
        icon: mdiFilePdfBox,
    },
    zip: {
        title: "Downloading documents",
        icon: mdiFolderZip,
    },
});
const wait = reactive({
    active: false,
    config: waits.default,
});

const { t } = useI18n();

const headers = [
    {
        text: t("documents.faculty"),
        sortable: true,
        value: "faculty",
    },
    {
        text: t("documents.signee"),
        sortable: true,
        value: "signee",
    },
    {
        title: t("documents.signature_state"),
        sortable: true,
        value: "signature_state",
    },
    {
        title: t("documents.applicable"),
        sortable: true,
        value: "applicable",
    },
    {
        title: "Actions",
        value: "actions",
        sortable: false,
    },
];

const signatures = computed(() => state.signatures);

const isSignature = ref(false);
const signature = ref(null);

const initialize = () => {
    wait.config = waits.default;
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

const downloadFile = (link, waitConfig) => {
    wait.config = waitConfig;
    wait.active = true;

    actions
        .download(link)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            confirmDialog({
                title: t("project_delete.title"),
                text: new TextDecoder("utf-8").decode(
                    new Uint8Array(error.data)
                ),
                cancelText: "No",
                confirmationText: "Yes",
            }).then((confirmed) => {
                if (confirmed) {
                    wait.active = false;
                }
            });
        });
};

// event handlers
const onClose = () => {
    emit("close:closed");
};

const onCatalog = () => {
    downloadFile(props.tailoring._links.tailoringcatalog.href, waits.catalog);
};

const onZip = () => {
    downloadFile(props.tailoring._links.document.href, waits.zip);
};

const onEditSignature = (item) => {
    isSignature.value = true;
    signature.value = item;
};

const onCloseSignature = () => {
    isSignature.value = false;
    initialize();
};

// hooks
</script>

<template>
  <SignatureDialog
    :active="isSignature"
    :signature
    @close:closed="onCloseSignature()"
    @close:canceled="isSignature = false"
  />

  <Dialog
    :title="$t('documents.title')"
    :wait
    :active
  >
    <template #default>
      <v-data-table
        :headers="headers"
        :items="signatures"
      >
        <template #item="{ item }">
          <tr>
            <td>{{ item.faculty }}</td>
            <td>{{ item.signee }}</td>
            <td class="text-right">
              {{ item.state }}
            </td>
            <td class="text-right">
              <v-icon
                :icon="
                  item.applicable
                    ? mdiCheckboxOutline
                    : mdiCheckboxBlankOutline
                "
                class="me-2"
                size="small"
              />
            </td>
            <td>
              <v-icon
                :icon="mdiPencilBoxOutline"
                class="me-2"
                size="small"
                @click="onEditSignature(item)"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>

    <template #actions>
      <v-btn
        rounded
        variant="text"
        @click="onClose()"
      >
        {{ $t("close") }}
      </v-btn>
      <v-spacer />
      <v-btn
        rounded
        variant="text"
        @click="onCatalog()"
      >
        {{ $t("documents.catalog") }}
      </v-btn>
      <v-btn
        rounded
        variant="text"
        @click="onZip()"
      >
        {{ $t("documents.download") }}
      </v-btn>
    </template>
  </Dialog>
</template>
