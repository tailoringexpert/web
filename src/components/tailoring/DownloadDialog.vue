<script setup>
import { ref, watch, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import SignatureDialog from '@/components/tailoring/SignatureDialog.vue';

import { useDownloadDialog } from '@/composables/tailoring/DownloadDialog';

// provided interfaces
const emit = defineEmits(['close:closed', 'error']);
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
const { state, mutations, actions } = useDownloadDialog();

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
const confirm = useConfirm();

const signatures = computed(() => state.signatures);
const isSignature = ref(false);
const signature = ref(null);

const initialize = () => {
    actions.initialize();
};

const downloadFile = (link) => {
    actions.download(link).catch((error) => {
        onError(t('error'), String.fromCharCode.apply(null, new Uint8Array(error)));
    });
};

// event handlers
const onCatalog = () => {
    logger.debug('onCatalog');
    downloadFile(props.tailoring._links.tailoringcatalog.href);
};

const onZip = () => {
    logger.debug('onZip');
    downloadFile(props.tailoring._links.document.href);
};

const onEditSignature = (item) => {
    isSignature.value = true;
    signature.value = item;
};

const onCloseSignature = () => {
    isSignature.value = false;
    initialize();
};

const onSuccess = (title, message) => {
    emit("success", title, message);
};

const onError = (title, message) => {
    emit("error", title, message);
};

const onClose = () => {
    emit('close:closed');
};

// hooks
</script>

<template>
  <SignatureDialog
    :active="isSignature"
    :signature
    @success="onSuccess"
    @error="onError"
    @close:closed="onCloseSignature()"
    @close:canceled="isSignature = false"
  />

  <Dialog
    :visible="active"
    :header="t('DownloadDialog.title')"
    :modal="true"
    @update:visible="onClose"
  >
    <template #footer>
      <Button
        :label="$t('close')"
        @click="onClose"
      />
      <Button
        :label="$t('DownloadDialog.catalog')"
        @click="onCatalog"
      />
      <Button
        :label="$t('DownloadDialog.download')"
        @click="onZip"
      />
    </template>

    <DataTable
      :value="signatures"
      data-key="faculty"
      striped-rows
      scrollable
      scroll-height="400px"
      table-style="min-width: 50rem"
    >
      <template #loading>
        {{ downloaddialog.loading }}
      </template>

      <Column
        field="faculty"
        :header="t('DownloadDialog.faculty')"
      />
      <Column
        field="signee"
        :header="t('DownloadDialog.signee')"
      />
      <Column
        field="state"
        :header="t('DownloadDialog.signatureState')"
      />
      <Column :header="t('DownloadDialog.applicable')">
        <template #body="{ data }">
          <i
            class="pi"
            :class="{ 'pi-check-circle text-green-500 ': data.applicable, 'pi-times-circle text-red-500': !data.applicable }"
          />
        </template>
      </Column>
      <Column :header="t('DownloadDialog.action')">
        <template #body="slotProps">
          <Button
            v-tooltip.bottom="t('DownloadDialog.tooltip.editSignature')"
            variant="text"
            icon="pi pi-pen-to-square"
            severity="secondary"
            rounded
            @click="onEditSignature(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>
