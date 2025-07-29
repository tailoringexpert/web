<script setup>
import { ref, computed, inject, toValue, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Step from 'primevue/step';
import { useToast } from 'primevue/usetoast';

import CatalogSelection from '@/components/catalog/CatalogSelection.vue';
import ScreeningsheetUpload from '@/components/screeningsheet/ScreeningsheetUpload.vue';
import SelectionVectorEdit from '@/components/selectionvector/SelectionVectorEdit.vue';
import SelectionVectorComparison from '@/components/selectionvector/SelectionVectorComparison.vue';

import router from '@/plugins/router';
import { useProjectNew } from '@/composables/ProjectNew';

// provided interfaces
const emit = defineEmits(['success', 'error']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, mutations, actions } = useProjectNew();
const { t } = useI18n();
const toast = useToast();

const step = ref(1);

const project = computed(() => state.project);

// step catalog selection
const onCatalogSelect = (payload) => {
    logger.debug('onCatalogSelect');
    mutations.catalog(payload);
};

const onNoteEdited = (payload) => {
    logger.debug('onNoteEdited');
    mutations.note(payload);
};

// step screeningsheet upload
const screeningsheet = computed(() => state.screeningsheet);

const onScreeningsheetUpload = (payload) => {
    logger.debug('onScreeningsheetUpload');
    mutations.screeningsheet(payload.screeningsheet);
    mutations.project(payload.screeningsheet.project);

    mutations.selectionvector({
        levels: payload.screeningsheet.selectionVector.levels
    });
};

// step selectionvector edit
const selectionVector = computed(() => state.selectionvector);

const onSelectionVectorModified = (payload) => {
    logger.debug('onSelectionVectorModified');
    mutations.selectionvector(payload.selectionVector);
    onSuccess(t('ProjectNew.editSelectionvector.title'), t('ProjectNew.editSelectionvector.state.success'));
};

// step summary
const onCreate = () => {
    logger.debug('onCreate');
    actions
        .create()
        .then(() => {
            onSuccess(t('ProjectNew.title'), t('ProjectNew.state.success'));
            router.push({
                name: 'project',
                params: {
                    id: toValue(project)
                }
            });
        })
        .catch((error) => {
            onError(t('error'), error.data);
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
    store.mutations.breadcrumbs([
        {
            label: t('project', 2),
            disabled: false,
            exact: true,
            route: { name: 'projects' }
        }
    ]);
});
</script>

<template>
    <div class="card justify-center" fluid>
        <Stepper :value="step" class="basis-[50rem]">
            <StepList>
                <Step :value="1">
                    {{ t('ProjectNew.catalog') }}
                </Step>
                <Step :value="2">
                    {{ t('ProjectNew.screeningsheet') }}
                </Step>
                <Step :value="3">
                    {{ t('ProjectNew.selectionvector') }}
                </Step>
                <Step :value="4">
                    {{ t('ProjectNew.summary') }}
                </Step>
            </StepList>

            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" :value="1">
                    <CatalogSelection @catalog-select="onCatalogSelect" @catalog-note="onNoteEdited" @success="onSuccess" @error="onError" />
                    <div class="flex pt-6 justify-end">
                        <Button :label="t('ProjectNew.next')" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback(2)" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" :value="2">
                    <ScreeningsheetUpload @screeningsheet:upload="onScreeningsheetUpload" @success="onSuccess" @error="onError" />
                    <div class="flex pt-6 justify-between">
                        <Button :label="t('ProjectNew.previous')" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                        <Button :label="t('ProjectNew.next')" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback(3)" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" :value="3">
                    <SelectionVectorEdit :selection-vector="screeningsheet.selectionVector" :project @selectionvector-modified="onSelectionVectorModified" @success="onSuccess" @error="onError" />
                    <div class="flex pt-6 justify-between">
                        <Button :label="t('ProjectNew.previous')" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(2)" />
                        <Button :label="t('ProjectNew.next')" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback(4)" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" :value="4">
                    <SelectionVectorComparison :project :selection-vector="screeningsheet.selectionVector" :edited-selection-vector="selectionVector" @success="onSuccess" @error="onError" />
                    <div class="flex pt-6 justify-between">
                        <Button :label="t('ProjectNew.previous')" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(3)" />
                        <Button :label="t('ProjectNew.next')" icon="pi pi-arrow-right" icon-pos="right" @click="onCreate" />
                    </div>
                </StepPanel>
            </StepPanels>
        </Stepper>
    </div>
</template>
