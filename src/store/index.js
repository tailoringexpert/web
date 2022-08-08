import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        links: [],
	    kataloge: [],
        breadcrumbs: [],
        selektionsvektoren: [],
    },
    mutations: {
        links: function(state, links) {
            state.links = links;
        },
        kataloge: function(state, kataloge) {
            state.kataloge = kataloge;
        },
        breadcrumbs: function(state, breadcrumbs) {
            state.breadcrumbs = breadcrumbs;
        },
        selektionsvektoren: function(state, selektionsvektoren) {
            state.selektionsvektoren = selektionsvektoren;
        },
    },

})
