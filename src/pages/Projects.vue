<template>
    <v-data-table
        :headers="headers"
        :items="projects"
        :items-per-page="20"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>{{ $t("project", 2) }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="onNewProject()"
                    >{{ $t("project_new") }}</v-btn
                >
            </v-toolbar>
        </template>

        <template v-slot:header.state>
            <v-container>
                <v-select
                    label="State"
                    :items="['', 'ONGOING', 'COMPLETED']"
                    v-model="state"
                    dense
                    light
                >
                </v-select>
            </v-container>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        small
                        class="mr-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="onProjectEdit(item)"
                        >mdi-pencil</v-icon
                    >
                </template>
                <span>{{ $t("tooltip.project_edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template>
                    <div class="text-center pa-4">
                        <v-btn @click="dialog = true"> Open Dialog </v-btn>

                        <v-dialog v-model="dialog" width="auto">
                            <v-card
                                max-width="400"
                                prepend-icon="mdi-update"
                                text="Your application will relaunch automatically after the update is complete."
                                title="Update in progress"
                            >
                                <template v-slot:actions>
                                    <v-btn
                                        class="ms-auto"
                                        text="Ok"
                                        @click="dialog = false"
                                    ></v-btn>
                                </template>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>

                <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        small
                        class="mr-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="onProjectDelete(item)"
                        >mdi-delete</v-icon
                    >
                </template>
                <span>{{ $t("tooltip.project_delete") }}</span>
            </v-tooltip>
        </template>
    </v-data-table>
</template>

<script>
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import router from '@/router'
import store from "@/store";

export default {
    name: "Projects",

    setup() {
        const { t } = useI18n();
        const wait = ref(false);
        const state = ref("ONGOING");

        const headers = reactive([
            {
                title: t("name"),
                value: "name",
                sortable: true,
                align: "start",
                width: "40%",
            },
            {
                title: t("created_at"),
                value: "creationTimestamp",
                sortable: true,
                width: "15%",
            },
            {
                title: t("state"),
                value: "state",
                sortable: false,
                width: "15%",
                filter: (value) => {
                    return (
                        this.state === null ||
                        this.state.trim() === "" ||
                        value == this.state
                    );
                },
            },
            {
                title: t("action", 2),
                value: "actions",
                sortable: false,
                width: "30%",
            },
        ]);

        const projects = reactive([]);
        function onProjectsLoad() {
            this.wait = true;

            axios
                .get(store.state.links["project"].href)
                .then((response) => {
                    this.projects.splice(0);

                    if (response.data._embedded != undefined) {
                        for (
                            let i = 0;
                            i < response.data._embedded.projects.length;
                            i++
                        ) {
                            var item = response.data._embedded.projects[i];
                            var links =
                                response.data._embedded.projects[i]._links;
                            this.projects.push(
                                reactive({
                                    name: item.name,
                                    creationTimestamp: item.creationTimestamp,
                                    state: item.state,
                                    nextstate: links.state.href,
                                    self: links.self.href,
                                    screeningsheet: links.screeningsheet.href,
                                })
                            );
                        }
                    }

                    this.wait = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.wait = false;
                });
        }

        function onProjectEdit(project) {
            store.commit("project", project.self);
            router.push({
                name: "project",
                params: {
                    id: project.name,
                    self: project.self,
                },
                state: { self: project.self },
            });
        }

        function onProjectDelete(project) {
            this.$dialog
                .confirm({
                    title: t("project_delete.title"),
                    text: t("project_delete.text"),
                    cancelText: "No",
                    confirmationText: "Yes",
                })
                .then((confirmed) => {
                    if (confirmed) {
                        this.wait = true;
                        this.$axios
                            .delete(project.self)
                            .then(() => {
                                this.wait = false;
                                onProjectsLoad();
                            })
                            .catch((error) => {
                                console.log("error: " + error);
                                this.wait = false;
                            });
                    }
                });
        }

        return {
            wait,
            state,
            headers,
            projects,
            onProjectEdit,
            onProjectDelete,
            onProjectsLoad,
        };
    },

    created() {
        const { t } = useI18n();

        store.commit('breadcrumbs', [
		    { title:  t('project', 2),  disabled: false, exact: true, to: { name: 'projects' } }
		]);

        this.onProjectsLoad();
    },
};
</script>
