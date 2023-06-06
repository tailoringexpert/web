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
                item: null,
                wait: false,
                isEdit: false,
                enabled: true,
                selection: [],
                chapter: null,
                selection: [
                  {
                    requirements: []
                  }
                ],

                requirements: [],
                requirement: null,
                requirementRequest: null,
                catalog: {
                  toc:{
                    chapters: []
                  }
                },

                open: [1],
                allOpened: false,lastOpen: [],
                search: null,
                caseSensitive: false,
            };
        },
        methods: {
            onChapterSelect : function(chapters) {
                this.chapter = chapters[0];
                if (chapters.length > 0) {
                    this.requirements = this.chapter.requirements;
                    this.breadcrumbs = [];
                    this._chapterPath.forEach(node => this.breadcrumbs.push({ text: node.number + ' ' + node.name, disabled: true}));
                }
            },

            onRequirementNew: function(requirement) {
                this.requirementRequest = this.onRequirementNewSave;
                this.requirement = new Object();
                this.editor.setContent(null);
                this.isEdit = true;
            },
            onRequirementNewSave: function(text) {
                this.$http.post(this.requirement._links.self.href, text, {emulateJSON: true}).then(
                    response => {
                        this.loadChapter(this.chapter);
                    },
                    response => {
                        console.log(response);
                        this.isEdit = false;
                    }
                );
            },
            onRequirementEdit : function(requirement) {
               this.requirementRequest = this.onRequirementEditSave;
               this.requirement = requirement;
               this.editor.setContent(this.requirement.text);
               this.isEdit = true;
            },
            onRequirementEditSave: function(text) {
                this.$http.put(this.requirement._links.text.href, text, {emulateJSON: true}).then(
                    response =>  this.handleRequirementResponse(this.requirement, response.body),
                    response => {
                        this.isEdit = false;
                    }
                );
            },

            onRequirementSave : function() {
                this.requirementRequest.call(this, this.editor.getHTML());
            },

            onEditCancel: function() {
              this.isEdit = false;
            },


            onRequirementSelect : function(requirement) {
                this.$http.put(requirement._links.selected.href).then(
                    response => this.handleRequirementResponse(requirement, response.body),
                    response => {
                        this.isEdit = false;
                    }
                );
            },
            
            onChapterRequirementsSelect: function(chapter, state) {
                if (this.chapter != null ) {
                    this.wait = true;
                    this.$http.put(this.chapter._links.selection.href.replace("{selected}", state)).then(
                        response => {
                            this.chapter.chapters = response.body.chapters;
                            this.chapter.requirements = response.body.requirements;
                            this.requirements = this.chapter.requirements;
                            this.selection[0] = this.chapter;
                            this.wait = false;
                        },
                        response => {
                            this.wait = false;
                        }
                    );
                } else {
                    this.$confirm(
                        this.$tc('chapter_selection.text'),
                        {
                            title: this.$tc('chapter_selection.title'),
                            buttonFalseText: null,
                            buttonTrueText:  this.$tc('chapter_selection.ok')
                        }
                    );
                }
            },
            handleRequirementResponse: function (requirement, responseBody) {
                requirement.text = responseBody.text;
                requirement.selected = responseBody.selected;
                requirement.changed = responseBody.changed;
                requirement._links = responseBody._links;

                this.requirement = null;
                this.isEdit = false;
                this.wait = false;
            },
            
            loadChapter: function(chapter) {
                this.$http.get(chapter._links.self.href).then(
                    response => {
                         this.chapter.chapters= response.body.chapter;
                         this.chapter.requirements = response.body.requirements;
                         this.requirements = this.chapter.requirements;
                         this.selection[0] = this.chapter;
                         //this.$refs.tree.updateAll(true);
                         this.isEdit = false;
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
            _allChapters: function () {
                const replaceChildren = (obj,parent) => {
                    const clone = Object.assign({},obj);
                    delete clone.chapters;
                    if (parent) {
                        clone.parent = parent;
                    }
                    return clone;
                }

                const addItems = (arr,parent) => {
                    const items = arr.reduce((acc,x)=>{
                        acc.push(replaceChildren(x,parent));
                        if (x.chapters) {
                            acc.push(addItems(x.chapters, x.chapterName))
                        }
                        return acc
                    },[]);
                    return items.flat()
                };

                return addItems(this.catalog.toc.chapters).reduce((acc,x)=>{
                    acc[x.chapterName]=x;
                    return acc;
                },{});
            },
            _chapterPath: function() {
                const proxy = {};
                var addParents = (x, all) => {
                    const parentId = this._allChapters[x.chapterName].parent;
                    if (parentId) {
                        if (all) {
                            addParents(this._allChapters[parentId]);
                        }
                        proxy[parentId] = this._allChapters[parentId]
                    }
                };

                addParents(this.chapter, this.allParentNodes);
                proxy[this.chapter.chapters] = this.chapter;
                return Object.values(proxy);
            }
        },
        watch: {
        },
        created: function() {
            this.wait = true;

            this.$store.commit('breadcrumbs', [
                { text: this.$tc('project', 2),  disabled: false, exact: true, to: { name: 'projects' } },
                { text: this.$route.params.id, disabled: false, exact: true,  to: { name: 'project', params: { id: this.$route.params.id, self: this.$route.params.previous} } },
                { text: this.$route.params.phase, disabled: true},
            ]);

            this.$http.get(this.$route.params.self.href).then(
                response => {
                    this.catalog = response.body;
                    this.wait = false;
                },
                response => {
                    console.log(response);
                }
            );
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
