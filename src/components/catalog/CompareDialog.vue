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
const file = ref({});

const onError = (title, message) => {
    emit('error', title, message);
};

const onClose = () => {
    emit('close:closed');
};

const onSelect = (event) => {
    logger.debug('onSelect');
    file.value = event?.files[0];
};

const onCompareReleased = () => {
    logger.debug('onCompareReleased');
    console.log(base.value + ": " + revised.value);
    actions.compareReleased(base, revised);
}

const onComparePreview = () => {
    logger.debug('onComparePreview');

    console.log(file.value);
    if (!file.value) {
        return;
    }

    actions
        .comparePreview(base, file)
        .then(() => {
            onClose();
        })
        .catch((error) => {
            onError(t('error'), String.fromCharCode.apply(null, new Uint8Array(error)));
        });

}

// hooks
onBeforeMount(() =>  {
    actions.initialize().catch((error) => {
        logger.debug(error);
    });
});
</script>

<template>
    <Dialog :visible="active" :wait :header="t('CompareDialog.title')" :modal="true" @update:visible="onClose" >
        <template #footer>
            <Button :label="$t('close')" @click="onClose" />
        </template>


        <div v-if="active" class="flex flex-col card gap-5">

            <div class="flex-col justify">
                <label for="base">{{ t('CompareDialog.base')}}</label>
                <Select v-model="base" :options="catalogs" :placeholder="t('CompareDialog.base')"/>
            </div>
            <div class="flex flex-col flex-row">
                <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                    <div class="flex flex-col gap-2">
                        <label for="revised">{{ t('CompareDialog.revised')}}</label>
                        <Select v-model="revised" :options="catalogs" :placeholder="t('CompareDialog.revised')" class="w-full md:w-56" />
                    </div>
                    <div class="flex">
                          <Button :label="$t('CompareDialog.compare')" @click="onCompareReleased" class="w-full max-w-[17.35rem] mx-auto"></Button>
                    </div>
                </div>
                <div class="w-full md:w-2/12">
                    <Divider layout="vertical" class="hidden! md:flex!"><b>OR</b></Divider>
                    <Divider layout="horizontal" class="flex! md:hidden!" align="center"><b>OR</b></Divider>
                </div>
                <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                      <div class="flex flex-wrap gap-2 items-center justify-between">
                        <label for="file">{{ t('CompareDialog.revised')}}</label>
                        <FileUpload id="file" mode="basic" multiple="false" accept="application/json" :maxFileSize="20000000" @select="onSelect" customUpload />
                    </div>
                    <div class="flex">
                          <Button :label="$t('CompareDialog.compare')" @click="onComparePreview" class="w-full max-w-[17.35rem] mx-auto"></Button>
                    </div>

                </div>
            </div>


            <!--div class="flex flex-col gap-2">
                <label for="base">{{ t('CompareDialog.base')}}</label>
                <Select v-model="base" :options="catalogs" :placeholder="t('CompareDialog.base')" class="w-full md:w-56" />
            </div>

            <div class="w-full flex md:flex-col md:flex-row">
                <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                    <div class="flex flex-col gap-2">
                        <label for="revised">{{ t('CompareDialog.revised')}}</label>
                        <Select v-model="revised" :options="catalogs" :placeholder="t('CompareDialog.revised')" class="w-full md:w-56" />
                    </div>
                    <div class="flex">
                        <Button :label="$t('CompareDialog.compare')" @click="onCompareReleased" class="w-full max-w-[17.35rem] mx-auto"></Button>
                    </div>
                </div>
                <div class="w-full md:w-2/12">
                    <Divider layout="vertical" class="hidden! md:flex!"><b>OR</b></Divider>
                    <Divider layout="horizontal" class="flex! md:hidden!" align="center"><b>OR</b></Divider>
                </div>
                <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                    <div class="card flex flex-col gap-6 items-center justify-center">
                        <Toast />
                        <label for="file">{{ t('CompareDialog.revised')}}</label>
                        <FileUpload id="file" mode="basic" multiple="false" accept="application/json" :maxFileSize="20000000" @select="onSelect" customUpload />
                        <Button :label="$t('CompareDialog.compare')" @click="onComparePreview"></Button>
                    </div>
                </div>
            </div-->

        </div>
    </Dialog>
</template>
