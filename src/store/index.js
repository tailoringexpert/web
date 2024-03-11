import { createApp } from "vue"
import { createStore } from "vuex"

export default createStore({
    state: {
            links: [],
            catalogs: [],
            breadcrumbs: [],
            selectionvectors: [],
            selectionVectorParameterTranslations: null,
    },
    mutations: {
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
    },

})

