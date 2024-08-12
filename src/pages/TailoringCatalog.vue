<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

import { useTailoringCatalog } from "@/composables/TailoringCatalog";

import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";

import { mdiUpdate, mdiThumbUpOutline, mdiThumbDownOutline } from "@mdi/js";

import { warnDialog } from "vuetify3-dialog";

import EditorDialog from "@/components/editor/EditorDialog";
import Wait from "@/components/wait/Wait";
import RequirementCard from "@/components/requirement/RequirementCard";

// provided interface

// injects
const store = inject("store");
const logger = inject("logger");

// internal
const { state, getters, mutations, actions } = useTailoringCatalog();

const { t } = useI18n();

const waits = {
    default: {
        title: "Loading tailoring catalog...",
        icon: mdiUpdate,
    },
    requirement: {
        title: "Updating requirement...",
        icon: mdiUpdate,
    },
    state: {
        title: "Updating requirements state...",
        icon: mdiUpdate,
    },
};
const wait = reactive({
    active: false,
    config: waits.default,
});

const breadcrumbs = ref([]);
const search = ref("");
const edit = ref(false);

const catalog = computed(() => state.catalog);
const chapter = computed(() => state.chapter);
const requirements = computed(() => getters.requirements());

const requirementText = ref();

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

// event handlers
const onSelectChapter = (chapter) => {
    mutations.chapter(chapter);

    breadcrumbs.value = [];
    [...chapter.id.matchAll(/\./g)].map((match) => {
        var number = chapter.id.substring(0, match.index);
        breadcrumbs.value.push({
            title: number + " " + getters.name(number),
            disabled: true,
        });
    });

    breadcrumbs.value.push({
        title: chapter.id + " " + chapter.name,
        disabled: true,
    });
};

const onStates = (chapter, state) => {
    if (chapter == null) {
        warnDialog({
            title: t("chapter_selection.title"),
            text: t("chapter_selection.text"),
            confirmationText: t("chapter_selection.ok"),
        }).then(() => {
            return;
        });
    }

    wait.config = waits.state;
    wait.active = true;

    actions
        .states(state)
        .then(() => {
            mutations.requirement(null);
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

const onState = (requirement) => {
    wait.config = waits.requirement;
    wait.active = true;

    mutations.requirement(requirement);
    actions
        .state()
        .then(() => {
            mutations.requirement(null);
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

const onEdit = (requirement) => {
    mutations.requirement(requirement);
    requirementText.value = requirement.text;
    edit.value = true;
};

const onNew = (requirement) => {
    mutations.requirement({
        text: null,
        selected: true,
        changed: false,
        _links: requirement._links,
    });

    requirementText.value = null;
    edit.value = true;
};

const onSave = (payload) => {
    edit.value = false;
    wait.config = waits.requirement;
    wait.active = true;

    actions
        .save(payload)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            logger.error(error);
            wait.active = false;
        });
};

const onCancel = (payload) => {
    edit.value = false;
};

// hooks
store.mutations.breadcrumbs([
    {
        title: t("project", 2),
        disabled: false,
        exact: true,
        to: { name: "projects" },
    },
    {
        title: store.state.project.name,
        disabled: false,
        exact: true,
        to: { name: "project", params: { id: store.state.project.name } },
    },
]);

initialize();
</script>

<template>
  <Wait :wait />

  <EditorDialog
    :active="edit"
    :model-value="requirementText"
    @close:cancel="onCancel"
    @close:save="onSave"
  />

  <section class="view">
    <v-card
      class="card-top"
      color="grey-lighten-3"
    >
      <v-row>
        <v-col
          cols="4"
          align-self="center"
        >
          <v-text-field
            v-model="search"
            label="Search chapters"
            variant="solo"
            flat
            clearable
          />
        </v-col>
        <v-col
          cols="1"
          align-self="center"
        >
          <v-btn
            elevation="10"
            @click="onStates(chapter, true)"
          >
            <v-icon :icon="mdiThumbUpOutline" />
          </v-btn>
          <v-btn
            elevation="10"
            @click="onStates(chapter, false)"
          >
            <v-icon :icon="mdiThumbDownOutline" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="flex-table">
      <v-row
        class="pa-4"
        style="overflow-y: scroll"
      >
        <v-col cols="5">
          <Tree
            v-model:nodes="catalog.toc.nodes"
            :search-text="search"
            @node-click="onSelectChapter"
          />
        </v-col>

        <v-divider vertical />

        <v-col>
          <v-breadcrumbs
            :items="breadcrumbs"
            divider="-"
          />
          <v-data-iterator
            :items="requirements"
            :hide-default-header="false"
          >
            <template #default="props">
              <v-row
                v-for="item in props.items"
                :key="item.raw.text"
                class="mb-6 cols sm md lg"
                justify="space-around"
              >
                <RequirementCard
                  :requirement="item"
                  @new="onNew"
                  @edit="onEdit"
                  @state="onState"
                />
              </v-row>
            </template>
          </v-data-iterator>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<style scoped>
sticky {
    /* position: sticky !important; */
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    align-self: flex-start;
}
</style>
