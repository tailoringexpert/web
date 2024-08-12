<script setup>
import { ref, reactive, computed, toValue, inject, toRef } from "vue";
import { confirmDialog } from "vuetify3-dialog";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router";

import { useProject } from "@/composables/Project";

import {
    mdiUpdate,
    mdiFilePdfBox,
    mdiPencil,
    mdiPencilBoxOutline,
    mdiDownload,
    mdiCardAccountDetails,
    mdiVectorDifference,
    mdiHeadCheckOutline,
    mdiPaperclip,
    mdiMicrosoftExcel,
    mdiMessageBulleted,
    mdiDeleteAlert,
    mdiAlertCircleOutline,
} from "@mdi/js";

import Wait from "@/components/wait/Wait";
import ScreeningsheetDialog from "@/components/screeningsheet/ScreeningsheetDialog";
import NameDialog from "@/components/name/NameDialog";
import SelectionVectorDialog from "@/components/selectionvector/SelectionVectorDialog";
import CompareDialog from "@/components/compare/CompareDialog";
import DocumentsDialog from "@/components/documents/DocumentsDialog";
import AttachmentsDialog from "@/components/attachment/AttachmentsDialog";
import ImportDialog from "@/components/tailoring/ImportDialog";
import NotesDialog from "@/components/note/NotesDialog";

// provided interfaces

// injects
const store = inject("store");
const logger = inject("logger");

// internal
const { state, actions } = useProject();
const { t } = useI18n();

const waits = {
    default: {
        title: "Loading tailoring...",
        icon: mdiUpdate,
    },
    state: {
        title: "Updating project state...",
        icon: mdiUpdate,
    },
    basecatalog: {
        title: "Downloading basecatalog",
        icon: mdiFilePdfBox,
    },
    delete: {
        title: "Deleting tailoring...",
        icon: mdiUpdate,
    },
};

const wait = reactive({
    active: false,
    config: waits.default,
});

const route = useRoute();

const headers = reactive([
    {
        title: t("name"),
        align: "start",
        sortable: true,
        value: "name",
    },
    {
        title: t("phase", 2),
        sortable: true,
        value: "phases",
    },
    {
        title: t("state"),
        sortable: true,
        value: "state",
    },
    {
        title: t("catalog"),
        sortable: true,
        value: "catalogVersion",
    },
    {
        title: t("action", 2),
        value: "actions",
        sortable: false,
    },
]);

const project = computed(() => state.project);
const dialog = ref("none");
const data = ref(null);

const created = () => {
    wait.active = true;
    wait.config = waits.default;
    dialog.value = "none";

    actions
        .initialize()
        .then(() => {
            wait.active = false;
        })
        .catch(() => {
            wait.active = false;
        });
    logger.debug("created");
};

const isTailoringEditable = (tailoring) => "CREATED" == tailoring.state;
const isTailoringDeletable = (tailoring) => "CREATED" == tailoring.state;

// event handlers
function onNew() {
    router.push({
        name: "tailoringnew",
        params: {
            id: project.value.name,
        },
        state: {
            previous: route.params.self,
            self: project.value._links.tailoring.href,
            referer: project.value._links.self.href,
        },
    });
}

function onState(tailoring) {
    confirmDialog({
        title: "Warning",
        text: t("tailoring_state.text"),
        cancelText: t("no"),
        cancelButtonOptions: {
            active: true,
        },
        confirmationText: t("yes"),
        confirmButtonOptions: {
            active: false,
        },
        icon: mdiAlertCircleOutline,
    }).then((confirmed) => {
        if (confirmed) {
            wait.config = waits.state;
            wait.active = true;

            actions
                .updateState(tailoring)
                .then(() => {
                    wait.active = false;
                })
                .catch(() => {
                    wait.active = false;
                });
        }
    });
}

function onBaseCatalog(tailoring) {
    wait.config = waits.basecatalog;
    wait.active = true;

    actions
        .getBaseCatalog(tailoring)
        .then(() => {
            wait.active = false;
        })
        .catch(() => {
            wait.active = false;
            confirmDialog({
                title: "Error",
                text: new TextDecoder("utf-8").decode(
                    new Uint8Array(error.data)
                ),
                cancelText: t("OK"),
            });
        });
}

function onEdit(tailoring) {
    store.mutations.tailoring({
        name: project.value.name,
        _links: tailoring._links,
    });

    router.push({
        name: "catalog",
        params: {
            id: project.value.name,
            tailoring: tailoring.name,
        },
    });
}

function onDelete(tailoring) {
    confirmDialog({
        title: t("tailoring_delete.title"),
        text: t("tailoring_delete.text"),
        cancelText: t("no"),
        confirmationText: t("yes"),
        icon: mdiAlertCircleOutline,
    }).then((confirmed) => {
        if (confirmed) {
            wait.config = waits.delete;
            wait.active = true;
            actions
                .delete(tailoring)
                .then(() => {
                    wait.active = false;
                })
                .catch(() => {
                    wait.active = false;
                });
        }
    });
}

function onScreeningsheet(screeningsheet) {
    console.log("onScreeningsheet");
    data.value = screeningsheet;
    dialog.value = "screeningsheet";
}

function onSelectionvector(tailoring) {
    data.value = tailoring;
    dialog.value = "selectionvector";
}

function onCompare(tailoring) {
    data.value = tailoring;
    dialog.value = "compare";
}

function onName(tailoring) {
    console.log("onName");
    data.value = tailoring;
    dialog.value = "name";
}

