<script setup>
import { ref, computed, onBeforeMount, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import sanitizeHtml from 'sanitize-html';
import Breadcrumb from 'primevue/breadcrumb';
import DataView from 'primevue/dataview';
import Card from 'primevue/card';
import ToggleSwitch from 'primevue/toggleswitch';
import ScrollTop from 'primevue/scrolltop';
import ContextMenu from 'primevue/contextmenu';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import EditorDialog from '@/components/editor/EditorDialog.vue';

import { useTailoringCatalog } from '@/composables/TailoringCatalog';

// provided interfaces
const emit = defineEmits(['success', 'error']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, getters, mutations, actions } = useTailoringCatalog();
const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();

const breadcrumbs = computed(() => state.breadcrumbs);
const catalog = computed(() => state.catalog);
const chapter = computed(() => state.chapter);
const requirements = computed(() => getters.requirements());
const requirementText = ref();
const edit = ref(false);

const chapterContextMenu = ref();
const chapterContextMenuItems = ref([
    { label: 'Select All', icon: 'pi pi-check', command: () => onStates(true) },
    { label: 'Deselect all', icon: 'pi pi-times', command: () => onStates(false) }
]);

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.debug(error);
    });
};

// event handlers
const onSelectChapter = (chapter) => {
    logger.debug('onSelectChapter');
    mutations.chapter(chapter);
};

const onRightClickChapter = (event) => {
    console.log('onRightClickChapter');
    chapterContextMenu.value.show(event);
};

const onStates = (state) => {
    logger.debug('onStates');
    if (chapter.value == null) {
        return;
    }

    actions
        .states(state)
        .then(() => {
            mutations.requirement(null);
            onSuccess(
                t('TailoringCatalog.setStates.title'),
                t('TailoringCatalog.setStates.state.success', {
                    chapter: chapter.value.key,
                    state: state ? "applicable" : "not applicable"
                })
            );
        })
        .catch((error) => {
            logger.debug(error);
            onError(
                t('TailoringCatalog.setStates.title'),
                error
            );
        });
};

const onState = (requirement) => {
    logger.debug('onState');
    mutations.requirement(requirement);
    actions
        .state()
        .then(() => {
            mutations.requirement(null);
            onSuccess(
                t('TailoringCatalog.setState.title'),
                t('TailoringCatalog.setState.state.success')
            );
        })
        .catch((error) => {
            onError(
                t('TailoringCatalog.setState.title'),
                error
            );
        });
};

const onEdit = (requirement) => {
    logger.debug('onEdit');
    mutations.requirement(requirement);
    requirementText.value = requirement.text;
    edit.value = true;
};

const onNew = (requirement) => {
    logger.debug('onNew');
    mutations.requirement({
        text: null,
        selected: true,
        changed: false,
        _links: requirement._links
    });

    requirementText.value = null;
    edit.value = true;
};

const onCancel = (payload) => {
    logger.debug('onCancel');
    edit.value = false;
};

const onSave = (payload) => {
    logger.debug('onSave');
    edit.value = false;
    actions
        .save(payload)
        .then(() => {
            onSuccess(
                t('TailoringCatalog.saveText.title'),
                t('TailoringCatalog.saveText.state.success')
            );
        })
        .catch((error) => {
            logger.debug(error);
            onError(
                t('TailoringCatalog.saveText.title'),
                error
            );
        });
};

const onSuccess = (title, message) => {
    emit("success", title, message);
};

const onError = (title, message) => {
    emit("error", title, message);
};

// hooks
onBeforeMount(() => {
    store.mutations.breadcrumbs([
        {
            label: t('TailoringCatalog.project', 2),
            disabled: false,
            exact: true,
            route: { name: 'projects' }
        },
        {
            label: store.state.project.name,
            disabled: false,
            exact: true,
            route: { name: 'project', params: { id: store.state.project.name } }
        }
    ]);
    initialize();
});

const dummy = ref("<html>The PPIP should include, but not be limited to, the following information: <ul> <li>in detail, the processes, procedures, analyses, and facilities how the project will incorporate for the required planetary protection,</li></ul></html>")
</script>

<template>
  <EditorDialog
    :active="edit"
    :model-value="requirementText"
    @success="onSuccess"
    @error="onError"
    @close:cancel="onCancel"
    @close:save="onSave"
  />

  <div class="card">
    <Splitter unstyled="true">
      <SplitterPanel
        class="sidebar"
        :size="25"
      >
        <Tree
          v-model:selection-keys="selectedKey"
          :value="catalog.toc.children"
          :filter="true"
          filter-mode="lenient"
          :filter-placeholder="t('TailoringCatalog.search')"
          selection-mode="single"
          class="w-full md:w-[25rem]"
          @node-select="onSelectChapter"
          @contextmenu="onRightClickChapter($event)"
        />
        <ContextMenu
          ref="chapterContextMenu"
          :model="chapterContextMenuItems"
          @hide="chapter = null"
        />
      </SplitterPanel>

      <SplitterPanel
        class="content"
        :size="75"
      >
        <div class="header">
          <div class="flex pt-10 justify-between">
            <Breadcrumb :model="breadcrumbs" />
            <div v-if="chapter">
              <Button
                v-tooltip.bottom="t('TailoringCatalog.tooltip.setRequirementsApplicable')"
                icon="pi pi-check"
                rounded
                text
                @click="onStates(true)"
              />
              <Button
                v-tooltip.bottom="t('TailoringCatalog.tooltip.unsetRequirementsApplicable')"
                icon="pi pi-times"
                rounded
                text
                @click="onStates(false)"
              />
            </div>
          </div>
        </div>

        <DataView :value="requirements">
          <template #empty>
&nbsp;
          </template>
          <template #list="slotProps">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="text-left p-3 border-round-sm v-full"
            >
              <Card>
                <template #title>
                  <div class="flex items-center justify-between mb-0">
                    <p class="text-2xl">
                      {{ item.position }}
                      <span v-if="item.changed">({{ t('TailoringCatalog.changed') }})</span>
                    </p>
                    <ToggleSwitch
                      v-model="item.selected"
                      @click="onState(item)"
                    />
                  </div>
                </template>
                <template #subtitle>
                  <span v-if="item.reference != null">{{ item.reference }}</span>
                </template>
                <template #content>
                  <p
                    class="m-0 text-xl font-semibold requirement-card"
                    v-html="sanitizeHtml(item.text)"
                  />
                </template>
                <template #footer>
                  <div class="flex justify-end mb-0">
                    <Button
                      v-tooltip.bottom="t('TailoringCatalog.tooltip.editRequirement')"
                      variant="text"
                      icon="pi pi-pencil"
                      @click="onEdit(item)"
                    />
                    <Button
                      v-tooltip.bottom="t('TailoringCatalog.tooltip.createRequirement')"
                      variant="text"
                      icon="pi pi-plus"
                      @click="onNew(item)"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </DataView>
      </SplitterPanel>
    </Splitter>
    <ScrollTop
      :threshold="100"
      icon="pi pi-arrow-up"
      :button-props="{ severity: 'contrast', raised: true, rounded: true }"
    />
  </div>
</template>

<style scoped>
    .requirement-card :deep(ul) {
        display: block;
        list-style-type: disc;
        margin-top: 1em;
        margin-bottom: 1 em;
        margin-left: 0;
        margin-right: 0;
        padding-left: 40px;
}
</style>
