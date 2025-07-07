<script setup>
import { ref, watch, computed, toValue, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { useNotesDialog } from '@/composables/tailoring/NotesDialog';

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
const { state, mutations, actions } = useNotesDialog();
const { t } = useI18n();

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

const active = computed(() => {
    return props.active;
});

const notes = computed(() => state.notes);
const noteText = ref(null);

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.debug(error);
    });
};

// event handlers
const onNew = () => {
    logger.debug('onNew');
    let note = toValue(noteText);
    if (note == null) {
        return;
    }

    actions
        .create(note)
        .then(() => {
            noteText.value = null;
        })
        .catch((error) => {
            logger.debug(error);
        });
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('NotesDialog.title')" :modal="true" @update:visible="onClose">
        <div class="card">
            <Card class="mt-4">
                <template #content>
                    <Textarea id="note" v-model="noteText" rows="4" />
                    <Button :label="t('NotesDialog.add')" text @click="onNew" />
                </template>
            </Card>

            <Timeline :value="notes" align="alternate">
                <template #content="slotProps">
                    <Card class="mt-4">
                        <template #content>
                            <span>{{ slotProps.item.text }}</span>
                        </template>
                    </Card>
                </template>
            </Timeline>
        </div>
    </Dialog>
</template>
