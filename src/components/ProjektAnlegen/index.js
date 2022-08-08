export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',

            e1: 1,
            message: "",
            kataloge: [],
            katalog: undefined,
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
            screeningSheetParameter: [],
            screeningSheetDatei: undefined,
            screeningSheet: {
                parameters: []
            },

            projekt: '',
            profil: '',
            selektionsVektorHeader: [
                {
                    text: this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                    width: '50%',

                },
                {
                    text: this.$tc('wert'),
                    value: 'wert',
                    sortable: false,
                    width: '50%',
                },
            ],
            selektionsVektorParameter: [],
            selektionsVektorParameterGegenueberstellung: [],

            selektionsVektorParameterGegenueberstellungHeader: [
                   {
                       text: this.$tc('name'),
                       align: 'start',
                       sortable: true,
                       value: 'label',
                   },
                   {
                       text: this.$tc('berechneter_selektionsvektor'),
                       value: 'action',
                       value: 'berechnet',
                   },
                  {
                      text: this.$tc('angewendeter_selektionsvektor'),
                      value: 'action',
                      value: 'angepasst',
                  },
               ],
        }
    },
    methods: {
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

            this.wait = true;
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

                    // sonst hinweis dialog
                }, response => {
                    this.wait = false;
                    console.log("error");
                  });
        },
        onSelectSelektionsVektorProfil: function() {
            this.selektionsVektorParameter = [];
            for (var name in this.profil.levels) {
                this.selektionsVektorParameter.push({
                    label: this.$t(name),
                    name: name,
                    wert: this.profil.levels[name]
                });
            }
            this.selektionsVektorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

        },
        onSaveSelektionsVektorBearbeitung: function() {
            this.snack = true;
            this.snackColor = 'success';
            this.snackText = 'Wert übernommen';

        },
        onCancelSelektionsVektorBearbeitung: function() {
            this.snack = true;
            this.snackColor = 'error';
            this.snackText = 'Wert nicht aktualisiert';
        },
        onZusammenfassung: function() {
            this.selektionsVektorParameterGegenueberstellung = [];
            var benutzerSelektionsVektor = this.buildSelektionsVektor(this.selektionsVektorParameter);

            for (var name in this.screeningSheet.selektionsVektor.levels) {
                this.selektionsVektorParameterGegenueberstellung.push(
                    {
                        name: name,
                        label: this.$t(name),
                        berechnet: this.screeningSheet.selektionsVektor.levels[name],
                        angepasst: Number(benutzerSelektionsVektor[name])
                    }
                );
            }
            this.selektionsVektorParameterGegenueberstellung.sort((a, b) => (a.label > b.label) ? 1 : -1)

        },
        onCreateProject: function() {
            this.wait = true;

            var levels = {};
            for (var i in this.selektionsVektorParameter) {
                levels[this.selektionsVektorParameter[i].name]=  this.selektionsVektorParameter[i].wert;
            }
            var requestParameter = {};
            requestParameter.screeningSheet = this.screeningSheet;

            var selektionsVektor = {};
            selektionsVektor.levels = levels;
            requestParameter.selektionsVektor = selektionsVektor;

            this.$http.post(this.katalog, JSON.stringify(requestParameter), {emulateJSON: true} )
                .then(
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
                        this.wait = false;
                        console.log("error");
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
        profile: function() {
            return this.$store.state.selektionsvektoren;
        },
    },
    created: function() {
        this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } },
            { text: this.$tc('neues_projekt'), disabled: true }
        ]);

        this.$http.get(this.$store.state.links['katalog'].href).then(
            response => {
                this.kataloge = [];
                for (let i = 0; i<response.body._embedded.katalogVersionResourceList.length; i++) {
                    var item = response.body._embedded.katalogVersionResourceList[i];
                    var links = response.body._embedded.katalogVersionResourceList[i]._links;
                    this.kataloge.push({
                        version: item.version,
                        standard: item.standard,
                        projekt: links.projekt.href
                    });

                    if(item.standard) {
                        this.katalog = links.self.href;
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