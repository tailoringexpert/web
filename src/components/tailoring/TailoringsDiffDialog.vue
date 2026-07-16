<script setup>
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTailoringsDiffDialog } from '@/composables/tailoring/TailoringsDiffDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'success', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    tailoring: {
        type: Object,
        default: null
    },
    project: {
        type: Object,
        default: null
    }
});

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useTailoringsDiffDialog();
watch(
    [() => props.project, () => props.tailoring, () => props.active],
    ([newProject, newTailoring, isActive]) => {
        mutations.project(newProject);

        if (isActive && newTailoring) {
            mutations.tailoring(newTailoring);
            initialize();
        }
    },
    { immediate: false }
);

const { t } = useI18n();
const projects = computed(() => state.projects);


const initialize = () => {
    actions.initialize();
};

const selectedTailoring = ref(null);

// event handlers
const onSelect = (tailoring) => {
    mutations.selectedTailoring(tailoring);
};

const onDiff = () => {
    actions.onDiff()
        .then(() => {
            onSuccess(t('TailoringsDiffDialog.title'), t('TailoringsDiffDialog.state.success'));
        })
        .catch((error) => {
            logger.error(error);
            onError(t('TailoringsDiffDialog.title'), t('TailoringNaTailoringsDiffDialogmeDialog.state.error'));
        });
};

const onSuccess = (title, message) => {
    emit('success', title, message);
};

const onError = (title, message) => {
    emit('error', title, message);
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('TailoringsDiffDialog.title', { project: project })" :modal="true"
        @update:visible="onClose">

        <div class="card">
            <div class="flex flex-col gap-4 mb-4">
                <Message severity="secondary">{{ project }}/{{ tailoring.name }} to</Message>
                <TreeSelect v-model="selectedTailoring" :options="projects" selectionMode="single"
                    placeholder="Wähle ein Element" class="w-full md:w-20rem" @update:modelValue="onSelect" filter
                    :filterInputAutoFocus="true" />
            </div>
        </div>
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
            <Button :label="$t('TailoringsDiffDialog.diff')" @click="onDiff" />
        </template>

    </Dialog>
</template>
