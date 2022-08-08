export const data = {
	data: function() {
		return {
			wait: false,
            snack: false,
            snackColor: '',
            snackText: '',
			headers: [
				{
					text: this.$tc('name'),
					align: 'start',
					sortable: true,
					value: 'name',
				},
				{
					text: this.$tc('phase', 2),
					sortable: true,
					value: 'phasen',
				},
                {
                    text: this.$tc('katalog'),
                    sortable: true,
                    value: 'katalogVersion',
                },
				{
					text: this.$tc('aktion', 2),
					value: 'actions',
					sortable: false
				},
			],
            tailoringName: null,
			projekt : {
			    tailorings : []
			},

			openScreeningSheet: false,
			screeningSheetTab: null,
            screeningSheet: {
                parameters: []
            },
            screeningSheetDownload : null,
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

            openSelektionsVektor: false,
            selektionsVektorHeader: [
                {
                    text:  this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: this.$tc('wert'),
                    value: 'action',
                    value: 'wert',
                },
            ],
            selektionsVektorParameter: [],

            openDokumentGenerierung : false,
            panel: [0],
            tailoring : null,
            dokumentZeichnungenHeader: [
                {
                    text:  this.$tc('dokument_download.bereich'),
                    align: 'start',
                    sortable: true,
                    value: 'bereich',
                },
                {
                    text: this.$tc('dokument_download.unterzeichner'),
                    value: 'action',
                    sortable: true,
                    value: 'unterzeichner',
                },
                {
                    text: this.$tc('dokument_download.zeichnungsstatus'),
                    value: 'action',
                    sortable: true,
                    value: 'status',
                },
                {
                    text: this.$tc('dokument_download.anwendbar'),
                    value: 'action',
                    sortable: true,
                    value: 'anwendbar',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            dokumentZeichnungen: [],
            editDokumentZeichnung: false,
            dokumentZeichnung: {
                benutzer: '',
                bereich: '',
                status: '',
                anwendbar: false
            },
            dokumentZeichnungIndex: -1,

            openDokumente : false,
            dokumenteHeader : [
                {
                    text: this.$tc('dokument_upload.dokument'),
                    sortable: true,
                    value: 'name',
                },
                {
                    text: "Typ",
                    sortable: true,
                    value: 'typ',
                },
                {
                    text: this.$tc('dokument_upload.checksumme'),
                    sortable: true,
                    value: 'hash',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            dokumente : [],
            uploadDatei: null,

            openImport: false,
		};
	},
	methods: {
		onNewTailoring: function() {
            this.$router.push({
                name: 'tailoringanlegen',
                params: {
                    id: this.projekt.name,
                    previous: this.$route.params.self,
                    self: this.projekt._links['tailoring'].href,
                    referer: this.projekt._links['self'].href
                }
            });
		},
        onOpenTailoringName: function(item) {
            this.tailoringName = item.name;
		},
        onSaveTailoringName: function(item) {
            this.wait = true;
            this.$http.put(item._links.name.href, item.name, {emulateJSON: true}).then(
                response => {
                    item._links = response.body._links;
                    this.wait = false;
                    this.snack = true;
                    this.snackColor = 'success';
                    this.snackText = this.$tc('tailoring_name_aendern.status.fehlerfrei');
                },
                response => {
                    this.$confirm(response.bodyText,{  buttonFalseText: null, buttonTrueText: this.$tc('tailoring_name_aendern.ok'), color: "warning", title: this.$tc('projektphase_name_aendern.titel') }).then(
                        confirmed => {
                            if ( confirmed ) {
                                item.name = this.tailoringName;
                                this.tailoringName = null;
                                this.wait = false;
                            }
                        }
                    );
                }
            );
        },
        onCancelTailoringName: function() {
            this.snack = true;
            this.snackColor = 'error';
            this.snackText = this.$tc('tailoring_name_aendern.status.fehler')
        },
		onEditTailoringKatalog: function(tailoring) {
            this.$router.push({
                name: 'katalog',
				params: {
				    id: this.projekt.name,
					phase: tailoring.name,
					self: tailoring._links.katalog,
					previous: this.$route.params.self
			    }
			});
		},
		onDeleteTailoring: function(tailoring) {
			this.$confirm(this.$tc('tailoring_loeschen.text'),
			    { buttonFalseText: this.$tc('nein'), buttonTrueText: this.$tc('ja'), color: "warning", title: this.$tc('tailoring_loeschen.title') }).then(
                confirmed => {
              	    if ( confirmed ) {
              	        this.wait = true;
                        this.$http.delete(tailoring._links.self.href).then(
                            response => {
                                this.projekt.tailorings.splice(this.projekt.tailorings.indexOf(tailoring), 1);
                                this.wait = false;
                            }
                       )
                    }
                });
		},
		onLoadProjekt : function() {
			this.wait = true;

            this.$http.get(this.$route.params.self).then(
                response => {
                    this.projekt= response.body;
                    this.wait = false;
                },
                response => {
                  console.log(repsonse);
                  this.wait = false;
                }
            );
		},

		onViewTailoringVergleich: function(link) {
            this.wait = true;

            this.$http.get(link, {responseType: 'arraybuffer'}).then(
                response => {
                    const link = document.createElement('a');
                    const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
                    link.href = URL.createObjectURL(blob);
                    link.download = response.headers.get('Content-Disposition').split('filename=')[1];
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                });
		},
	    onOpenScreeningSheet: function(link) {
	        this.wait = true;

	        this.$http.get(link).then(
	            response => {
	                this.screeningSheet = response.body;

                    this.selektionsVektorParameter = [];
                    for (var name in this.screeningSheet.selektionsVektor.levels) {
                        this.selektionsVektorParameter.push({
                            label: this.$tc(name),
                            name: name,
                            wert: this.screeningSheet.selektionsVektor.levels[name]
                       });
                    }
                    this.selektionsVektorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                    this.screeningSheetDownload = this.screeningSheet._links['datei'].href;

                    this.wait = false;
            	    this.openScreeningSheet = true;
                },
                response => {
                    console.log(repsonse);
                    this.wait = false;
               }
            );
	    },
	    onOpenScreeningSheetDatei: function() {
	        this.wait = true;
            this.$http.get(this.screeningSheetDownload, {responseType: 'arraybuffer'}).then(
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
	    onOpenSelektionsVektor: function(link) {
            this.wait = true;

	        this.$http.get(link).then(
	            response => {
	                var selektionsVektor = response.body;

                    this.selektionsVektorParameter = [];
                    for (var name in selektionsVektor.levels) {
                        this.selektionsVektorParameter.push({
                            label: this.$tc(name),
                            name: name,
                            wert: selektionsVektor.levels[name]
                       });
                    }
                    this.selektionsVektorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                    this.wait = false;
                    this.openSelektionsVektor = true;
                },
                response => {
                    console.log(repsonse);
                    this.wait = false;
                }
            );
	    },
        onOpenDokumentGenerierung: function(item) {
            this.tailoring = item;

            this.$http.get(this.tailoring._links.zeichnung.href).then(
                response => {
                    this.dokumentZeichnungen= response.body._embedded.dokumentZeichnungResourceList;
                    this.openDokumentGenerierung = true;
                    this.wait = false;
                },
                response => {
                  console.log(repsonse);
                  this.wait = false;
                }
            );
        },
        onCreateDokuments: function() {
            this.openDokumentGenerierung = false;
            this.wait = true;

            this.$http.get(this.tailoring._links.dokument.href, {responseType: 'arraybuffer'}).then(
                response => {
                    const link = document.createElement('a');
                    const name = response.headers.get('Content-Disposition').split('filename=')[1].replaceAll("\"", "");
                    const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
                    link.href = URL.createObjectURL(blob);
                    link.download = name;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                });
        },
        onCreateKatalog: function() {
            this.openDokumentGenerierung = false;
            this.wait = true;

            this.$http.get(this.tailoring._links.katalogdokument.href, {responseType: 'arraybuffer'}).then(
                response => {
                    const link = document.createElement('a');
                    const name = response.headers.get('Content-Disposition').split('filename=')[1].replaceAll("\"", "");
                    const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
                    link.href = URL.createObjectURL(blob);
                    link.download = name;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                });
        },
        onEditDokumentZeichnung: function(item) {
            this.dokumentZeichnungIndex = this.dokumentZeichnungen.indexOf(item)
            this.dokumentZeichnung = Object.assign({}, item)
            this.editDokumentZeichnung = true
        },
        onSaveDokumentZeichnung: function() {
           this.$http.put(this.dokumentZeichnung._links.self.href, JSON.stringify(this.dokumentZeichnung), {emulateJSON: true}).then(
               response => {
                    if (this.dokumentZeichnungIndex > -1) {
                        Object.assign(this.dokumentZeichnungen[this.dokumentZeichnungIndex], response.body);
                    }
                   this.onCloseDokumentZeichnung();
              }
           )
        },
        onCloseDokumentZeichnung: function () {
            this.editDokumentZeichnung = false
            this.$nextTick(() => {
                this.dokumentZeichnung = Object.assign({}, this.defaultDokumentZeichnung)
                this.dokumentZeichnungIndex = -1
            });
        },
        onOpenDokumente: function(item) {
            this.tailoring = item;
            this.loadDokumentListe();
        },
        onSelectUploadDatei : function(uploadDatei) {
            this.uploadDatei = uploadDatei;
        },
        onUploadDokument: function() {
            if (!this.uploadDatei) {
                this.message = this.$tc('datei_auswaehlen');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.uploadDatei);

            this.wait = true
            this.openDokumente = false;
            this.$http.post(this.tailoring._links.dokument.href, data, {emulateJSON: true} ).then(
                response => {
                    this.openDokumente = true;
                    this.wait = false;
                    this.uploadDatei = null;
                    this.loadDokumentListe();
                },
                response => {
                    this.openDokumente = true;
                    this.wait = false;
                    console.log("error");
                }
            );
        },
        onDownloadDokument: function(item) {
	        this.wait = true;
            this.$http.get(item._links.dokument.href, {responseType: 'arraybuffer'}).then(
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
	    onDeleteDokument: function(item) {
            this.wait = true;
            this.$confirm(this.$tc('dokument_loeschen.text'),
                { buttonFalseText: this.$tc('nein'), buttonTrueText: this.$tc('ja'), color: "warning", title: this.$tc('dokument_loeschen.title') }).then(
                confirmed => {
                    if ( confirmed ) {
                        this.wait = true;
                        this.$http.delete(item._links.dokument.href).then(
                            response => {
                                this.dokumente.splice(this.dokumente.indexOf(item), 1);
                                this.wait = false;
                            },
                            response => {
                                console.log(response);
                                this.wait = false;
                            }
                       );
                    }
                });
        },
	    onDownloadKatalogDefinition: function(item) {
            this.wait = true;
            this.$http.get(item._links.katalogdefinitiondokument.href, {responseType: 'arraybuffer'}).then(
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
	    loadDokumentListe: function() {
            this.$http.get(this.tailoring._links.zeichnung.href + "/doks").then(
                response => {
                    if (response.body.hasOwnProperty('_embedded')) {
                        this.dokumente = response.body._embedded.dokumentResourceList;
                    }
                    this.openDokumente = true;
                    this.wait = false;
                },
                response => {
                  console.log(repsonse);
                  this.wait = false;
                }
            );
	    },



	    onOpenImport: function(item) {
	        this.openImport = true;
            this.tailoring = item;
        },

	    onImportAnforderungen: function() {
            if (!this.uploadDatei) {
                this.message = this.$tc('datei_auswaehlen');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.uploadDatei);

            this.wait = true
            this.openImport = false;
            this.$http.post(this.tailoring._links.import.href, data, {emulateJSON: true} ).then(
                response => {
                    this.wait = false;
                    this.uploadDatei = null;
                    this.snack = true;
                    this.snackColor = 'success';
                    this.snackText = this.$tc('anforderung_importieren.status.fehlerfrei');
                },
                response => {
                    this.openImport = true;
                    this.wait = false;
                    console.log("error");
                }
            );
        },
	},
    computed: {
    },
	watch: {
	},
	created: function() {
        this.$store.commit('breadcrumbs', [
            { text: this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } },
            { text: this.$route.params.id, disabled: false, exact: true,  to: { name: 'projekt', params: { id: this.$route.params.id} } }
        ]);
		this.onLoadProjekt();
	}
}
