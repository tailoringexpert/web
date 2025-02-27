<script setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSelectionvectorComparison } from '@/composables/selectionvector/SelectionvectorComparison';

// provided interfaces
const props = defineProps({
    project: {
        type: String,
        default: ''
    },
    selectionVector: {
        type: Object,
        default: () => {
            return { levels: {} };
        }
    },
    editedSelectionVector: {
        type: Object,
        default: () => {
            return { levels: {} };
        }
    }
});

// injects

// internal
const { state, mutations, actions } = useSelectionvectorComparison();

watch(
    () => props.selectionVector,
    (value) => {
        mutations.calculatedSelectionvector(value);
        actions.initialize();
    },
    { immediate: true }
);

watch(
    () => props.editedSelectionVector,
    (value) => {
        mutations.editedSelectionvector(value);
        actions.initialize();
    },
    { immediate: true }
);

const { t } = useI18n();

const items = computed(() => state.comparedSelectionvectors);

// event handlers

// hooks
</script>

<template>
    <Card>
        <template #title>
            <div class="flex items-center justify-left mb-0">
                <span>{{ t('SelectionVectorComparison.project') }}: &nbsp;</span><span>{{ project }}</span>
            </div>
        </template>

        <template #content>
            <DataTable
                :value="items"
                data-key="label"
                striped-rows
                scrollable
                scroll-height="400px"
                table-style="min-width: 50rem"
                class="col-span-full"
            >
                <Column field="label" :header="t('SelectionVectorComparison.name')" />
                <Column field="calculated" :header="t('SelectionVectorComparison.calculatedSelectionvector')" />
                <Column field="modified" :header="t('SelectionVectorComparison.appliedSelectionvector')" />
            </DataTable>
        </template>
    </Card>
</template>
