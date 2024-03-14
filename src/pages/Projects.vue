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
                        @click="onEditProject(item)"
                        >mdi-pencil</v-icon
                    >
                </template>
                <span>{{ $t("tooltip.project_edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        small
                        class="mr-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="onDeleteProject(item)"
                        >mdi-delete</v-icon
                    >
                </template>
                <span>{{ $t("tooltip.project_delete") }}</span>
            </v-tooltip>
        </template>
    </v-data-table>
</template>

<script>

export default {

    data() {
        return {
            wait: false,
            state: "ONGOING",
            headers: [
                {
                    title: this.$t("name"),
                    value: "name",
                    sortable: true,
                    align: "start",
                    width: "40%",
                },
                {
                    title: this.$t("created_at"),
                    value: "creationTimestamp",
                    sortable: true,
                    width: "15%",
                },
                {
                    title: this.$t("state"),
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
                    title: this.$t("action", 2),
                    value: "actions",
                    sortable: false,
                    width: "30%",
                },
            ],
            projects: [],
        };
    },

    methods: {
        // allgenmein
        onEditProject: function (project) {
        console.log("on1: " + project.self);
            this.$router.push({
                name: "project",
                params: {
                    id: project.name,
                    self: project.self,
                },
            });
            console.log("on3" + this.$route.params);
        },

        // setup
        onLoadProjects: function () {
            this.wait = true;

            this.$axios
                .get(this.$store.state.links["project"].href)
                .then((response) => {
                    this.projects = [];

                    if (response.data._embedded != undefined) {
                        for (
                            let i = 0;
                            i < response.data._embedded.projects.length;
                            i++
                        ) {
                            var item = response.data._embedded.projects[i];
                            var links =
                                response.data._embedded.projects[i]._links;
                            this.projects.push({
                                name: item.name,
                                creationTimestamp: item.creationTimestamp,
                                state: item.state,
                                nextstate: links.state.href,
                                self: links.self.href,
                                screeningsheet: links.screeningsheet.href,
                            });
                        }
                    }

                    this.wait = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.wait = false;
                });
        },
    },

    created: function () {
        this.onLoadProjects();
        console.log("created");
    },
};
</script>
