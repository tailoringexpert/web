<script setup>
import { ref, watch, toValue, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useNameDialog } from '@/composables/tailoring/TailoringNameDialog';

// provided interfaces
const emit = defineEmits(['close:cancel', 'close:close']);
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
const { mutations, actions } = useNameDialog();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
        if (props.active) {
            name.value = value.name;
        }
    }
);

const toast = useToast();
const { t } = useI18n();

const name = ref();

// event handlers
const onClose = () => {
    name.value = props.tailoring.name;
    emit('close:cancel');
};

const onSave = () => {
    actions
        .save(toValue(name))
        .then(() => {
            emit('close:close', toValue(name));
            onSuccess(t('TailoringNameDialog.state.title'), t('TailoringNameDialog.state.success'));
        })
        .catch((error) => {
            logger.error(error);
        });
};

const onSuccess = (title, message) => {
    toast.add({
        severity: 'success',
        summary: title,
        detail: message,
        life: 3000
    });
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('TailoringNameDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="t('close')" @click="onClose" />
            <Button :label="t('save')" @click="onSave" />
        </template>

        <div class="grid grid-cols-12 gap-2">
            <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">{{ t('TailoringNameDialog.name') }}</label>
            <div class="col-span-12 md:col-span-10">
                <InputText id="name" v-model="name" type="text" />
            </div>
        </div>
    </Dialog>
</template>
