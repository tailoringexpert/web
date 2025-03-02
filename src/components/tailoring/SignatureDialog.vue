<script setup>
import { reactive, watch, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useSignatureDialog } from '@/composables/tailoring/SignatureDialog';

// provided interfaces
const emit = defineEmits(['close:canceled', 'close:closed', 'success']);
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    signature: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

// injects
const logger = inject('logger');

// internal
const { t } = useI18n();
const toast = useToast();

const { mutations, actions } = useSignatureDialog();
const _signature = reactive({});

watch(
    () => props.signature,
    (value) => {
        _signature._links = value._links;
        _signature.signee = value.signee;
        _signature.state = value.state;
        _signature.faculty = value.faculty;
        _signature.applicable = value.applicable;
        mutations.signature(_signature);
    }
);

const isActive = computed(() => {
    return props.active;
});

// event handlers
const onClose = () => {
    logger.debug('onClose');
    emit('close:canceled');
};

const onSave = () => {
    logger.debug('onSave');
    mutations.signature(_signature);
    actions
        .save()
        .then(() => {
            onSuccess(
                _signature.faculty,
                t('SignatureDialog.state.success')
            );
            emit('close:closed');
        })
        .catch((error) => {
            logger.error(error);
        });
};

const onSuccess = (title, message) => {
    emit("success", title, message);
};

// hooks
</script>

<template>
  <Dialog
    :visible="active"
    :header="_signature.faculty"
    :modal="true"
    @update:visible="onClose"
  >
    <template #footer>
      <Button
        :label="$t('close')"
        align-items-start
        @click="onClose"
      />
      <Button
        :label="$t('save')"
        align-items-end
        @click="onSave"
      />
    </template>

    <div class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="signee">{{ t('SignatureDialog.name') }}</label>
        <InputText
          id="signee"
          v-model="_signature.signee"
          type="text"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="state">{{ t('SignatureDialog.signaturestate') }}</label>
        <InputText
          id="state"
          v-model="_signature.state"
          type="text"
        />
      </div>
      <div class="flex items-center">
        <Checkbox
          id="applicable"
          v-model="_signature.applicable"
          binary
        />
        <label
          for="applicable"
          class="ml-2"
        >{{ t('SignatureDialog.applicable') }}</label>
      </div>
    </div>
  </Dialog>
</template>
