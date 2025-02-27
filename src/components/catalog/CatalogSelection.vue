<script setup>
import { ref, computed, watch, toValue, inject, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogSelection } from '@/composables/catalog/CatalogSelection';

// provided interfaces
const emit = defineEmits(['catalog-select', 'catalog-note']);

// injects
const logger = inject('logger');

// internal
const { state, mutations, actions } = useCatalogSelection();
const { t } = useI18n();

const catalogs = computed(() => state.catalogs);
const catalog = computed(() => state.catalog);
const note = ref(null);

watch(catalog, (newValue) => {
    mutations.catalog(newValue);
    emit('catalog-select', newValue);
});

const initialize = () => {
    actions.initialize().catch((error) => {
        logger.debug(error);
    });
};

// event handlers
const onNoteUpdate = () => {
    mutations.note(note);
    emit('catalog-note', toValue(note));
};

// hooks
onBeforeMount(() => initialize());
</script>

<template>
    <div class="card flex flex-col gap-4">
        <Select v-model="catalog.project" :options="catalogs" option-label="version" option-value="project" :placeholder="t('CatalogSelection.placeholder')" class="w-full md:w-56" />

        <div class="flex flex-wrap">
            <label for="note">{{ t('CatalogSelection.note') }}</label>
            <Textarea id="note" rows="4" fluid @blur="onNoteUpdate" />
        </div>
    </div>
</template>
