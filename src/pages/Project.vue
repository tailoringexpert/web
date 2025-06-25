<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import TailoringNameDialog from '@/components/tailoring/TailoringNameDialog.vue';
import DownloadDialog from '@/components/tailoring/DownloadDialog.vue';
import ScreeningsheetDialog from '@/components/screeningsheet/ScreeningsheetDialog.vue';
import SelectionVectorDialog from '@/components/selectionvector/SelectionVectorDialog.vue';
import AttachmentsDialog from '@/components/tailoring/AttachmentsDialog.vue';
import ImportDialog from '@/components/tailoring/ImportDialog.vue';
import NotesDialog from '@/components/tailoring/NotesDialog.vue';

import router from '@/plugins/router';
import { useProject } from '@/composables/Project';

// provided interfaces
const emit = defineEmits(['success', 'error']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, getters, actions } = useProject();
const { t } = useI18n();

const confirm = useConfirm();
const toast = useToast();

const route = useRoute();

const project = computed(() => state.project);
const dialog = ref('none');
const data = ref(null);

const initialize = () => {
    dialog.value = 'none';

    actions.initialize();
};

const isTailoringEditable = (tailoring) => getters.isEditable(tailoring);
const isTailoringDeletable = (tailoring) => getters.isDeletable(tailoring);

// event handlers
const onNew = () => {
    logger.debug('onNew');
    router.push({
        name: 'tailoringnew',
        params: {
            id: project.value.name
        },
        state: {
            previous: route.params.self,
            self: project.value._links.tailoring.href,
            referer: project.value._links.self.href
        }
    });
};

const onState = (tailoring) => {
    logger.debug('onState');
    confirm.require({
        header: t('Project.updateState.title'),
        message: t('Project.updateState.text'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('no'),
            outlined: true
        },
        acceptProps: {
            label: t('yes'),
            severity: 'danger'
        },
        accept: () => {
            actions
                .updateState(tailoring)
                .then(() => {
                    onSuccess(
                        t('Project.updateState.state.title'),
                        t('Project.updateState.state.success')
                    );
                })
                .catch(() => {
                    onError(
                        t('Project.updateState.title'),
                        t('Project.updateState.error')
                    );
                });
        }
    });
};

const onBaseCatalog = (tailoring) => {
    logger.debug('onBaseCatalog');
    actions
        .getBaseCatalog(tailoring)
        .catch(() => {
            onError(
                t('Project.downloadBasecatalog.title'),
                new TextDecoder('utf-8').decode(new Uint8Array(error.data))
            );
        });
};

const onEdit = (tailoring) => {
    store.mutations.tailoring({
        name: project.value.name,
        _links: tailoring._links
    });

    router.push({
        name: 'catalog',
        params: {
            id: project.value.name,
            tailoring: tailoring.name
        }
    });
};

const onDelete = (tailoring) => {
    confirm.require({
        message: t('Project.deleteTailoring.text'),
        header: t('Project.deleteTailoring.title'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('no'),
            outlined: true
        },
        acceptProps: {
            label: t('yes'),
            severity: 'danger'
        },
        accept: () => {
            actions
                .delete(tailoring)
                .then(() => {
                    onSuccess(
                        t('Project.deleteTailoring.title'),
                        t('Project.deleteTailoring.state.success')
                    );
                })
                .catch((error) => {
                    onError(
                        t('Project.deleteTailoring.title'),
                        t('Project.deleteTailoring.state.error')
                    );
                });
        }
    });
};

const onScreeningsheet = (screeningsheet) => {
    onDialog('screeningsheet', screeningsheet);
};

const onSelectionvector = (tailoring) => {
    onDialog('selectionvector', tailoring);
};

const onCompare = (tailoring) => {
    actions.getComparison(tailoring);
};

const onName = (tailoring) => {
    onDialog('name', tailoring);
};

const onDownload = (tailoring) => {
    onDialog('download', tailoring);
};

const onAttachments = (tailoring) => {
    onDialog('attachments', tailoring);
};

const onNotes = (tailoring) => {
    onDialog('notes', tailoring);
};

const onImport = (tailoring) => {
    onDialog('import', tailoring);
};

const onDialog = (name, tailoring) => {
    dialog.value = name;
    data.value = tailoring;
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
            label: t('Project.project', 2),
            disabled: false,
            exact: true,
            route: { name: 'projects' }
        },
        {
            label: route.params.id,
            disabled: false,
            exact: true,
            route: { name: 'project', params: { id: route.params.id } }
        }
    ]);

    initialize();
});

const onUpdatedName = (name) => {
    data.value.name = name;
    dialog.value = 'none';
};
</script>

