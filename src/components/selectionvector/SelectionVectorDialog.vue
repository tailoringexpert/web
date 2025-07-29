<script setup>
import { inject, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSelectionvectorDialog } from '@/composables/selectionvector/SelectionvectorDialog';

// provided interfaces
const emit = defineEmits(['close:closed']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    tailoring: {
        type: Object,
        default: null
    }
});

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useSelectionvectorDialog();

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

const { t } = useI18n();

const isActive = computed(() => props.active);
const items = computed(() => state.levels);

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.error(error);
    });
};

// event handlers
const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('SelectionVectorDialog.applied')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>

        <DataTable :value="items" data-key="label" striped-rows scrollable scroll-height="400px" table-style="min-width: 50rem">
            <template #loading>
                {{ t('SelectionVectorDialog.loading') }}
            </template>

            <Column field="label" :header="t('SelectionVectorDialog.name')" />
            <Column field="value" :header="t('SelectionVectorDialog.value')" />
        </DataTable>
    </Dialog>
</template>
