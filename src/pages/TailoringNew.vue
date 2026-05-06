<script setup>
import Step from 'primevue/step';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Stepper from 'primevue/stepper';
import { useToast } from 'primevue/usetoast';
import { computed, inject, onBeforeMount, ref, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

import CatalogSelection from '@/components/catalog/CatalogSelection.vue';
import ScreeningsheetUpload from '@/components/screeningsheet/ScreeningsheetUpload.vue';
import SelectionVectorComparison from '@/components/selectionvector/SelectionVectorComparison.vue';
import SelectionVectorEdit from '@/components/selectionvector/SelectionVectorEdit.vue';

import { useTailoringNew } from '@/composables/TailoringNew';
import router from '@/plugins/router';

// provided interfaces
const emit = defineEmits(['success', 'error']);

// injects
const store = inject('store');
const logger = inject('logger');

// internal
const { state, mutations, actions } = useTailoringNew();
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
    onSuccess(t('TailoringNew.editSelectionvector.title'), t('TailoringNew.editSelectionvector.state.success'));
};

const onMatrixLoaded = (payload) => {
    logger.debug('onMatrixLoaded');
    mutations.matrix(payload);
    onSuccess(t('TailoringNew.loadMatrix.title'), payload == null ? t('TailoringNew.loadMatrix.state.removed'): t('TailoringNew.loadMatrix.state.success'));
};

// step summary
const onCreate = () => {
    logger.debug('onCreate');
    actions
        .create()
        .then(() => {
            onSuccess(t('TailoringNew.title'), t('TailoringNew.state.success'));
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
  <div
    class="card justify-center"
    fluid
  >
    <Stepper
      :value="step"
      class="basis-[50rem]"
    >
      <StepList>
        <Step :value="1">
          {{ t('TailoringNew.catalog') }}
        </Step>
        <Step :value="2">
          {{ t('TailoringNew.screeningsheet') }}
        </Step>
        <Step :value="3">
          {{ t('TailoringNew.selectionvector') }}
        </Step>
        <Step :value="4">
          {{ t('TailoringNew.summary') }}
        </Step>
      </StepList>

      <StepPanels>
        <StepPanel
          v-slot="{ activateCallback }"
          :value="1"
        >
          <CatalogSelection
            @catalog-select="onCatalogSelect"
            @catalog-note="onNoteEdited"
            @success="onSuccess"
            @error="onError"
          />
          <div class="flex pt-6 justify-end">
            <Button
              :label="t('TailoringNew.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="activateCallback(2)"
            />
          </div>
        </StepPanel>
        <StepPanel
          v-slot="{ activateCallback }"
          :value="2"
        >
          <ScreeningsheetUpload
            @screeningsheet:upload="onScreeningsheetUpload"
            @success="onSuccess"
            @error="onError"
          />
          <div class="flex pt-6 justify-between">
            <Button
              :label="t('TailoringNew.previous')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(1)"
            />
            <Button
              :label="t('TailoringNew.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="activateCallback(3)"
            />
          </div>
        </StepPanel>
        <StepPanel
          v-slot="{ activateCallback }"
          :value="3"
        >
          <SelectionVectorEdit
            :selection-vector="screeningsheet.selectionVector"
            :project
            @selectionvector-modified="onSelectionVectorModified"
            @matrix-loaded="onMatrixLoaded"
            @success="onSuccess"
            @error="onError"
          />
          <div class="flex pt-6 justify-between">
            <Button
              :label="t('TailoringNew.previous')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(2)"
            />
            <Button
              :label="t('TailoringNew.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="activateCallback(4)"
            />
          </div>
        </StepPanel>
        <StepPanel
          v-slot="{ activateCallback }"
          :value="4"
        >
          <SelectionVectorComparison
            :project
            :selection-vector="screeningsheet.selectionVector"
            :edited-selection-vector="selectionVector"
            @success="onSuccess"
            @error="onError"
          />
          <div class="flex pt-6 justify-between">
            <Button
              :label="t('TailoringNew.previous')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(3)"
            />
            <Button
              :label="t('TailoringNew.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="onCreate"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
