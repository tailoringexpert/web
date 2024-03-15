export const data = {

    data: function () {
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
            this.$store.commit('project', project.self);
            this.$router.push({
                name: "project",
                params: {
                    id: project.name,
                    self: project.self,
                },
                state:  {self: project.self},
            });
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
