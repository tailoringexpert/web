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
                    value: 'bezeichnung',
                },
                {
                    text: this.$tc('wert'),
                    value: 'action',
                    sortable: true,
                    value: 'wert',
                },
            ],

            quellScreeningSheet: {},
            quellSelektionsVektorParameter: [],
            quellScreeningSheetDownload: null,

            screeningSheetDatei: undefined,
            screeningSheet: {
                parameters: []
            },

            projekt: '',
            selektionsVektorHeader: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: 'Wert',
                    value: 'action',
                    sortable: true,
                    value: 'wert',
                },
            ],
            selektionsVektorParameter: [],
            selektionsVektorParameterGegenueberstellung: [],
        }
    },
    methods: {
        onCancelProjektKopieren: function() {
        },
        onOpenScreeningSheetDatei: function() {
            this.wait = true;
            this.$http.get(this.quellScreeningSheetDownload, {responseType: 'arraybuffer'}).then(
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
        onSelectScreeningSheet : function(screeningSheetDatei) {
            this.screeningSheetDatei = screeningSheetDatei;

        },
        onUploadScreeningSheet: function() {
            if (!this.screeningSheetDatei) {
                this.message = this.$tc('datei_auswaehlen');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.screeningSheetDatei);

            this.$http.post(this.$store.state.links['screeningsheet'].href, data, {emulateJSON: true} ).then(
                response => {
                    this.wait = false;

                    // merken für nächstem Wizzard Schritt
                    this.screeningSheet = response.body;
                    this.selektionsVektor = this.screeningSheet.selektionsVektor;

                    // konvertieren für genrische Darstellung in Tabelle
                    for (var name in this.screeningSheet.selektionsVektor.levels) {
                        this.selektionsVektorParameter.push({
                            label: this.$t(name),
                            name: name,
                            wert: this.screeningSheet.selektionsVektor.levels[name]
                       });
                    }
                    this.selektionsVektorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                    for (let i = 0; i < this.screeningSheet.parameters.length; i++) {
                        if (this.screeningSheet.parameters[i].bezeichnung == 'Kuerzel') {
                            this.projekt = this.screeningSheet.parameters[i].wert;
                            break;
                        }
                    }
                }, response => {
                    this.wait = false;
                    console.log("error");
                }
            );
        },
        onZusammenfassung: function() {
            this.selektionsVektorParameterGegenueberstellung = [];
            for (var name in this.screeningSheet.selektionsVektor.levels) {
                this.selektionsVektorParameterGegenueberstellung.push(
                    {
                        name: name,
                        label: this.$tc(name),
                        quell: Number(this.quellScreeningSheet.selektionsVektor.levels[name]),
                        aktuell: Number(this.screeningSheet.selektionsVektor.levels[name])
                    }
                );
            }
            this.selektionsVektorParameterGegenueberstellung.sort((a, b) => (a.label > b.label) ? 1 : -1)

        },
        onCreateProjektKopie: function() {
            this.wait = true;

            let data = new FormData();
            data.append("datei", this.screeningSheetDatei);

            this.$http.post(this.$route.params.self, data, {emulateJSON: true} ).then(
                response => {
                    this.wait = false;
                    this.$router.push(
                        {
                            name: 'projekt',
                            params:
                            {
                                id: this.projekt,
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
        buildSelektionsVektor: function(parameter) {
            var selektionsVektor = {};
            for (var i in parameter) {
                selektionsVektor[parameter[i].name] = parameter[i].wert;
            }
            return selektionsVektor;
        },
    },
    watch: {
    },
    computed: {
        selektionsVektorParameterGegenueberstellungHeader: function() {
            return [
                {
                    text: this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: this.$route.params.id,
                    value: 'start',
                    sortable: true,
                    value: 'quell',
                },
                {
                    text: this.projekt,
                    value: 'start',
                    sortable: true,
                    value: 'aktuell',
               },
            ];
        },
    },
	created: function() {
	    this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } },
            { text: this.$tc('kopiere_projekt'), disabled: true }
        ]);

        this.$http.get(this.$route.params.screeningsheet).then(
            response => {
                this.quellScreeningSheet = response.body;

                this.quellSelektionsVektorParameter = [];
                for (var name in this.quellScreeningSheet.selektionsVektor.levels) {
                    this.quellSelektionsVektorParameter.push({
                        label: this.$tc(name),
                        name: name,
                        wert: this.quellScreeningSheet.selektionsVektor.levels[name]
                   });
                }
                this.quellSelektionsVektorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                this.quellScreeningSheetDownload = this.quellScreeningSheet._links['datei'].href;

                this.wait = false;
            },
            response => {
                console.log(repsonse);
                this.wait = false;
            }
        );
    },
}
