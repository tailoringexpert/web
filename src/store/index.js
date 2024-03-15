import { createStore } from "vuex"

const store = createStore({
    state: {
            tenant: null,
            links: [],
            catalogs: [],
            breadcrumbs: [],
            selectionvectors: [],
            selectionVectorParameterTranslations: null,
            project: null,
    },
    mutations: {
        tenant: function(state, tenant) {
            state.tenant = tenant;
        },
        links: function(state, links) {
            state.links = links;
        },
        catalogs: function(state, catalogs) {
            state.catalogs = catalogs;
        },
        breadcrumbs: function(state, breadcrumbs) {
            state.breadcrumbs = breadcrumbs;
        },
        selectionvectors: function(state, selectionvectors) {
            state.selectionvectors = selectionvectors;
        },
        selectionVectorParameterTranslations: function(state, selectionVectorParameterTranslations) {
            state.selectionVectorParameterTranslations = selectionVectorParameterTranslations;
        },
        project: function(state, project) {
            state.project = project;
        }
    },

})

export default store;
