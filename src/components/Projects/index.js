export const data = {
	data: function() {
		return {
			wait: false,
			state: 'ONGOING',
			headers: [
				{
					text: this.$tc('name'),
					value: 'name',
					sortable: true,
					align: 'start',
					width: '40%'
				},
				{
					text: this.$tc('created_at'),
					value: 'creationTimestamp',
					sortable: true,
					width: '15%'
				},
				{
					text: this.$tc('state'),
					value: 'state',
					sortable: false,
					width: '15%',
					filter: value => {
                         return this.state === null || this.state.trim() === ""  || value == this.state ;
                        }
				},
				{
					text: this.$tc('action', 2),
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
		        this.$tc('project_delete.text'),{
    		        buttonFalseText: this.$tc('no'),
    		        buttonTrueText: this.$tc('yes'),
	    	        color: "warning",
		            title: this.$tc('project_delete.title')
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

			this.$http.get(this.$store.state.links['project'].href).then(
				response => {
				    this.projects = [];

					if (response.body._embedded != undefined) {
						for (let i = 0; i < response.body._embedded.projects.length; i++) {
							var item = response.body._embedded.projects[i];
							var links = response.body._embedded.projects[i]._links;
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
				},
				response => {
					console.log("error: " + response);
					this.wait = false;
				}
			);
		},
		onCopyProject: function(project){
            this.$router.push({
                name: 'projectcopy',
            	params: {
            	    id: project.name,
            		self: project.self,
            		screeningsheet: project.screeningsheet
                }
            });
        },
        onProjectState: function(project) {
			this.$confirm(this.$tc('project_state.text'),
			    { buttonFalseText: this.$tc('no'), buttonTrueText: this.$tc('yes'), color: "warning", title: this.$tc('project_state.title') }).then(
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
		    { text:  this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } }
		]);
	},
}