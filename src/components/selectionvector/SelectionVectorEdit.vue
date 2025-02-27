<script setup>
import { ref, watch, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useSelectionvectorEdit } from '@/composables/selectionvector/SelectionvectorEdit';

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
    }
});
const emit = defineEmits(['selectionvector-modified']);

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useSelectionvectorEdit();
const { t } = useI18n();
const toast = useToast();

const active = ref(false);

const profiles = computed(() => state.profiles);
const profile = ref();

const items = computed(() => state.levels);
const editItem = ref();

watch(
    () => props.selectionVector,
    (newValue) => {
        mutations.selectionvector(newValue);
        actions.initialize();
    },
    { immediate: true }
);
watch(profile, (newValue) => {
    logger.debug('profile changed');
    mutations.selectionvector(newValue);
    actions.initialize();

    emit('selectionvector-modified', {
        selectionVector: { levels: newValue.levels }
    });
});

// event handlers
const onEdit = (item) => {
    logger.debug('onEdit');
    editItem.value = Object.assign({}, item);
    active.value = true;
};

const onSave = () => {
    logger.debug('onSave');
    actions.update(editItem.value).then((response) => {
        Object.assign(editItem, null);
        active.value = false;

        emit('selectionvector-modified', {
            selectionVector: response
        });
    });
};

const onCancel = () => {
    logger.debug('onCancel');
    Object.assign(editItem, null);
    active.value = false;

    toast.add({
        severity: 'info',
        summary: 'Parameter',
        detail: t('SelectionVectorEdit.parameterdialog.state.cancel'),
        life: 3000
    });
};
// hooks
</script>

<template>
    <Dialog v-model:visible="active" :style="{ width: '450px' }" :header="t('SelectionVectorEdit.parameterdialog.title')" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="value" class="block font-bold mb-3">{{ editItem.label }}</label>
                <InputText id="value" v-model.trim="editItem.value" required="true" autofocus :invalid="submitted && !editItem.value" fluid />
                <small v-if="submitted && !editItem.value" class="text-red-500">{{ t('SelectionVectorEdit.parameterdialog.required.value') }}</small>
            </div>
        </div>

        <template #footer>
            <Button :label="t('cancel')" icon="pi pi-times" text @click="OnCancel" />
            <Button :label="t('save')" icon="pi pi-check" @click="onSave" />
        </template>
    </Dialog>

    <Card>
        <template #title>
            <div class="flex items-center justify-left mb-0">
                <span>{{ t('SelectionVectorEdit.project') }}: &nbsp;</span><span>{{ project }}</span>
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
                <template #empty>
                    {{ t('SelectionVectorEdit.empty') }}
                </template>
                <template #loading>
                    {{ t('SelectionVectorEdit.loading') }}
                </template>

                <template #header>
                    <div class="flex flex-wrap items-end justify-end gap-2">
                        <Select v-model="profile" :options="profiles" option-label="name" :placeholder="t('SelectionVectorEdit.profilePlaceholder')" />
                    </div>
                </template>

                <Column field="label" :header="t('SelectionVectorEdit.name')" />
                <Column :header="t('SelectionVectorEdit.value')">
                    <template #body="slotProps">
                        <span @click="onEdit(slotProps.data)"
                            >{{ slotProps.data.value }}
                            <Button icon="pi pi-pencil" variant="text" rounded @click="onEdit(slotProps.data)" />
                        </span>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>
