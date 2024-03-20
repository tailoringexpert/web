<template>
    <v-overlay v-model="wait">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="active" max-width="75%" justify="center">
        <v-card elevation="2">
            <v-card-title>{{ $t("documents.title") }}</v-card-title>
            <v-card-text justify="center">
                <v-data-table
                    :items="signatures"
                    :headers="headers"
                    class="elevation-1"
                >
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.faculty }}</td>
                            <td>{{ item.signee }}</td>
                            <td class="text-xs-right">{{ item.state }}</td>
                            <td class="text-xs-right">
                                <v-simple-checkbox
                                    label=""
                                    v-model="item.applicable"
                                    disabled
                                >
                                </v-simple-checkbox>
                            </td>
                            <td>
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="onEditSignature(item)"
                                >
                                    mdi-pencil-box-outline
                                </v-icon>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:top>
                        <v-dialog v-model="activeSignature" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{
                                        signature.faculty
                                    }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field
                                                    v-model="signature.signee"
                                                    label="Name"
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field
                                                    v-model="signature.state"
                                                    label="State"
                                                >
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-checkbox
                                                    v-model="
                                                        signature.applicable
                                                    "
                                                    label="applicable"
                                                >
                                                </v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="onCloseSignature()"
                                    >
                                        {{ $t("cancel") }}
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="onSaveSignature()"
                                    >
                                        {{ $t("save") }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined rounded text @click="onCatalogCreate">
                    {{ $t("documents.catalog") }}
                </v-btn>
                <v-btn outlined rounded text @click="onDocumentsCreate">
                    {{ $t("documents.download") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, reactive, defineExpose } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

export default {
    name: "DocumentsDialog",

    setup() {
        const { t } = useI18n();
        const wait = ref(false);
        const active = ref(false);
        const activeSignature = ref(false);
        const signature = reactive({});
        const self = ref("");        

        const headers = [
            {
                text: t("documents.faculty"),
                sortable: true,
                value: "faculty",
            },
            {
                text: t("documents.signee"),
                sortable: true,
                value: "signee",
            },
            {
                title: t("documents.state"),
                sortable: true,
                value: "signature_state",
            },
            {
                title: t("documents.applicable"),
                sortable: true,
                value: "applicable",
            },
            {
                title: "Actions",
                value: "actions",
                sortable: false,
            },
        ];
        const signatures = reactive([]);

        function onActivate(link) {
            this.wait = true;
            
            this.self = link;
            axios
                .get(this.self)
                .then((response) => {
                    Object.assign(
                        signatures,
                        response.data._embedded.signatures
                    );
                    this.active = true;
                    this.wait = false;
                })
                .catch(() => {
                    this.wait = false;
                });
        }

        function onEditSignature(item) {
            Object.assign(signature, item);            
            this.activeSignature = true;
        }

        function onCloseSignature() {
            this.activeSignature = false;
        }

        function onSaveSignature() {
            console.log("onSaveSignature");
            this.wait = true;
            axios
                .put(
                    this.signature._links.self.href,
                    JSON.stringify(this.signature),
                    {
                        emulateJSON: true,
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                        },
                    }
                )
                .then(() => {
                    this.onCloseSignature();
                    this.wait = false;
                    this.onActivate(this.self);
                })
                .catch((error) => {
                    console.log(error);
                });

            this.activeSignature = false;
        }

        defineExpose({
            onActivate,
        });

        return {
            onActivate,
            wait,
            active,
            headers,
            signatures,
            activeSignature,
            onEditSignature,
            signature,
            onCloseSignature,
            onSaveSignature,
            self
        };
    },
};
</script>

<style scoped></style>
