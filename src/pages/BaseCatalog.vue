<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useI18n } from "vue-i18n";

import { useBaseCatalog } from "@/composables/BaseCatalog";

import {
    mdiUpdate,
    mdiFilePdfBox,
    mdiCodeJson,
    mdiMicrosoftExcel,
    mdiFolderZip,
} from "@mdi/js";

import Wait from "@/components/wait/Wait";
import Excel2JsonConverter from "@/components/catalog/Excel2JsonConverter";
import Json2PdfConverter from "@/components/catalog/Json2PdfConverter";

// provided interfaces

// injects
const logger = inject("logger");

// internal
const { state, actions } = useBaseCatalog();
const { t } = useI18n();

const waits = reactive({
    default: {
        title: "Loading data...",
        icon: mdiUpdate,
    },
    pdf: {
        title: "Downloading PDF",
        icon: mdiFilePdfBox,
    },
    json: {
        title: "Downloading JSON",
        icon: mdiCodeJson,
    },
    excel: {
        title: "Downloading Excel",
        icon: mdiMicrosoftExcel,
    },
    zip: {
        title: "Downloading archive",
        icon: mdiFolderZip,
    },
});
const wait = reactive({
    active: false,
    config: waits.default,
});

const dialog = ref("none");

const headers = ref([
    {
        text: t("catalog"),
        sortable: true,
        value: "version",
    },
    {
        text: t("validFrom"),
        sortable: true,
        value: "validFrom",
    },
    {
        text: t("validUntil"),
        sortable: true,
        value: "validUntil",
    },
    {
        text: t("action", 2),
        value: "actions",
        sortable: false,
    },
]);
const catalogs = computed(() => state.catalogs);

const initialize = () => {
    wait.active = true;
    wait.config = waits.default;

    actions
        .initialize()
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

// event handlers
const onPDF = (item) => {
    wait.active = true;
    wait.config = waits.pdf;

    actions
        .pdf(item)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

const onJSON = (item) => {
    wait.active = true;
    wait.config = waits.json;

    actions
        .json(item)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

const onExcel = (item) => {
    wait.active = true;
    wait.config = waits.excel;

    actions
        .excel(item)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

const onZip = (item) => {
    wait.active = true;
    wait.config = waits.zip;

    actions
        .zip(item)
        .then(() => {
            wait.active = false;
        })
        .catch((error) => {
            wait.active = false;
            logger.error(error);
        });
};

const onConvert = () => {
    logger.debug("onConvert");
    dialog.value = "excel2Json";
};

const onPreview = () => {
    logger.debug("onPreview");
    dialog.value = "json2pdf";
};

// hooks
initialize();
</script>

<template>
  <Wait :wait />

  <Excel2JsonConverter
    :active="dialog === 'excel2Json'"
    @close:closed="dialog = 'none'"
  />

  <Json2PdfConverter
    :active="dialog === 'json2pdf'"
    @close:closed="dialog = 'none'"
  />

  <section class="view">
    <v-card class="card-top">
      <v-toolbar flat>
        <v-toolbar-title>
          {{ $t("catalog", 2) }}
        </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-btn
          color="primary"
          class="mb-2"
          @click="onConvert"
        >
          {{ $t("basecatalog.convert") }}
        </v-btn>
        <v-btn
          color="primary"
          class="mb-2"
          @click="onPreview"
        >
          {{ $t("basecatalog.preview") }}
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-card class="table-container">
      <v-data-table
        :headers="headers"
        :items="catalogs"
        :items-per-page="20"
        fixed-header
        class="elevation-10 flex-table"
      >
        <template #item.actions="{ item }">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiFilePdfBox"
                class="me-2"
                v-bind="props"
                @click="onPDF(item)"
              />
            </template>
            <span>{{ $t("tooltip.catalog_download_pdf") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiCodeJson"
                class="me-2"
                v-bind="props"
                @click="onJSON(item)"
              />
            </template>
            <span>{{ $t("tooltip.catalog_download_json") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiMicrosoftExcel"
                class="me-2"
                v-bind="props"
                @click="onExcel(item)"
              />
            </template>
            <span>{{ $t("tooltip.catalog_download_excel") }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                :icon="mdiFolderZip"
                class="me-2"
                v-bind="props"
                @click="onZip(item)"
              />
            </template>
            <span>{{
              $t("tooltip.catalog_download_documents")
            }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>
