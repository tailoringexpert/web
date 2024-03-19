<template>
    <v-dialog max-width="75%" justify="center" v-model="active">
        <v-card>
            <v-card-title
                >{{ $t("screeningsheet")
                }}<v-icon  @click="onDownload()">mdi-file-pdf-box</v-icon></v-card-title
            >

            <v-tabs v-model="tab">
                <v-tab value="screeningsheet">{{
                    $t("screeningsheet_parameter")
                }}</v-tab>
                <v-tab value="selectionvector">{{
                    $t("selectionvector_calculated")
                }}</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="screeningsheet">
                        <v-data-table
                            :headers="screeningSheetHeader"
                            :items="screeningSheet.parameters"
                            class="elevation-1"
                        >
                        </v-data-table>
                    </v-window-item>

                    <v-window-item value="selectionvector">
                        <v-data-table
                            :headers="selectionVectorHeader"
                            :items="selectionVectorParameter"
                            class="elevation-1"
                        >
                        </v-data-table>
                    </v-window-item>
                </v-window>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined rounded text @click="active=false">{{ $t("close") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, reactive, defineExpose } from "vue"
import { useI18n } from "vue-i18n"
import axios from "axios"
import store from "@/store"

export default {
    name: "ScreeningsheetDialog",

    setup() {
        const { t } = useI18n();

        const wait = ref(false);
        const active = ref(false);
        const tab = ref(null);

        const screeningSheetHeader = reactive([
            {
                title: t("name"),
                sortable: true,
                value: "label",
            },
            {
                title: t("value"),
                sortable: true,
                value: "value",
            },
        ]);
        const screeningSheet = reactive({
            parameters: [],
            selectionVector: {},
            _links: [],
        });

        const selectionVectorHeader = [
            {
                title: t("screeningsheet_parameter"),
                align: "start",
                sortable: true,
                value: "label",
            },
            {
                title: t("value"),
                value: "value",
            },
        ];
        const selectionVectorParameter = reactive([]);

        function openScreeningsheet(link) {
            this.wait = true;

            const parameterTranslation = (code) =>
                t("tenants." + store.state.tenant + ".selectionvector." + code);

            axios
                .get(link)
                .then((response) => {
                    Object.assign(screeningSheet, response.data);

                    this.selectionVectorParameter = [];
                    for (var name in this.screeningSheet.selectionVector
                        .levels) {
                        this.selectionVectorParameter.push({
                            label: parameterTranslation(name),
                            name: name,
                            value: screeningSheet.selectionVector.levels[name],
                        });
                    }
                    selectionVectorParameter.sort((a, b) =>
                        a.label > b.label ? 1 : -1
                    );


                    this.wait = false;
                    this.tab = null;
                    this.active = true;
                })
                .catch(() => {
                    this.wait = false;
                });
        }

        function onDownload() {
            this.wait = true;
            axios
                .get(this.screeningSheet._links["datei"].href, {
                    responseType: "arraybuffer"
                })
                .then((response) => {
                    const blob = new Blob([response.data], {
                        type: response.headers.get("Content-Type"),
                    });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = response.headers
                        .get("Content-Disposition")
                        .split("filename=")[1];
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.wait = false;
                });
            
        }

        defineExpose({
            openScreeningsheet,
        });

        return {
            openScreeningsheet,
            wait,
            active,
            tab,
            screeningSheet,
            screeningSheetHeader,
            selectionVectorParameter,
            selectionVectorHeader,
            onDownload
        };
    },
};
</script>

<styles scoped>
</styles>
