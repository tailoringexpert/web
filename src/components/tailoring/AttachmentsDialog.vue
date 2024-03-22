<template>
  <v-dialog
    v-model="active"
    max-width="75%"
    justify="center"
  >
    <v-card elevation="2">
      <v-card-title>{{ $t("attachment.title") }}</v-card-title>
      <v-card-text justify="center">
        <v-row
          no-gutters
          justify="center"
          align="center"
        >
          <v-col cols="8">
            <v-file-input
              ref="file"
              show-size
              label="File input"
            />
          </v-col>

          <v-col
            cols="4"
            class="pl-2"
          >
            <v-btn
              color="success"
              dark
              small
            >
              {{ $t("upload") }}
              <v-icon
                right
                dark
              >
                mdi-cloud-upload
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :items="attachments"
          :headers="headers"
          class="elevation-1"
        >
          <template #item.name="{ item }">
            <span @click.self="onDownload(item)">{{
              item.name
            }}</span>
          </template>
          <template #item.actions="{ item }">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onDownload(item)"
                >
                  mdi-download-circle
                </v-icon>
              </template>
              <span>{{
                $tc("tooltip.attachment_download")
              }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onDelete(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>{{ $t("tooltip.attachment_delete") }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          rounded
          text
          @click="active = false"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, defineExpose } from "vue";
import { useI18n } from "vue-i18n";
// import axios from "axios";

export default {
    name: "AttachmentsDialog",

    setup() {
        const wait = ref(false);
        const active = ref(false);

        const { t } = useI18n();

        const headers = [
            {
                title: t("attachment.file"),
                sortable: true,
                value: "name",
            },
            {
                title: "Typ",
                sortable: true,
                value: "type",
            },
            {
                title: t("attachment.checksum"),
                sortable: true,
                value: "hash",
            },
            {
                title: "Actions",
                value: "actions",
                sortable: false,
            },
        ];

        const attachments = reactive([]);

        function onDownload() {
            console.log("onDownload");
        }

        function onDelete() {
            console.log("onDelete");
        }

        function onActivate(links) {
            console.log("onActivate");
            console.log(links);
            this.active = true;
        } 

        defineExpose({
            onActivate,
        });
        return {
            onActivate,
            wait,
            active,
            headers,
            attachments,
            onDownload,
            onDelete
        };
    },
};
</script>

<style scoped></style>
