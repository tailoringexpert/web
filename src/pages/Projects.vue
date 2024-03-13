<template>
<v-container fluid>
    <v-overlay :value="wait">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-row>
        <v-col>
            <v-data-table
                    :headers="headers"
                    :items="projects"
                    :items-per-page="20"
                    class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>{{$tc('project', 2)}}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-btn color="primary" dark class="mb-2" @click="onNewProject()">{{$tc('project_new')}}</v-btn
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


                <template v-slot:item.state="{ item }">
                    <span @click="onProjectState(item)">{{item.state}} <v-icon small class="mr-2">mdi-pencil-box-outline</v-icon></span>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mr-2" v-bind="attrs" v-on="on" @click="onEditProject(item)">mdi-pencil</v-icon>
                        </template>
                        <span>{{$tc('tooltip.project_edit')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mr-2" v-bind="attrs" v-on="on" @click="onDeleteProject(item)">mdi-delete</v-icon>
                        </template>
                        <span>{{$tc('tooltip.project_delete')}}</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
export const data = {
    data: function() {
        return {
            wait: false,
            state: 'ONGOING',
            msg: 'Hello!',
            headers: [
                {
                    text: this.$t('name'),
                    value: 'name',
                    sortable: true,
                    align: 'start',
                    width: '40%'
                },
                {
                    text: this.$t('created_at'),
                    value: 'creationTimestamp',
                    sortable: true,
                    width: '15%'
                },
                {
                    text: this.$t('state'),
                    value: 'state',
                    sortable: false,
                    width: '15%',
                    filter: value => {
                         return this.state === null || this.state.trim() === ""  || value == this.state ;
                        }
                },
                {
                    text: this.$t('action', 2),
                    value: 'actions',
                    sortable: false,
                    width: '30%'
                },
            ],
            projects: []
        };
    },

    methods: {
        onNewProject: function() {
            this.$router.push({
                name: 'projectnew'
            });
        },
        onEditProject: function(project) {
            this.$router.push({
                name: 'project',
                params: {
                    id: project.name,
                    self: project.self
                }
            });
        },
        onDeleteProject: function(project) {
            this.$confirm(
                this.$t('project_delete.text'),{
                    buttonFalseText: this.$t('no'),
                    buttonTrueText: this.$t('yes'),
                    color: "warning",
                    title: this.$t('project_delete.title')
                }).then(
                    confirmed => {
                        if ( confirmed ) {
                            this.wait = true;
                            this.$http.delete(project.self).then(
                                response => {
                                    this.wait = false;
                                    this.onLoadProjects();
                                },
                                response => {
                                    console.log("error: " + response);
                                    this.wait = false;
                                }
                            );
                        }
                   }
               );
        },
        onLoadProjects : function() {
            this.wait = true;

        this.$axios
            .get(origin)
            .then(response => {
                this.projects = [];

                if (response.data._embedded != undefined) {
                    for (let i = 0; i < response.data._embedded.projects.length; i++) {
                        var item = response.data._embedded.projects[i];
                        var links = response.data._embedded.projects[i]._links;
                        this.projects.push(
                            {
                                name: item.name,
                                creationTimestamp: item.creationTimestamp,
                                state: item.state,
                                nextstate: links.state.href,
                                self: links.self.href,
                                screeningsheet: links.screeningsheet.href,
                            }
                        );
                    }
                }

                this.wait = false;
                })
            .catch(error => {
                console.log(error);
                this.wait = false
            });
        },
        onProjectState: function(project) {
            this.$confirm(this.$t('project_state.text'),
                { buttonFalseText: this.$t('no'), buttonTrueText: this.$t('yes'), color: "warning", title: this.$t('project_state.title') }).then(
                confirmed => {
                    if ( confirmed ) {
                        this.wait = true;
                        this.$http.put(project.nextstate).then(
                            response => {
                                project.state = response.body.state;
                                project.nextstate = response.body._links.state.href;
                                this.wait = false;
                            }
                       )
                    }
                });
        },
    },
    created: function() {
        this.onLoadProjects();
        this.$store.commit('breadcrumbs', [
            { text:  this.$t('project', 2),  disabled: false, exact: true, to: { name: 'projects' } }
        ]);
    },
}
</script>
