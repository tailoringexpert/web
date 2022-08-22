export const data = {
    data() {
        return {
            wait: false,

            e1: 1,
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

            srcScreeningSheet: {},
            srcSelectionVectorParameter: [],
            srcScreeningSheetDownload: null,

            screeningSheetFile: undefined,
            screeningSheet: {
                parameters: []
            },

            project: '',
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
        }
    },
    methods: {
        onProjectCopyCancel: function() {
        },
        onScreeningSheetFileOpen: function() {
            this.wait = true;
            this.$http.get(this.srcScreeningSheetDownload, {responseType: 'arraybuffer'}).then(
                response => {
                    const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = response.headers.get('Content-Disposition').split('filename=')[1];
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
           );
        },
        onScreeningSheetSelect : function(screeningSheetFile) {
            this.screeningSheetFile = screeningSheetFile;
        },
        onScreeningSheetUpload: function() {
            if (!this.screeningSheetFile) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.screeningSheetFile);

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
                }, response => {
                    this.wait = false;
                    console.log("error");
                }
            );
        },
        onSummary: function() {
            this.selectionVectorParameterComparison = [];
            var modifiedSelectionVector = this.buildSelectionVector(this.selectionVectorParameter);

            for (var name in this.screeningSheet.selectionVector.levels) {
                this.selectionVectorParameterComparison.push(
                    {
                        name: name,
                        label: this.$tc(name),
                        src: Number(this.srcScreeningSheet.selectionVector.levels[name]),
                        target: Number(this.screeningSheet.selectionVector.levels[name])
                    }
                );
            }
            this.selectionVectorParameterComparison.sort((a, b) => (a.label > b.label) ? 1 : -1)

        },
        onProjectCopyCreate: function() {
            this.wait = true;

            let data = new FormData();
            data.append("datei", this.screeningSheetFile);

            this.$http.post(this.$route.params.self, data, {emulateJSON: true} ).then(
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
                    this.$confirm('Bei der Anlage des Tailorins ist ein Fehler aufgetreten.<br>Bitte überprüfen Sie Ihre Eingaben.',
                        { buttonFalseText: null, buttonTrueText: "OK", color: "error", title: "Fehler" }).then(
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
        selectionVectorParameterComparisonHeader: function() {
            return [
                {
                    text: this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: this.$route.params.id,
                    sortable: true,
                    value: 'src',
                },
                {
                    text: this.project,
                    sortable: true,
                    value: 'target',
               },
            ];
        },
    },
	created: function() {
	    this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } },
            { text: this.$tc('project_copy'), disabled: true }
        ]);

        this.$http.get(this.$route.params.screeningsheet).then(
            response => {
                this.srcScreeningSheet = response.body;

                this.srcSelectionVectorParameter = [];
                for (var name in this.srcScreeningSheet.selectionVector.levels) {
                    this.srcSelectionVectorParameter.push({
                        label: this.$tc(name),
                        name: name,
                        value: this.srcScreeningSheet.selectionVector.levels[name]
                   });
                }
                this.srcSelectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                this.srcScreeningSheetDownload = this.srcScreeningSheet._links['datei'].href;

                this.wait = false;
            },
            response => {
                console.log(repsonse);
                this.wait = false;
            }
        );
    },
}
