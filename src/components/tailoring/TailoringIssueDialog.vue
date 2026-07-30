<script setup>
import { useToast } from 'primevue/usetoast';
import { inject, ref, toValue, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useIssueDialog } from '@/composables/tailoring/TailoringIssueDialog';

// provided interfaces
const emit = defineEmits(['close:cancel', 'close:close', 'success', 'error']);
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
const { mutations, actions } = useIssueDialog();

watch(
    () => props.tailoring,
    (value) => {
        mutations.tailoring(value);
        if (props.active) {
            issue.value = value.issue;
        }
    }
);

const toast = useToast();
const { t } = useI18n();

const issue = ref();

// event handlers
const onClose = () => {
    name.value = props.tailoring.issue;
    emit('close:cancel');
};

const onSave = () => {
    actions
        .save(toValue(issue))
        .then(() => {
            emit('close:close', toValue(name));
            onSuccess(t('TailoringIssueDialog.title'), t('TailoringIssueDialog.state.success'));
        })
        .catch((error) => {
            logger.error(error);
            onError(t('TailoringIssueDialog.title'), t('TailoringIssueDialog.state.error'));
        });
};

const onSuccess = (title, message) => {
    emit('success', title, message);
};

const onError = (title, message) => {
    emit('error', title, message);
};

// hooks
</script>

<template>
    <Dialog :visible="active" :header="t('TailoringIssueDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="t('close')" @click="onClose" />
            <Button :label="t('save')" @click="onSave" />
        </template>

        <div class="grid grid-cols-12 gap-2">
            <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">{{
                t('TailoringIssueDialog.name')
                }}</label>
            <div class="col-span-12 md:col-span-10">
                <InputText id="issue" v-model="issue" type="text" v-keyfilter="/[^/]/" />
            </div>
        </div>
    </Dialog>
</template>
