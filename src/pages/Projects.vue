<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@/plugins/router';

import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import { useProjects } from '@/composables/Projects';

// provided interfaces
const emit = defineEmits(['close:closed', 'success', 'error']);

// injects
const store = inject('store');
const logger = inject('logger');

const confirm = useConfirm();
const toast = useToast();

// internal
const { state, mutations, actions } = useProjects();
const { t } = useI18n();

const _state = ref('ONGOING');
const states = computed(() => state.states);
const filters = ref({ state: { value: null, matchMode: FilterMatchMode.EQUALS } });

const projects = computed(() => state.projects);

const initialize = () => {
    actions.initialize();
};

// event handlers
const onNew = () => {
    logger.debug('onNew');
    router.push({
        name: 'projectnew'
    });
};

const onState = (project) => {
    confirm.require({
        header: t('Projects.updateState.title'),
        message: t('Projects.updateState.text'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('no'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('yes'),
            severity: 'danger'
        },
        accept: () => {
            actions
                .updateState(project)
                .then(() => {
                    onSuccess(t('Projects.updateState.state.title'), t('Projects.updateState.state.success'));
                })
                .catch((error) => {
                    onError(t('Projects.updateState.state,title'), t('Projects.updateState.state.error'));
                });
        }
    });
};

const onEdit = (project) => {
    store.mutations.project(project);
    router.push({
        name: 'project',
        params: {
            id: project.name
        }
    });
};

const onDelete = (project) => {
    logger.debug('onDelete');
    confirm.require({
        message: t('Projects.delete.text'),
        header: t('Projects.delete.title'),
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: t('no'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('yes'),
            severity: 'danger'
        },
        accept: () => {
            actions
                .delete(project)
                .then(() => {
                    onSuccess(t('Projects.delete.title'), t('Projects.delete.state.success'));
                })
                .catch((error) => {
                    console.log(error);
                    onError(t('Projects.delete.title'), t('Projects.delete.state.success'));
                });
        }
    });
};

const onSuccess = (title, message) => {
    emit('success', title, message);
};

const onError = (title, message) => {
    emit('error', title, message);
};

// hooks
onBeforeMount(() => {
    logger.debug('onBeforeMount');
    store.mutations.breadcrumbs([
        {
            label: t('Projects.project', 2),
            disabled: false,
            exact: true,
            route: { name: 'projects' }
        }
    ]);

    initialize();
});
</script>

<template>
    <div class="card">
        <DataTable
            v-model:filters="filters"
            :value="projects"
            data-key="name"
            :filters="filters"
            filter-display="menu"
            striped-rows
            table-style="min-width: 50rem"
            paginator
            :rows="10"
            :rows-per-page-options="[10, 15, 20, 25]"
            paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            current-page-report-template="{first} to {last} of {totalRecords}"
        >
            <template #empty> No Projects found. </template>
            <template #loading>
                {{ t('Projects.loading') }}
            </template>

            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">{{ $t('Projects.project') }}</span>
                    <Button v-tooltip.bottom="t('Projects.tooltip.new')" icon="pi pi-plus" rounded raised @click="onNew()" />
                </div>
            </template>

            <Column field="name" :header="t('Projects.name')" />
            <Column field="creationTimestamp" :header="t('Projects.createdAt')" />
            <Column :header="t('Projects.state')">
                <template #body="slotProps">
                    <span @click="onState(slotProps.data)"
                        >{{ slotProps.data.state }}
                        <Button v-tooltip.bottom="t('Projects.tooltip.state')" icon="pi pi-pencil" variant="text" rounded @click="onState(slotProps.data)" />
                    </span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select v-model="filterModel.value" :options="states" placeholder="Select One" show-clear @change="filterCallback()" />
                </template>
            </Column>
            <Column :header="t('Projects.action')">
                <template #body="slotProps">
                    <Button v-tooltip.bottom="t('Projects.tooltip.edit')" variant="text" icon="pi pi-pencil" severity="secondary" rounded @click="onEdit(slotProps.data)" />
                    <Button v-tooltip.bottom="t('Projects.tooltip.delete')" variant="text" icon="pi pi-trash" severity="secondary" rounded @click="onDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script></script>
