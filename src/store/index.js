import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router'
Vue.use(Vuex);

export default new Vuex.Store({
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
