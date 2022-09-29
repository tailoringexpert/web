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
					value: 'phases',
				},
                {
                    text: this.$tc('catalog'),
                    sortable: true,
                    value: 'catalogVersion',
                },
				{
					text: this.$tc('action', 2),
					value: 'actions',
					sortable: false
				},
			],
			project : {
			    tailorings : []
			},
            tailoringName: null,

			isScreeningSheetOpen: false,
			screeningSheetTab: null,
            screeningSheet: {
                parameters: []
            },
            screeningSheetDownload : null,
            screeningSheetHeader: [
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

            isSelectionVectorOpen: false,
            selectionVectorHeader: [
                {
                    text:  this.$tc('name'),
                    align: 'start',
                    sortable: true,
                    value: 'label',
                },
                {
                    text: this.$tc('value'),
                    value: 'action',
                    value: 'value',
                },
            ],
            selectionVectorParameter: [],

            isDocumentsOpen : false,
            panel: [0],
            tailoring : null,
            signaturesHeader: [
                {
                    text:  this.$tc('documents.faculty'),
                    sortable: true,
                    value: 'faculty',
                },
                {
                    text: this.$tc('documents.signee'),
                    sortable: true,
                    value: 'signee',
                },
                {
                    text: this.$tc('documents.state'),
                    sortable: true,
                    value: 'signature_state',
                },
                {
                    text: this.$tc('documents.applicable'),
                    sortable: true,
                    value: 'applicable',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            signatures: [],
            isSignatureOpen: false,
            signature: {
                signee: '',
                faculty: '',
                state: '',
                applicable: false
            },
            signatureIndex: -1,

            isAttachmentOpen : false,
            attachmentsHeader : [
                {
                    text: this.$tc('attachment.file'),
                    sortable: true,
                    value: 'name',
                },
                {
                    text: "Typ",
                    sortable: true,
                    value: 'type',
                },
                {
                    text: this.$tc('attachment.checksum'),
                    sortable: true,
                    value: 'hash',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            attachments: [],
            file: null,

            isImportOpen: false,

            isNotesOpen : false,
            notes: [],
            noteText: null,
		};
	},
	methods: {
		onTailoringNew: function() {
            this.$router.push({
                name: 'tailoringnew',
                params: {
                    id: this.project.name,
                    previous: this.$route.params.self,
                    self: this.project._links['tailoring'].href,
                    referer: this.project._links['self'].href
                }
            });
		},

        onTailoringNameOpen: function(item) {
            this.tailoringName = item.name;
		},
        onTailoringNameSave: function(item) {
            this.wait = true;
            this.$http.put(item._links.name.href, item.name, {emulateJSON: true}).then(
                response => {
                    item._links = response.body._links;
                    this.wait = false;
                    this.snack = true;
                    this.snackColor = 'success';
                    this.snackText = this.$tc('tailoring_changename.state.success');
                },
                response => {
                    this.$confirm(response.bodyText,{  buttonFalseText: null, buttonTrueText: this.$tc('tailoring_changename.ok'), color: "warning", title: this.$tc('tailoring_changename.title') }).then(
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
        onTailoringNameCancel: function() {
            this.snack = true;
            this.snackColor = 'error';
            this.snackText = this.$tc('tailoring_changename.state.error')
        },

		onTailoringCatalogEdit: function(tailoring) {
            this.$router.push({
                name: 'catalog',
				params: {
				    id: this.project.name,
					tailoring: tailoring.name,
					self: tailoring._links.catalog,
					previous: this.$route.params.self
			    }
			});
		},

		onTailoringDelete: function(tailoring) {
			this.$confirm(this.$tc('tailoring_delete.text'),
			    { buttonFalseText: this.$tc('no'), buttonTrueText: this.$tc('yes'), color: "warning", title: this.$tc('tailoring_delete.title') }).then(
                confirmed => {
              	    if ( confirmed ) {
              	        this.wait = true;
                        this.$http.delete(tailoring._links.self.href).then(
                            response => {
                                this.projekt.tailorings.splice(this.project.tailorings.indexOf(tailoring), 1);
                                this.wait = false;
                            }
                       )
                    }
                });
		},

		onTailoringCompare: function(link) {
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

	    onScreeningSheetOpen: function(link) {
	        this.wait = true;

	        this.$http.get(link).then(
	            response => {
	                this.screeningSheet = response.body;

                    this.selectionVectorParameter = [];
                    for (var name in this.screeningSheet.selectionVector.levels) {
                        this.selectionVectorParameter.push({
                            label: this.$tc(name),
                            name: name,
                            value: this.screeningSheet.selectionVector.levels[name]
                       });
                    }
                    this.selectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)
                    this.screeningSheetDownload = this.screeningSheet._links['datei'].href;

                    this.wait = false;
            	    this.isScreeningSheetOpen = true;
                },
                response => {
                    console.log(repsonse);
                    this.wait = false;
               }
            );
	    },
	    onScreeningSheetFileOpen: function() {
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
	    onSelectionVectorOpen: function(link) {
            this.wait = true;

	        this.$http.get(link).then(
	            response => {
	                var selectionVector = response.body;

                    this.selectionVectorParameter = [];
                    for (var name in selectionVector.levels) {
                        this.selectionVectorParameter.push({
                            label: this.$tc(name),
                            name: name,
                            value: selectionVector.levels[name]
                       });
                    }
                    this.selectionVectorParameter.sort((a, b) => (a.label > b.label) ? 1 : -1)

                    this.wait = false;
                    this.isSelectionVectorOpen = true;
                },
                response => {
                    console.log(repsonse);
                    this.wait = false;
                }
            );
	    },
        onDocumentOpen: function(item) {
            this.tailoring = item;
            this.wait = true;

            this.$http.get(this.tailoring._links.signature.href).then(
                response => {
                    this.signatures = response.body._embedded.signatures;
                    this.isDocumentsOpen = true;
                    this.wait = false;
                },
                response => {
                  console.log(repsonse);
                  this.wait = false;
                }
            );
        },
        onDocumentsCreate: function() {
            this.isDocumentsOpen = false;
            this.wait = true;

            this.$http.get(this.tailoring._links.document.href, {responseType: 'arraybuffer'}).then(
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
        onCatalogCreate: function() {
            this.isDocumentsOpen = false;
            this.wait = true;

            this.$http.get(this.tailoring._links.tailoringcatalog.href, {responseType: 'arraybuffer'}).then(
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
        onSignatureEdit: function(item) {
            this.signatureIndex = this.signatures.indexOf(item)
            this.signature = Object.assign({}, item)
            this.isSignatureOpen = true
        },
        onSignatureSave: function() {
           this.$http.put(this.signature._links.self.href, JSON.stringify(this.signature), {emulateJSON: true}).then(
               response => {
                    if (this.signatureIndex > -1) {
                        Object.assign(this.signatures[this.signatureIndex], response.body);
                    }
                   this.onSignatureClose();
              }
           )
        },
        onSignatureClose: function () {
            this.isSignatureOpen = false
            this.$nextTick(() => {
                this.signature = Object.assign({}, this.defaultDokumentZeichnung)
                this.signatureIndex = -1
            });
        },

        onSelectFile : function(file) {
            this.file = file;
        },

        // attachments
        onAttachmentOpen: function(item) {
            this.tailoring = item;
            this.loadAttachmentList();
        },
        onAttachmentUpload: function() {
            if (!this.file) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.file);

            this.wait = true
            this.isAttachmentOpen = false;
            this.$http.post(this.tailoring._links.attachment.href, data, {emulateJSON: true} ).then(
                response => {
                    this.openAttachment = true;
                    this.wait = false;
                    this.file = null;
                    this.loadAttachmentList();
                },
                response => {
                    this.openAttachment = true;
                    this.wait = false;
                    console.log("error");
                }
            );
        },
        onAttachmentDownload: function(item) {
	        this.wait = true;
            this.$http.get(item._links.self.href, {responseType: 'arraybuffer'}).then(
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
	    onAttachmentDelete: function(item) {
            this.wait = true;
            this.$confirm(this.$tc('attachment_delete.text'),
                { buttonFalseText: this.$tc('nein'), buttonTrueText: this.$tc('ja'), color: "warning", title: this.$tc('dokument_loeschen.title') }).then(
                confirmed => {
                    if ( confirmed ) {
                        this.wait = true;
                        this.$http.delete(item._links.self.href).then(
                            response => {
                                this.attachments.splice(this.attachments.indexOf(item), 1);
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

        onNotesOpen: function(item) {
            this.tailoring = item;
            this.wait = true;
            this.$http.get(this.tailoring._links.note.href).then(
                response => {
                    if (response.body.hasOwnProperty('_embedded')) {
                        this.notes = response.body._embedded.notes;
                    }
                    this.isNotesOpen = true,
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
            );

        },

        onNoteNew: function() {
            if ( this.noteText == null) {
                return;
            }

            this.wait = true;
            this.isNotesOpen = false;

            this.$http.post(this.tailoring._links.note.href, this.noteText, {emulateJSON: true}).then(
                response => {
                    this.noteText = null;
                    this.wait = false;
                    this.onNotesOpen(this.tailoring);
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
           );
        },

        onNotesClose: function() {
            this.noteText = null;
            this.isNotesOpen = false;
        },

	    onBaseCatalogDownload: function(item) {
            this.wait = true;
            this.$http.get(item._links.basecatalog.href, {responseType: 'arraybuffer'}).then(
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
	    loadAttachmentList: function() {
            this.$http.get(this.tailoring._links.attachment.href).then(
                response => {
                    if (response.body.hasOwnProperty('_embedded')) {
                        this.attachments = response.body._embedded.files;
                    }
                    this.isAttachmentOpen = true;
                    this.wait = false;
                },
                response => {
                  console.log(repsonse);
                  this.wait = false;
                }
            );
	    },



	    onImportOpen: function(item) {
	        this.isImportOpen = true;
            this.tailoring = item;
        },

	    onImportRequirements: function() {
            if (!this.file) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.file);

            this.wait = true
            this.isImportOpen = false;
            this.$http.post(this.tailoring._links.import.href, data, {emulateJSON: true} ).then(
                response => {
                    this.wait = false;
                    this.file = null;
                    this.snack = true;
                    this.snackColor = 'success';
                    this.snackText = this.$tc('anforderung_importieren.status.fehlerfrei');
                },
                response => {
                    this.isImportOpen = true;
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
        this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } },
            { text: this.$route.params.id, disabled: false, exact: true,  to: { name: 'project', params: { id: this.$route.params.id} } }
        ]);

		// this.onProjectLoad();
        this.$http.get(this.$route.params.self).then(
            response => {
                this.project= response.body;
                this.wait = false;
            },
            response => {
              console.log(repsonse);
              this.wait = false;
            }
        );
	}
}
