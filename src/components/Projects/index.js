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
					text: this.$tc('created_at'),
					value: 'creationTimestamp',
					sortable: true,
				},
				{
					text: this.$tc('catalog'),
					value: 'catalogVersion',
					sortable: true,
					align: 'start',
				},
				{
					text: this.$tc('action', 2),
					value: 'actions',
					sortable: false
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
									catalogVersion: item.catalogVersion,
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
	},
	created: function() {
		this.onLoadProjects();
		this.$store.commit('breadcrumbs', [
		    { text:  this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } }
		]);
	},
}