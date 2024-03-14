export const data = {
    data: function () {
        return {
            wait: false,
            state: "ONGOING",
            msg: "Hello!",
            headers: [
                {
                    text: this.$t("name"),
                    value: "name",
                    sortable: true,
                    align: "start",
                    width: "40%",
                },
                {
                    text: this.$t("created_at"),
                    value: "creationTimestamp",
                    sortable: true,
                    width: "15%",
                },
                {
                    text: this.$t("state"),
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
                    text: this.$t("action", 2),
                    value: "actions",
                    sortable: false,
                    width: "30%",
                },
            ],
            projects: [],
        };
    },

    methods: {
        onNewProject: function () {
            this.$router.push({
                name: "projectnew",
            });
        },
        onEditProject: function (project) {
        console.log("on1");
            this.$router.push({
                name: "project",
                params: {
                    id: project.name,
                    self: project.self,
                },
            });

            console.log("on2");
        },
        onDeleteProject: function (project) {
            this.$confirm(this.$t("project_delete.text"), {
                buttonFalseText: this.$t("no"),
                buttonTrueText: this.$t("yes"),
                color: "warning",
                title: this.$t("project_delete.title"),
            }).then((confirmed) => {
                if (confirmed) {
                    this.wait = true;
                    this.$axios
                        .delete(project.self)
                        .then((response) => {
                            this.wait = false;
                            this.onLoadProjects();
                            console.log(response);
                        })
                        .catch((error) => {
                            console.log("error: " + error);
                            this.wait = false;
                        });
                }
            });
        },
        onLoadProjects: function () {
            this.wait = true;

            this.$axios
                .get(origin)
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
        onProjectState: function (project) {
            this.$confirm(this.$t("project_state.text"), {
                buttonFalseText: this.$t("no"),
                buttonTrueText: this.$t("yes"),
                color: "warning",
                title: this.$t("project_state.title"),
            }).then((confirmed) => {
                if (confirmed) {
                    this.wait = true;
                    this.$http.put(project.nextstate).then((response) => {
                        project.state = response.body.state;
                        project.nextstate = response.body._links.state.href;
                        this.wait = false;
                    });
                }
            });
        },
    },
    created: function () {
        this.onLoadProjects();
        this.$store.commit("breadcrumbs", [
            {
                text: this.$t("project", 2),
                disabled: false,
                exact: true,
                to: { name: "projects" },
            },
        ]);
    },
};
