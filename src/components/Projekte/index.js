export const data = {
	data: function() {
		return {
			wait: false,
			headers: [
				{
					text: this.$tc('name'),
					value: 'name',
					sortable: true,
					align: 'start',
				},
				{
					text: this.$tc('erstellt_am'),
					value: 'erstellungsZeitpunkt',
					sortable: true,
				},
				{
					text: this.$tc('katalog'),
					value: 'katalogVersion',
					sortable: true,
					align: 'start',
				},
				{
					text: this.$tc('aktion', 2),
					value: 'actions',
					sortable: false
				},
			],
			projekte: []
		};
	},

	methods: {
		onNewProject: function() {
			this.$router.push({
			    name: 'projektanlegen'
            });
		},
		onEditProjekt: function(projekt) {
			this.$router.push({
                name: 'projekt',
				params: {
				    id: projekt.name,
					self: projekt.self
                }
            });
		},
		onDeleteProjekt: function(projekt) {
		    this.$confirm(
		        this.$tc('projekt_loeschen.text'),{
    		        buttonFalseText: this.$tc('nein'),
    		        buttonTrueText: this.$tc('ja'),
	    	        color: "warning",
		            title: this.$tc('projekt_loeschen.titel')
		        }).then(
  		            confirmed => {
  		                if ( confirmed ) {
  		      	            this.wait = true;
                            this.$http.delete(projekt.self).then(
                                response => {
                                    this.wait = false;
                                    this.onLoadProjekte();
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
		onLoadProjekte : function() {
			this.wait = true;

			this.$http.get(this.$store.state.links['projekt'].href).then(
				response => {
				    this.projekte = [];

					if (response.body._embedded != undefined) {
						for (let i = 0; i < response.body._embedded.projektInformationResourceList.length; i++) {
							var item = response.body._embedded.projektInformationResourceList[i];
							var links = response.body._embedded.projektInformationResourceList[i]._links;
							this.projekte.push(
								{
									name: item.name,
									erstellungsZeitpunkt: item.erstellungsZeitpunkt,
									katalogVersion: item.katalogVersion,
									self: links.self.href,
									screeningsheet: links.screeningsheet.href
								}
							);
						}
					}
				this.wait = false;
				},
				response => {
					console.log("error: " + response);
					this.wait = false;
				}
			);
		},
		onCopyProjekt: function(projekt){
            this.$router.push({
                name: 'projektkopieren',
            	params: {
            	    id: projekt.name,
            		self: projekt.self,
            		screeningsheet: projekt.screeningsheet
                }
            });
        },
	},
	computed: {
	},
	watch: {
	},
	created: function() {
		this.onLoadProjekte();
		this.$store.commit('breadcrumbs', [
		    { text:  this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } }
		]);
	},
}