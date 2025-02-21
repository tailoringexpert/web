<script setup>
import { ref, reactive, computed, inject } from "vue";
import { confirmDialog } from "vuetify3-dialog";
import { useI18n } from "vue-i18n";
import router from "@/router";

import { useProjects } from "@/composables/Projects";

import {
    mdiUpdate,
    mdiPencil,
    mdiPencilBoxOutline,
    mdiDeleteAlert,
    mdiAlertCircleOutline,
} from "@mdi/js";

import Wait from "@/components/wait/Wait";

// provided interfaces

// injects
const store = inject("store");
const logger = inject("logger");

// internal
const { state, mutations, actions } = useProjects();
const { t } = useI18n();

const waits = {
    default: {
        title: "Loading projects...",
        icon: mdiUpdate,
    },
    state: {
        title: "Changing project state...",
        icon: mdiUpdate,
    },
    delete: {
        title: "Deleting project...",
        icon: mdiUpdate,
    },
};
const wait = reactive({
    active: false,
    config: waits.default,
});

const _state = ref("ONGOING");
const states = computed(() => state.states);

const headers = reactive([
    {
        title: t("name"),
        value: "name",
        sortable: true,
        filterable: false,
        align: "start",
        width: "40%",
    },
    {
        title: t("created_at"),
        value: "creationTimestamp",
        sortable: true,
        width: "15%",
    },
    {
        title: t("state"),
        value: "state",
        sortable: false,
        width: "15%",
    },
    {
        title: t("action", 2),
        value: "actions",
        sortable: false,
        width: "30%",
    },
]);
const projects = computed(() => state.projects);

const created = () => {
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

function byStateFilter(columnValue, filterValue, rowItem) {
    return filterValue.trim() === "" || filterValue == rowItem.columns.state;
}

// event handlers
function onNew() {
    router.push({
        name: "projectnew",
    });
}

function onState(project) {
    confirmDialog({
        title: t("project_state.title"),
        text: t("project_state.text"),
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
                .updateState(project)
                .then(() => {
                    wait.active = false;
                })
                .catch(() => {
                    wait.active = false;
                });
        }
    });
}

function onEdit(project) {
    store.mutations.project(project);
    router.push({
        name: "project",
        params: {
            id: project.name,
        },
    });
}

function onDelete(project) {
    confirmDialog({
        title: t("project_delete.title"),
        text: t("project_delete.text"),
        cancelText: "No",
        cancelButtonOptions: {
            active: true,
        },
        confirmationText: "Yes",
        confirmButtonOptions: {
            active: false,
        },
        icon: mdiAlertCircleOutline,
    }).then((confirmed) => {
        if (confirmed) {
            wait.config = waits.delete;
            wait.active = true;
            actions
                .delete(project)
                .then(() => {
                    wait.active = false;
                })
                .catch(() => {
                    wait.active = false;
                });
        }
    });
}

// hooks
store.mutations.breadcrumbs([
    {
        title: t("project", 2),
        disabled: false,
        exact: true,
        to: { name: "projects" },
    },
]);

created();
</script>

<template>
  <Wait :wait />

  <section class="view">
    <v-card class="card-top">
      <v-toolbar flat>
        <v-toolbar-title>
          {{ $t("project", 2) }}
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-btn
            class="mb-2"
            @click="onNew()"
          >
            {{ $t("project_new") }}
          </v-btn>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-card class="table-container">
      <v-data-table
        :custom-filter="byStateFilter"
        :search="_state"
        :headers="headers"
        :items="projects"
        :items-per-page="20"
        :loading="wait.active"
        fixed-header
        class="elevation-10 flex-table"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <template #header.state>
          <v-container>
            <v-select
              v-model="_state"
              label="State"
              :items="states"
              density="compact"
            />
          </v-container>
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

        <template #item.actions="{ item }">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiPencil"
                size="small"
                class="mr-2"
                v-bind="props"
                @click="onEdit(item)"
              />
            </template>
            <span>{{ $t("tooltip.project_edit") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiDeleteAlert"
                class="me-2"
                size="small"
                v-bind="props"
                @click="onDelete(item)"
              />
            </template>
            <span>{{ $t("tooltip.project_delete") }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script></script>