<template>
  <TailoringNameDialog
    :tailoring="data"
    :active="dialog === 'name'"
    @success="onSuccess"
    @error="onError"
    @close:cancel="dialog = 'none'"
    @close:close="initialize"
  />

  <DownloadDialog
    :tailoring="data"
    :active="dialog === 'download'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />

  <ScreeningsheetDialog
    :screeningsheet="data"
    :active="dialog === 'screeningsheet'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />

  <SelectionVectorDialog
    :tailoring="data"
    :active="dialog === 'selectionvector'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />

  <AttachmentsDialog
    :tailoring="data"
    :active="dialog === 'attachments'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />
  <ImportDialog
    :tailoring="data"
    :active="dialog === 'import'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />

  <NotesDialog
    :tailoring="data"
    :active="dialog === 'notes'"
    @success="onSuccess"
    @error="onError"
    @close:closed="dialog = 'none'"
  />

  <Card>
    <template #title>
      <div class="flex items-center justify-left mb-0">
        <span>{{ t('Project.project', 1) }}: &nbsp;</span><span>{{ project.name }}</span>
        <Button
          v-tooltip.bottom="t('Project.tooltip.openScreeningsheet')"
          variant="text"
          icon="pi pi-id-card"
          severity="secondary"
          rounded
          @click="onScreeningsheet(project)"
        />
      </div>
    </template>

    <template #content>
      <DataTable
        :value="project.tailorings"
        data-key="name"
        striped-rows
        table-style="min-width: 50rem"
        class="col-span-full"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 15, 20, 25]"
        paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        current-page-report-template="{first} to {last} of {totalRecords}"
      >
        <template #empty>
          No tailoring found.
        </template>
        <template #loading>
          {{ $t('Project.loading') }}
        </template>

        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">{{ $t('Project.tailoring') }}</span>
            <Button
              v-tooltip.bottom="t('Project.tooltip.newTailoring')"
              icon="pi pi-plus"
              rounded
              raised
              @click="onNew()"
            />
          </div>
        </template>

        <Column :header="t('Project.name')">
          <template #body="slotProps">
            <span @click="onName(slotProps.data)">{{ slotProps.data.name }}
              <Button
                v-tooltip.bottom="t('Project.tooltip.changeName')"
                icon="pi pi-pencil"
                variant="text"
                rounded
                @click="onName(slotProps.data)"
              />
            </span>
          </template>
        </Column>
        <Column
          field="phases"
          :header="t('Project.phases')"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.phases.join(', ') }}</span>
          </template>
        </Column>
        <Column :header="t('Project.state')">
          <template #body="slotProps">
            <span @click="onState(slotProps.data)">{{ slotProps.data.state }}
              <Button
                v-tooltip.bottom="t('Project.tooltip.updateState')"
                icon="pi pi-pencil"
                variant="text"
                rounded
                @click="onState(slotProps.data)"
              />
            </span>
          </template>
        </Column>
        <Column
          field="catalogVersion"
          :header="t('Project.catalog')"
        >
          <template #body="slotProps">
            <span @click="onBaseCatalog(slotProps.data)">{{ slotProps.data.catalogVersion }}
              <Button
                v-tooltip.bottom="t('Project.tooltip.downloadBasecatalog')"
                icon="pi pi-pencil"
                variant="text"
                rounded
                @click="onBaseCatalog(slotProps.data)"
              />
            </span>
          </template>
        </Column>
        <Column :header="t('Project.action')">
          <template #body="slotProps">
            <Button
              v-tooltip.bottom="t('Project.tooltip.editRequirements')"
              :disabled="!isTailoringEditable(slotProps.data)"
              variant="text"
              icon="pi pi-pen-to-square"
              severity="secondary"
              rounded
              @click="onEdit(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.downloadDocuments')"
              variant="text"
              icon="pi pi-download"
              severity="secondary"
              rounded
              @click="onDownload(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.compareTailoring')"
              :disabled="!isTailoringEditable(slotProps.data)"
              variant="text"
              icon="pi pi-verified"
              severity="secondary"
              rounded
              @click="onCompare(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.openScreeningsheet')"
              variant="text"
              icon="pi pi-id-card"
              severity="secondary"
              rounded
              @click="onScreeningsheet(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.openSelectionvector')"
              variant="text"
              icon="pi pi-lightbulb"
              severity="secondary"
              rounded
              @click="onSelectionvector(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.openAttachments')"
              variant="text"
              icon="pi pi-paperclip"
              severity="secondary"
              rounded
              @click="onAttachments(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.importRequirements')"
              variant="text"
              :disabled="!isTailoringEditable(slotProps.data)"
              icon="pi pi-file-excel"
              severity="secondary"
              rounded
              @click="onImport(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.openNotes')"
              variant="text"
              icon="pi pi-comments"
              severity="secondary"
              rounded
              @click="onNotes(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="t('Project.tooltip.deleteTailoring')"
              :disabled="!isTailoringDeletable(slotProps.data)"
              variant="text"
              icon="pi pi-trash"
              severity="secondary"
              rounded
              @click="onDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