function onDocuments(tailoring) {
    data.value = tailoring;
    dialog.value = "documents";
}

function onAttachments(tailoring) {
    data.value = tailoring;
    dialog.value = "attachments";
}

function onNotes(tailoring) {
    data.value = tailoring;
    dialog.value = "notes";
}

function onImport(tailoring) {
    data.value = tailoring;
    dialog.value = "import";
}

// hooks
store.mutations.breadcrumbs([
    {
        title: t("project", 2),
        disabled: false,
        exact: true,
        to: { name: "projects" },
    },
    {
        title: route.params.id,
        disabled: false,
        exact: true,
        to: { name: "project", params: { id: route.params.id } },
    },
]);

created();
</script>

<template>
  <Wait :wait />

  <v-container fluid>
    <v-row>
      <v-col cols="1">
        {{ $t("project") }} : {{ self }}
      </v-col>
      <v-col>
        {{ project.name }}
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-icon
              :icon="mdiCardAccountDetails"
              v-bind="props"
              @click="onScreeningsheet(project)"
            />
          </template>
          <span>{{ $t("tooltip.screeningsheet_open") }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>

  <section class="view">
    <v-card class="card-top">
      <v-toolbar flat>
        <v-toolbar-title>
          {{ $t("tailoring", 2) }}
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-btn
            class="mb-2"
            @click="onNew()"
          >
            {{ $t("tailoring_new") }}
          </v-btn>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-card class="table-container">
      <v-data-table
        :headers="headers"
        :items="project.tailorings"
        :items-per-page="20"
        :loading="wait.active"
        fixed-header
        class="elevation-10 flex-table"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>
        <template #top>
          <ScreeningsheetDialog
            :screeningsheet="data"
            :active="dialog === 'screeningsheet'"
            @close:closed="dialog = 'none'"
          />
          <NameDialog
            :tailoring="data"
            :active="dialog === 'name'"
            @close:cancel="dialog = 'none'"
            @close:close="created()"
          />
          <SelectionVectorDialog
            :tailoring="data"
            :active="dialog === 'selectionvector'"
            @close:closed="dialog = 'none'"
          />
          <CompareDialog
            :tailoring="data"
            :active="dialog === 'compare'"
            @close:closed="dialog = 'none'"
          />
          <DocumentsDialog
            :tailoring="data"
            :active="dialog === 'documents'"
            @close:closed="dialog = 'none'"
          />
          <AttachmentsDialog
            :tailoring="data"
            :active="dialog === 'attachments'"
            @close:closed="dialog = 'none'"
          />
          <ImportDialog
            :tailoring="data"
            :active="dialog === 'import'"
            @close:closed="dialog = 'none'"
          />
          <NotesDialog
            :tailoring="data"
            :active="dialog === 'notes'"
            @close:closed="dialog = 'none'"
          />
        </template>

        <template #item.name="{ item }">
          <span>
            {{ item.name }}
            <v-icon
              :icon="mdiPencil"
              class="me-2"
              size="small"
              @click="onName(item)"
            />
          </span>
        </template>

        <template #item.phases="{ item }">
          <span>
            {{ item.phases.join(", ") }}
          </span>
        </template>

        <template #item.state="{ item }">
          <span @click="onState(item)">{{ item.state }}
            <v-icon
              :icon="mdiPencilBoxOutline"
              class="me-2"
              size="small"
            />
          </span>
        </template>

        <template #item.catalogVersion="{ item }">
          <span @click="onBaseCatalog(item)">{{ item.catalogVersion }}
            <v-icon
              :icon="mdiDownload"
              class="me-2"
              size="small"
            />
          </span>
        </template>

        <template #item.actions="{ item }">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiPencilBoxOutline"
                size="small"
                class="mr-2"
                :disabled="!isTailoringEditable(item)"
                v-bind="props"
                @click="onEdit(item)"
              />
            </template>
            <span>{{ $t("tooltip.requirements_edit") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiDownload"
                size="small"
                class="mr-2"
                :disabled="!isTailoringEditable(item)"
                v-bind="props"
                @click="onDocuments(item)"
              />
            </template>
            <span>{{ $t("tooltip.document_open") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiVectorDifference"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onCompare(item)"
              />
            </template>
            <span>{{ $t("tooltip.tailoring_compare") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiCardAccountDetails"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onScreeningsheet(item)"
              />
            </template>
            <span>{{ $t("tooltip.screeningsheet_open") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiHeadCheckOutline"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onSelectionvector(item)"
              />
            </template>
            <span>{{ $t("tooltip.selectionvector_open") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiPaperclip"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onAttachments(item)"
              />
            </template>
            <span>{{ $t("tooltip.attachment_open") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiMicrosoftExcel"
                size="small"
                class="mr-2"
                :disabled="!isTailoringEditable(item)"
                v-bind="props"
                @click="onImport(item)"
              />
            </template>
            <span>{{ $t("tooltip.requirement_import") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiMessageBulleted"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onNotes(item)"
              />
            </template>
            <span>{{ $t("tooltip.tailoring_notes") }}</span>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiDeleteAlert"
                size="small"
                class="mr-2"
                :disabled="!isTailoringDeletable(item)"
                v-bind="props"
                @click="onDelete(item)"
              />
            </template>
            <span>{{ $t("tooltip.tailoring_delete") }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<style scoped>
.v-icon__svg {
    fill: currentColor;
    width: 100%;
    height: 100%;
}
</style>
