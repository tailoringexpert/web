<!-- <template src="@/pages/Project/index.template.html" /> -->
<template>
    <v-container fluid>
        <v-overlay v-model="wait">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <ScreeningsheetDialog ref="screeningsheet" />
        <NameDialog ref="name"/>
        <SelectionvectorDialog ref="selectionvector" />
        <CompareDialog ref="compare" />
        <DocumentsDialog ref="documents" />
        <AttachmentsDialog ref="attachments" />

        <v-row>
            <v-col cols="1">{{ $t("project") }} : {{ self }}</v-col>
            <v-col
                >{{ project.name }}
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            class="mr-2"
                            v-on="on"
                            v-bind="attrs"
                            @click="onOpenScreeningSheet(project)"
                        >
                            mdi-card-account-details
                        </v-icon>
                    </template>
                    <span>{{ $t("tooltip.screeningsheet_open") }}</span>
                </v-tooltip>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-data-table
                    :items="project.tailorings"
                    :headers="headers"
                    :items-per-page="20"
                    class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-toolbar-title>{{
                                $t("tailoring", 2)
                            }}</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                @click="onTailoringNew()"
                                >{{ $t("tailoring_new") }}
                            </v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.name="{ item }">
                        <div>
                            {{ item.name }}
                            <v-icon
                                small
                                class="mr-2"
                                @click="onTailoringName(item)"
                                >mdi-pencil</v-icon
                            >
                        </div>

                        <v-dialog v-model="active" width="auto">
                            <v-card
                                max-width="400"
                                prepend-icon="mdi-update"
                                text="Your application will relaunch automatically after the update is complete."
                                title="Update in progress"
                            >
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="4" sm="6">
                                            <v-text-field
                                                v-model="item.name"
                                                label="Edit"
                                                single-line
                                                counter
                                                autofocus
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!-- <template v-slot:input>
                                    <v-text-field
                                        v-model="item.name"
                                        label="Edit"
                                        single-line
                                        counter
                                        autofocus
                                    >
                                    </v-text-field>
                                </template> -->
                                </v-card-text>
                                <template v-slot:actions>
                                    <v-btn
                                        class="ms-auto"
                                        text="Cancel"
                                        @click="onTailoringNameCancel"
                                    ></v-btn>
                                    <v-btn
                                        class="ms-auto"
                                        text="Ok"
                                        @click="onTailoringNameSave(item)"
                                    ></v-btn>
                                </template>
                            </v-card>
                        </v-dialog>
                        <!-- 
                        <v-edit-dialog
                            :return-value.sync="item.name"
                            large
                            persistent
                            @open="onTailoringNameOpen(item)"
                            @save="onTailoringNameSave(item)"
                            @cancel="onTailoringNameCancel"
                        >
                            <div>
                                {{ item.name }}
                                <v-icon small class="mr-2">mdi-pencil</v-icon>
                            </div>
                            <template v-slot:input>
                                <v-text-field
                                    v-model="item.name"
                                    label="Edit"
                                    single-line
                                    counter
                                    autofocus
                                >
                                </v-text-field>
                            </template>
                        </v-edit-dialog> -->
                    </template>

                    <template v-slot:item.state="{ item }">
                        <span @click="onTailoringState(item)"
                            >{{ item.state }}
                            <v-icon small class="mr-2"
                                >mdi-pencil-box-outline</v-icon
                            ></span
                        >
                    </template>

                    <template v-slot:item.catalogVersion="{ item }">
                        <span @click="onBaseCatalogDownload(item)"
                            >{{ item.catalogVersion }}
                            <v-icon small class="mr-2"
                                >mdi-download</v-icon
                            ></span
                        >
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onTailoringCatalogEdit(item)"
                                    :disabled="!isTailoringEditable(item)"
                                    >mdi-pencil-box-outline
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.requirements_edit") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onDocuments(item)"
                                >
                                    mdi-download
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.document_open") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onTailoringCompare(item)"
                                    >mdi-vector-difference
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.tailoring_compare") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onOpenScreeningSheet(item)"
                                >
                                    mdi-card-account-details
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.screeningsheet_open") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onOpenSelectionVector(item)"
                                >
                                    mdi-head-check-outline
                                </v-icon>
                            </template>
                            <span>{{
                                $t("tooltip.selectionvector_open")
                            }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onAttachments(item)"
                                    >mdi-paperclip
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.attachment_open") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onImportOpen(item)"
                                    :disabled="!isTailoringEditable(item)"
                                    >mdi-microsoft-excel
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.requirement_import") }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onNotesOpen(item)"
                                >
                                    mdi-message-bulleted
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.tailoring_notes") }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="onTailoringDelete(item)"
                                    :disabled="!isTailoringDeletable(item)"
                                >
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>{{ $t("tooltip.tailoring_delete") }}</span>
                        </v-tooltip>
                    </template>
                </v-data-table>

                <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                    {{ snackText }}
                    <template v-slot:action="{ attrs }">
                        <v-btn v-bind="attrs" text @click="snack = false">{{
                            $t("close")
                        }}</v-btn>
                    </template>
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
import store from "@/store";

import ScreeningsheetDialog from "@/components/screeningsheet/ScreeningsheetDialog";
import NameDialog from "@/components/tailoring/NameDialog";
import SelectionvectorDialog from "@/components/tailoring/SelectionvectorDialog";
import CompareDialog from "@/components/tailoring/CompareDialog";
import DocumentsDialog from "@/components/tailoring/DocumentsDialog";
import AttachmentsDialog from "@/components/tailoring/AttachmentsDialog";

export default {
    name: "Project",
    components: {
        ScreeningsheetDialog,
        NameDialog,
        SelectionvectorDialog,
        CompareDialog,
        DocumentsDialog,
        AttachmentsDialog,
    },

    setup() {
        const { t } = useI18n();

        // components
        const screeningsheet = ref(null);
        const name = ref(null);
        const selectionvector = ref(null);
        const compare = ref(null);
        const documents = ref(null);
        const attachments = ref(null);

        const wait = ref(false);
        const snack = ref(false);
        const snackText = ref("");
        const tailoring = reactive(null);
        const active = ref(false);

        const headers = reactive([
            {
                title: t("name"),
                align: "start",
                sortable: true,
                value: "name",
            },
            {
                title: t("phase", 2),
                sortable: true,
                value: "phases",
            },
            {
                title: t("state"),
                sortable: true,
                value: "state",
            },
            {
                title: t("catalog"),
                sortable: true,
                value: "catalogVersion",
            },
            {
                title: t("action", 2),
                value: "actions",
                sortable: false,
            },
        ]);

        const screeningsheetLink = ref("");

        const project = reactive({
            name: null,
            tailorings: [],
            _links: [],
        });

        const svpt = (code) =>
            t("tenants." + store.state.tenant + ".selectionvector." + code);

        function isTailoringEditable(item) {
            return "CREATED" == item.state;
        }

        function isTailoringDeletable(item) {
            return "CREATED" == item.state;
        }

        function onOpenScreeningSheet(item) {
            this.screeningsheet.onActivate(item);
        }

        function onOpenSelectionVector(item) {
            this.selectionvector.onActivate(item);
        }

        function onTailoringCompare(item) {
            this.compare.onActivate(item);
        }

        function onDocuments(item) {
            this.documents.onActivate(item._links);
        }

        function onAttachments(item) {
            this.attachments.onActivate(item._links);
        }

         function onTailoringName(item) {
            console.log("onTailoringName");
            this.name.onActivate(item);
        }

        return {
            wait,
            snack,
            snackText,
            svpt,
            headers,
            project,
            isTailoringEditable,
            isTailoringDeletable,
            onOpenScreeningSheet,
            onOpenSelectionVector,
            onTailoringCompare,
            onDocuments,
            onAttachments,
            onTailoringName,
            screeningsheetLink,
            tailoring,
            active,
            screeningsheet,
            selectionvector,
            compare,
            documents,
            attachments,
            name
        };
    },

    created() {
        this.wait = true;

        const route = useRoute();
        const { t } = useI18n();

        store.commit("breadcrumbs", [
            {
                title: t("project", 2),
                disabled: false,
                exact: true,
                to: { name: "projects" },
            },
            {
                title: route.params.id,
                disabled: false,
                exact: true,
                to: { name: "project", params: { id: route.params.id } },
            },
        ]);

        axios
            .get(store.state.project)
            .then((response) => {
                this.project = response.data;
                this.wait = false;
            })
            .catch(() => {
                this.wait = false;
            });
    },
};
</script>
