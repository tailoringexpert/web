<script setup>
import { computed, inject, reactive, toValue, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFile } from '@/composables/file';
import { useMatrixFileDialog } from '@/composables/matrix/MatrixFileDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'success', 'error']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useMatrixFileDialog();
const { readAsBinary } = useFile();

watch(
    [() => props.active],
    () => {
        if (props.active) {
            initialize();
        }
    },
    { immediate: false }
);

const { t } = useI18n();

const catalogues = computed(() => state.catalogues);

const file = reactive({
    identifier: null,
    description: null,
    name: null,
    data: null
})


const initialize = () => {
    logger.debug("initialize");

    actions.initialize()
        .then(data => file.catalogueVersion = catalogues.value[0] );
};

// event handlers
const onSelect = (event) => {
    logger.debug("onSelect");
    readAsBinary(event?.files[0])
        .then((data) => {
            file.name = event?.files[0].name;
            file.data = data;
        })
};

const onSave = () => {
    logger.debug("onSave")

    if (!file.data) {
        onError(t('MatrixFileDialog.title'), t('MatrixFileDialog.error.nofile'));
        return;
    }

    actions
        .save(toValue(file))
        .then(() => {
            file.name = null;
            file.description = null;
            file.catalogueVersion = null;
            file.data = null;

            onSuccess(t('MatrixFileDialog.title'), t('MatrixFileDialog.state.success'));
            onClose();
        })
        .catch(() => {
            onError(t('MatrixFileDialog.title'), t('MatrixFileDialog.state.error'));
        });

}

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
  <Dialog
    :visible="active"
    :header="t('MatrixFileDialog.title')"
    :modal="true"
    @update:visible="onClose"
  >
    <template #footer>
      <Button
        :label="$t('close')"
        @click="onClose"
      />
      <Button
        :label="$t('save')"
        @click="onSave"
      />
    </template>

    <div class="card flex flex-col gap-4">
      <FileUpload
        mode="basic"
        custom-upload="true"
        multiple="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @select="onSelect"
      >
        <template #empty>
          <span>{{ t('MatrixFileDialog.files') }}</span>
        </template>
      </FileUpload>

      <div class="flex flex-col gap-2">
        <label for="description"> <span>{{ t('MatrixFileDialog.description') }}</span></label>
        <Textarea
          id="description"
          v-model="file.description"
          :auto-resize="true"
          rows="10"
          cols="80"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="catalogues"> <span>{{ t('MatrixFileDialog.catalogue') }}</span></label>
        <Select
          v-model="file.catalogueVersion"
          :options="catalogues"
          :placeholder="t('MatrixFileDialog.cataloguePlaceholder')"
          class="w-full md:w-56"
        />
      </div>
    </div>
  </Dialog>
</template>
