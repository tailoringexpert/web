export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',
            conversionLink: undefined,
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

            file: null,
            isConvertOpen: false
        }
    },
    methods: {
        onSelectFile : function(file) {
            this.file = file;
        },
        onConvert: function() {
            if (!this.file) {
                this.message = this.$tc('file_select');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("file", this.file);

            this.wait = true
            this.isConvertOpen = false;

            this.$http.post(this.conversionLink, data, {responseType: 'arraybuffer'} ).then(
                response => {
                    this.handleFileResponse(response);
                    this.file = null;
                    this.wait = false;
                },
                response => {
                    this.file = null;
                    this.wait = false;
                    console.log("error");
                }
            );
        },
        onDownloadPdf: function(item) {
            this.onDownload(item._links.pdf.href);
        },
        onDownloadJson: function(item) {
            this.onDownload(item._links.json.href);
        },
        onDownloadExcel: function(item) {
            this.onDownload(item._links.excel.href);
        },
        onDownloadDocuments: function(item) {
            this.onDownload(item._links.document.href);
        },
        onDownload: function(href) {
            this.wait = true;
            this.$http.get(href, {responseType: 'arraybuffer'}).then(
                response => {
                    this.handleFileResponse(response);
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
           );
        },

        handleFileResponse: function(response) {
            const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = response.headers.get('Content-Disposition').split('filename=')[1];
            link.click();
            URL.revokeObjectURL(link.href);
        },

        loadCatalogs: function() {
            this.wait = true;

            this.$http.get(this.$store.state.links['catalog'].href).then(
                response => {
                    this.catalogs = [];
                    this.catalogs = response.body._embedded.baseCatalogVersions;
                    this.wait = false;
                    this.conversionLink = response.body._links.convert.href;
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