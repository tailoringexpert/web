import Vue from 'vue'

export const data = {
    data() {
        return {
            wait: false,
            snack: false,
            snackColor: '',
            snackText: '',
            katalogLink: undefined,
            headers: [
                {
                    text: this.$tc('katalog'),
                    sortable: true,
                    value: 'version',
                },
                {
                    text: this.$tc('gueltig_von'),
                    sortable: true,
                    value: 'gueltigAb',
                },
                {
                    text: this.$tc('gueltig_bis'),
                    sortable: true,
                    value: 'gueltigBis',
                },
                {
                    text: this.$tc('aktion', 2),
                    value: 'actions',
                    sortable: false
                },
            ],
            kataloge: [],
            katalogDatei: undefined,
        }
    },
    methods: {
        onSelectKatalog : function(katalogDatei) {
            this.katalogDatei = katalogDatei;
            console.log("select: " + this.katalogDatei);

        },

        onUploadKatalog: function() {
            if (!this.katalogDatei) {
                this.message = this.$tc('datei_auswaehlen');
                return;
            }
            this.message = "";

            let data = new FormData();
            data.append("datei", this.katalogDatei);

            const reader = new FileReader();
            reader.onload = e =>  {
                this.wait = true;

                this.$http.post(this.$store.state.links.katalog.href, e.target.result, {emulateJSON: true} )
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
            reader.readAsText(this.katalogDatei);
        },
        onDownloadPdf: function(item) {
            this.onDownload(item.links.pdf.href);
        },
        onDownloadJson: function(item) {
            this.onDownload(item.links.json.href);
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

        loadKataloge: function() {
            this.wait = true;
            this.$http.get(this.katalogLink).then(
                response => {
                    this.kataloge = [];
                    for (let i = 0; i<response.body._embedded.katalogVersionResourceList.length; i++) {
                        var item = response.body._embedded.katalogVersionResourceList[i];
                        Vue.$log.info(item);
                        var links = item._links;

                        this.kataloge.push({
                            version: item.version,
                            gueltigAb: new Date(item.gueltigAb).toLocaleDateString(),
                            gueltigBis: "",
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

//        kataloge2: function() {
//        console.log(this.$store.state.kataloge);
//            return this.$store.state.kataloge;
//        },
    },
    created() {
        this.wait = true;

        this.$store.commit('breadcrumbs', [
            { text: this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } },
            { text: this.$tc('neues_projekt'), disabled: true }
        ]);

        var origin = window.location.origin + "/api";
        this.$http.get(origin)
            .then(
                response => {
                    this.katalogLink = response.body._links['katalog'].href;
                    this.loadKataloge();
                    this.wait = false;
                },
                response => {
                    console.log(response);
                    this.wait = false;
                }
            );


    },
}