<template src="@/pages/Projects/index.template.html" />
<script>
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

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

            this.$axios
                .get(this.$store.state.links["project"].href)
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
            this.$store.commit("project", project.self);
            this.$router.push({
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
                .confirm({title:  t("project_delete.title"), text:  t("project_delete.text"), cancelText: "No", confirmationText: "Yes"})
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
            onProjectsLoad
        };
    },

    created() {
        this.onProjectsLoad();
    },
};
</script>
