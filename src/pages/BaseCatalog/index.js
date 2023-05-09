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
            catalogs: []
        }
    },
    methods: {
        onDownloadPdf: function(item) {
            this.onDownload(item._links.pdf.href);
        },
        onDownloadJson: function(item) {
            this.onDownload(item._links.json.href);
        },
        onDownloadDocuments: function(item) {
            this.onDownload(item._links.document.href);
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

            this.$http.get(this.$store.state.links['catalog'].href).then(
                response => {
                    this.catalogs = [];
                    this.catalogs = response.body._embedded.baseCatalogVersions;
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
        this.$store.commit('breadcrumbs', [
            { text: this.$tc('catalog', 2), disabled: true }
        ]);

        this.loadCatalogs();
    },
}