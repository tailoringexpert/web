import {
    Editor,
    EditorContent,
    EditorMenuBar
} from 'tiptap';

import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Strike,
    Underline,
    History,
    Image
} from 'tiptap-extensions';

import '@/assets/sass/editor.scss';

export const data = {
        components: {
            EditorContent,
            EditorMenuBar,
        },
        data: function() {
            return {
            breadcrumbs: [],
             allParentNodes : true,
                editor: null,
                referenceHeaders: [
                    {
                        text: this.$tc('name'),
                        align: 'start',
                        sortable: true,
                        value: 'name',
                    },
                ],
                urls: {},
                links: [],
                item: null,
                wait: false,
                edit: false,
                enabled: true,
                selection: [],
                kapitel: null,
                selection: [
                  {
                    anforderungen: []
                  }
                ],

                unterkapitel: [],
                anforderungen: [],
                anforderung: null,
                anforderungRequest: null,
                katalog: {
                  toc:{
                    kapitel: []
                  }
                },

                open: [1],
                allOpened: false,lastOpen: [],
                search: null,
                caseSensitive: false,
            };
        },
        methods: {
            onLoadKatalog : function() {
                this.wait = true;

                this.$http.get(this.$route.params.self.href).then(
                    response => {
                        this.katalog = response.body;
                        this.wait = false;
                    },
                    response => {
                        console.log(response);
                    }
                );
            },
            onSelectKapitel : function(kapitel) {
                this.kapitel = kapitel[0];
                this.anforderungen = this.kapitel.anforderungen;

                this.breadcrumbs = [];
                this._kapitelPfad.forEach(node => this.breadcrumbs.push({ text: node.nummer + ' ' + node.name, disabled: true}));
            },

            onEditAnforderung : function(anforderung) {
               this.anforderung=anforderung;
               this.anforderungRequest = this.onSaveEditAnforderung;
               this.editor.setContent(this.anforderung.text);
               this.edit=true;
            },
            onNewAnforderung: function(anforderung) {
                this.anforderungRequest = this.onSaveNewAnforderung;
                this.anforderung = new Object();
                this.anforderung._links = anforderung._links;
                this.editor.setContent(null);
                this.edit=true;
            },
            onCancelEdit: function() {
              this.edit = false;
            },
            onSaveEditAnforderung: function(text) {
                this.$http.put(this.anforderung._links.text.href, text, {emulateJSON: true}).then(
                    response =>  this.handleAnforderungResponse(this.anforderung, response.body),
                    response => {
                        this.edit = false;
                    }
                );
            },
            onSaveNewAnforderung: function(text) {
                this.$http.post(this.anforderung._links.self.href, text, {emulateJSON: true}).then(
                    response => {
                        this.loadKapitel(this.kapitel);
                    },
                    response => {
                        console.log(response);
                        this.edit = false;
                    }
                );
            },
            onSaveAnforderung : function() {
                this.anforderungRequest.call(this, this.editor.getHTML());
            },
            onHandleAusgewaehlt : function(anforderung) {
                this.$http.put(anforderung._links.ausgewaehlt.href).then(
                    response => this.handleAnforderungResponse(anforderung, response.body),
                    response => {
                        this.edit = false;
                    }
                );
            },
            onHandleGruppeAusgewaehlt: function(gruppe, state) {
                if (this.kapitel != null ) {
                    this.wait = true;
                    this.$http.put(this.kapitel._links.selektion.href.replace("{ausgewaehlt}", state)).then(
                        response => {
                            this.kapitel.kapitel= response.body.kapitel;
                            this.kapitel.anforderungen = response.body.anforderungen;
                            this.anforderungen = this.kapitel.anforderungen;
                            this.wait = false;
                        },
                        response => {
                            console.log(response);
                            this.wait = false;
                        }
                    );
                } else {
                    this.$confirm(
                        this.$tc('kapitel_selektion.text'),
                        {
                            title: this.$tc('kapitel_selektion.titel'),
                            buttonFalseText: null,
                            buttonTrueText:  this.$tc('kapitel_selektion.ok')
                        }
                    );
                }
            },
            handleAnforderungResponse: function (anforderung, responseBody) {
                anforderung.text = responseBody.text;
                anforderung.ausgewaehlt = responseBody.ausgewaehlt;
                anforderung.geaendert = responseBody.geaendert;
                anforderung._links = responseBody._links;

                this.anforderung = null;
                this.edit = false;
                this.wait = false;
            },
            loadKapitel: function(kapitel) {
                this.$http.get(kapitel._links.self.href).then(
                    response => {
                         this.kapitel.kapitel= response.body.kapitel;
                         this.kapitel.anforderungen = response.body.anforderungen;
                         this.anforderungen = this.kapitel.anforderungen;
                         this.selection[0] = this.kapitel;
                         //this.$refs.tree.updateAll(true);
                         this.edit = false;
                    },
                    response => {
                        console.log(repsonse);
                    }
                );
            },
            handleSearch: function (val) {
                if (val) {
                    if (!this.allOpened) {
                        this.lastOpen = this.open;
                        this.allOpened = true;
                        this.$refs.tree.updateAll(true);
                    }
                } else {
                    this.$refs.tree.updateAll(false);
                    this.allOpened = false;
                    this.open = this.lastOpen;
                }
            },
            onImage: function(command) {
                const src = prompt ('Enter URL');
                if (src != null ) {
                    command({src})
                }
            },
        },
        computed: {
            _alleKapitel: function () {
                const replaceChildren = (obj,parent) => {
                    const clone = Object.assign({},obj);
                    delete clone.kapitel;
                    if (parent) {
                        clone.parent = parent;
                    }
                    return clone;
                }

                const addItems = (arr,parent) => {
                    const items = arr.reduce((acc,x)=>{
                        acc.push(replaceChildren(x,parent));
                        if (x.kapitel) {
                            acc.push(addItems(x.kapitel, x.kapitelName))
                        }
                        return acc
                    },[]);
                    return items.flat()
                };

                return addItems(this.katalog.toc.kapitel).reduce((acc,x)=>{
                    acc[x.kapitelName]=x;
                    return acc;
                },{});
            },
            _kapitelPfad: function() {
                const proxy = {};
                var  addParents = (x, all) => {
                    const parentId = this._alleKapitel[x.kapitelName].parent;
                    if (parentId) {
                        if (all) {
                            addParents(this._alleKapitel[parentId]);
                        }
                        proxy[parentId] = this._alleKapitel[parentId]
                    }
                };

                addParents(this.kapitel, this.allParentNodes);
                proxy[this.kapitel.kapitel] = this.kapitel;
                return Object.values(proxy);
            }
        },
        watch: {
        },
        created: function() {
            this.$store.commit('breadcrumbs', [
                { text: this.$tc('projekt', 2),  disabled: false, exact: true, to: { name: 'projekte' } },
                { text: this.$route.params.id, disabled: false, exact: true,  to: { name: 'projekt', params: { id: this.$route.params.id, self: this.$route.params.previous} } },
                { text: this.$route.params.phase, disabled: true},
            ]);
            this.onLoadKatalog();
        },
        mounted() {
            this.editor = new Editor(
            {
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading(
                        {
                            levels: [1, 2, 3]
                        }
                    ),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Link(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Table(
                        {
                            resizable: true,
                        }
                    ),
                    new TableHeader(),
                    new TableCell(),
                    new TableRow(),
                    new Image(),
                ],
            });
        },
    }
