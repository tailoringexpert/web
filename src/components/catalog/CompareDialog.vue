<script setup>
import { ref, computed, toValue, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { useCompareDialog } from '@/composables/catalog/CompareDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useCompareDialog();
const { t } = useI18n();
const confirm = useConfirm();

const active = computed(() => {
    return props.active;
});

const catalogs = computed(() => state.catalogs);
const base = ref();
const revised = ref();

const onError = (title, message) => {
    emit('error', title, message);
};

const onClose = () => {
    emit('close:closed');
};

const onCompare = () => {
    console.log(base.value + ": " + revised.value);
    actions.compare(base, revised);
}

// hooks
onBeforeMount(() =>  {
    actions.initialize().catch((error) => {
        logger.debug(error);
    });
});
</script>

<template>
    <Dialog :visible="active" :wait :header="t('CompareDialog.title')" :modal="true" @update:visible="onClose">
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
            <Button :label="$t('CompareDialog.compare')" @click="onCompare" />
        </template>


        <div v-if="active" class="flex flex-col gap-1">
            <Select v-model="base" :options="catalogs" :placeholder="t('CompareDialog.base')" class="w-full md:w-56" />
            <Select v-model="revised" :options="catalogs" :placeholder="t('CompareDialog.revised')" class="w-full md:w-56" />
        </div>
    </Dialog>
</template>
