<script setup>
import { ref, watch, computed, inject, toValue } from "vue";
import { notifySuccess } from "vuetify3-dialog";
import { useI18n } from "vue-i18n";

import { useSelectionvectorEdit } from "@/composables/selectionvector/SelectionvectorEdit";

import { mdiPencil } from "@mdi/js";

// provided interfaces
const props = defineProps({
    project: {
        type: String,
        default: "",
    },
    selectionVector: {
        type: Object,
        default: () => {
            return { levels: {} };
        },
    },
});
const emit = defineEmits(["selectionvector-modified"]);

// inkjects
const logger = inject("logger");

// internal
const { state, mutations, actions } = useSelectionvectorEdit();
const { t } = useI18n();
const active = ref(false);

const profiles = computed(() => state.profiles);
const profile = ref();

const items = computed(() => state.levels);

const headers = ref([
    {
        text: t("name"),
        align: "start",
        sortable: true,
        value: "label",
        width: "50%",
    },
    {
        text: t("value"),
        value: "value",
        sortable: false,
        width: "50%",
    },
]);

const editItem = ref();

watch(
    () => props.selectionVector,
    (newValue) => {
        logger.debug("selectionvector changed");
        mutations.selectionvector(newValue);
        actions.initialize();
    },
    { immediate: true }
);
watch(profile, (newValue) => {
    logger.debug("profile changed");
    mutations.selectionvector(newValue);
    actions.initialize();

    emit("selectionvector-modified", {
        selectionVector: { levels: newValue.levels },
    });
});

// event handlers
const onEdit = (item) => {
    editItem.value = Object.assign({}, item);
    active.value = true;
};

const onSave = () => {
    logger.debug("Saving updated level parameter");
    actions.update(editItem.value).then((response) => {
        Object.assign(editItem, null);
        active.value = false;

        emit("selectionvector-modified", {
            selectionVector: response,
        });

        notifySuccess(t("selectionvector_edit.state.success"), {
            location: "bottom center",
        });
    });
};

const onCancel = () => {
    Object.assign(editItem, null);
    active.value = false;

    notifySuccess(t("selectionvector_edit.state.cancel"), {
        location: "bottom center",
    });
};
// hooks
</script>

<template>
  <v-row>
    <v-col class="col">
      {{ $t("project") }}
    </v-col>
    <v-col>{{ project }}</v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
      >
        <template #header.value>
          <v-select
            v-model="profile"
            :items="profiles"
            item-title="name"
            item-value="value"
            return-object
            label="Profile"
          />
        </template>

        <template #top>
          <v-dialog
            v-model="active"
            max-width="500px"
          >
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <span v-text="editItem.label" />
                    </v-col>

                    <v-col>
                      <v-text-field
                        v-model="editItem.value"
                        label="Level"
                        autofocus
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="onCancel"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="onSave"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template #item.value="props">
          <div>
            {{ props.item.value }}
            <v-icon
              :icon="mdiPencil"
              class="me-2"
              @click="onEdit(props.item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
