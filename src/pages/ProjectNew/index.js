export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',

            e1: 1,
            message: "",
            note: undefined,
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
                    this.project = this.screeningSheet.project;
                    this.selectionVector = this.screeningSheet.selectionVector;

                    // konvertieren für genrische Darstellung in Tabelle
                    this.selectionVectorParameter = [];
                    for (var name in this.screeningSheet.selectionVector.levels) {
                        this.selectionVectorParameter.push({
                            label: this.selectionVectorParameterTranslations[name],
                            name: name,
                            value: this.screeningSheet.selectionVector.levels[name]
                        });
                    }
                    this.selectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)
                }, response => {
                    this.$confirm(
                        response.bodyText,
                        { buttonFalseText: null, buttonTrueText: "OK", color: "error", title: "Error" }
                    ).then(
                        confirmed => {
                      	    this.wait = false;
                        }
                    )
                  }
            );
        },

        onSelectionVectorProfileSelect: function() {
            this.selectionVectorParameter = [];
            for (var name in this.profile.levels) {
                this.selectionVectorParameter.push({
                    label: this.selectionVectorParameterTranslations[name],
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
                        label: this.selectionVectorParameterTranslations[name],
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
            requestParameter.note = this.note;
            requestParameter.screeningSheet = this.screeningSheet;

            var selectionVector = {};
            selectionVector.levels = levels;
            requestParameter.selectionVector = selectionVector;

            this.$http.post(this.catalog.project, JSON.stringify(requestParameter), {emulateJSON: true} )
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
                        this.$confirm(
                            response.bodyText,
                            { buttonFalseText: null, buttonTrueText: "OK", color: "error", title: "Error" }
                        ).then(
                            confirmed => {
                                this.wait = false;
                            }
                        )
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
        },
        selectionVectorParameterTranslations: function() {
            return this.$store.state.selectionVectorParameterTranslations;
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

                    if (item.valid) {
                        var catalog = {};
                        catalog.version = item.version;
                        catalog.project = links.project.href;
                        this.catalogs.push(catalog);
                        this.catalog = catalog;
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
