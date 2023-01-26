import Vue from 'vue'

export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',
            catalogLink: undefined,
            headers: [
                {
                    text: this.$tc('catalog'),
                    sortable: true,
                    value: 'version',
                },
                {
                    text: this.$tc('validFrom'),
                    sortable: true,
                    value: 'validFrom',
                },
                {
                    text: this.$tc('validUntil'),
                    sortable: true,
                    value: 'validUntil',
                },
                {
                    text: this.$tc('action', 2),
                    value: 'actions',
                    sortable: false
                },
            ],
            catalogs: [],
            file: undefined,
        }
    },
    methods: {
        onFileSelect : function(file) {
            this.file = file;
        },

        onFileUpload: function() {
            if (!this.file) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.file);

            const reader = new FileReader();
            reader.onload = e =>  {
                this.wait = true;

                this.$http.post(this.$store.state.links.catalog.href, e.target.result, {emulateJSON: true} )
                .then(
                    response => {
                        this.wait = false;
                        Vue.$log.debug("fertig");
                    },
                    response => {
                        this.wait = false;
                        Vue.$log.debug("error");
                    }
                );
            }
            reader.readAsText(this.file);
        },
        onDownloadPdf: function(item) {
            this.onDownload(item.links.pdf.href);
        },
        onDownloadJson: function(item) {
            this.onDownload(item.links.json.href);
        },
        onDownloadDocuments: function(item) {
            this.onDownload(item.links.document.href);
        },
        onDownload: function(href) {
            this.wait = true;
            this.$http.get(href, {responseType: 'arraybuffer'}).then(
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

        loadCatalogs: function() {
            this.wait = true;
            this.$http.get(this.catalogLink).then(
                response => {
                    this.catalogs = [];
                    for (let i = 0; i<response.body._embedded.baseCatalogVersions.length; i++) {
                        var item = response.body._embedded.baseCatalogVersions[i];
                        Vue.$log.info(item);
                        var links = item._links;

                        this.catalogs.push({
                            version: item.version,
                            validFrom: new Date(item.gueltigAb).toLocaleDateString(),
                            validUntil: "",
                            links: links,
                        });
                    }
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
           );
        },
    },
    watch: {
    },
    computed: {
    },
    created() {
        this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } },
            { text: this.$tc('catalog'), disabled: true }
        ]);

        var origin = window.location.origin + "/api";
        this.$http.get(origin)
            .then(
                response => {
                    this.catalogLink = response.body._links['catalog'].href;
                    this.loadCatalogs();
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
            );


    },
}