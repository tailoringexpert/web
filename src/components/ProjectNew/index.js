export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',

            e1: 1,
            message: "",
            catalogs: [],
            catalog: undefined,
            screeningSheetParameterHeader: [
                {
                    text: this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: this.$tc('value'),
                    sortable: true,
                    value: 'value',
                },
            ],
            screeningSheetParameter: [],
            screeningSheetDatei: undefined,
            screeningSheet: {
                parameters: []
            },

            project: '',
            profile: '',
            selectionVectorHeader: [
                {
                    text: this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                    width: '50%',
                },
                {
                    text: this.$tc('value'),
                    value: 'value',
                    sortable: false,
                    width: '50%',
                },
            ],
            selectionVectorParameter: [],
            selectionVectorParameterComparison: [],

            selectionVectorParameterComparisonHeader: [
                   {
                       text: this.$tc('name'),
                       align: 'start',
                       sortable: true,
                       value: 'label',
                   },
                   {
                       text: this.$tc('selectionvector_calculated'),
                       value: 'calculated',
                   },
                  {
                      text: this.$tc('selectionvector_applied'),
                      value: 'modified',
                  },
               ],
        }
    },
    methods: {
        onScreeningSheetSelect : function(screeningSheetDatei) {
            this.screeningSheetDatei = screeningSheetDatei;

        },
        onScreeningSheetUpload: function() {
            if (!this.screeningSheetDatei) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.screeningSheetDatei);

            this.wait = true;
            this.$http.post(this.$store.state.links['screeningsheet'].href, data, {emulateJSON: true} ).then(
                response => {
                    this.wait = false;

                    // merken für nächstem Wizzard Schritt
                    this.screeningSheet = response.body;
                    this.selectionVector = this.screeningSheet.selectionVector;

                    // konvertieren für genrische Darstellung in Tabelle
                    for (var name in this.screeningSheet.selectionVector.levels) {
                        this.selectionVectorParameter.push({
                            label: this.$t(name),
                            name: name,
                            value: this.screeningSheet.selectionVector.levels[name]
                        });
                    }
                    this.selectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                    for (let i = 0; i < this.screeningSheet.parameters.length; i++) {
                        if (this.screeningSheet.parameters[i].label == 'Kuerzel') {
                            this.project = this.screeningSheet.parameters[i].value;
                            break;
                        }
                    }

                    // sonst hinweis dialog
                }, response => {
                    this.wait = false;
                    console.log("error");
                  });
        },

        onSelectionVectorProfileSelect: function() {
            this.selectionVectorParameter = [];
            for (var name in this.profile.levels) {
                this.selectionVectorParameter.push({
                    label: this.$t(name),
                    name: name,
                    value: this.profile.levels[name]
                });
            }
            this.selectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)
        },
        onSelectionVectorEditSave: function() {
            this.snack = true;
            this.snackColor = 'success';
            this.snackText = 'Wert übernommen';

        },
        onSelectionVectorEditCancel: function() {
            this.snack = true;
            this.snackColor = 'error';
            this.snackText = 'Wert nicht aktualisiert';
        },

        onSummary: function() {
            this.selectionVectorParameterComparison = [];
            var modifiedSelectionVector = this.buildSelectionVector(this.selectionVectorParameter);

            for (var name in this.screeningSheet.selectionVector.levels) {
                this.selectionVectorParameterComparison.push(
                    {
                        name: name,
                        label: this.$t(name),
                        calculated: this.screeningSheet.selectionVector.levels[name],
                        modified: Number(modifiedSelectionVector[name])
                    }
                );
            }
            this.selectionVectorParameterComparison.sort((a, b) => (a.label > b.label) ? 1 : -1)

        },
        onProjectCreate: function() {
            this.wait = true;

            var levels = {};
            for (var i in this.selectionVectorParameter) {
                levels[this.selectionVectorParameter[i].name]=  this.selectionVectorParameter[i].value;
            }
            var requestParameter = {};
            requestParameter.screeningSheet = this.screeningSheet;

            var selectionVector = {};
            selectionVector.levels = levels;
            requestParameter.selectionVector = selectionVector;

            this.$http.post(this.catalog, JSON.stringify(requestParameter), {emulateJSON: true} )
                .then(
                    response => {
                        this.wait = false;
                        this.$router.push(
                            {
                                name: 'project',
                                params:
                                {
                                    id: this.project,
                                    self: response.headers.get('Location')
                                }
                            }
                        );

                    },
                    response => {
                        this.wait = false;
                        console.log("error");
                    }
                );
        },
        buildSelectionVector: function(parameter) {
            var selectionVector = {};
            for (var i in parameter) {
                selectionVector[parameter[i].name] = parameter[i].value;
            }
            return selectionVector;
        },
    },
    computed: {
        profiles: function() {
            return this.$store.state.selectionvectors;
        }
    },
    created: function() {
        this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } },
            { text: this.$tc('project_new'), disabled: true }
        ]);

        this.$http.get(this.$store.state.links['catalog'].href).then(
            response => {
                this.catalogs = [];
                for (let i = 0; i<response.body._embedded.baseCatalogVersions.length; i++) {
                    var item = response.body._embedded.baseCatalogVersions[i];
                    var links = response.body._embedded.baseCatalogVersions[i]._links;
                    this.catalogs.push({
                        version: item.version,
                        standard: item.standard,
                        project: links.project.href
                    });

                    if(item.standard) {
                        this.catalog = links.self.href;
                    }
                }
                this.wait = false;
            },
            response => {
                console.log(response);
                this.wait = false;
            }
        );
    },
}
