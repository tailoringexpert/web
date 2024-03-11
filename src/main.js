import { createApp } from "vue"
import App from './App.vue'
import { createStore } from "vuex"

import i18n from "@/plugins/i18n"
import md from "@mdi/font/css/materialdesignicons.min.css"
import getEnv from "@/utils/env"
import VueLogger from "vuejs3-logger"
import axios from "axios"

import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"


const app = createApp(App);

// vuetify
const vuetify = createVuetify({
  components,
  directives,
})
app.use(vuetify);


// store
const store = createStore({
    state () {
      return {
          links: [],
          catalogs: [],
          breadcrumbs: [],
          selectionvectors: [],
          selectionVectorParameterTranslations: null
      }
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
});
app.use(store);


// logger
app.use(VueLogger, {
   isEnabled: true,
   logLevel : (process.env.NODE_ENV === 'production') ? 'error' : 'debug',
   stringifyArguments : false,
   showLogLevel : true,
   showMethodName : true,
   separator: '|',
   showConsoleColors: true
});

axios.interceptors.request.use(
  config => {
    config.headers["X-Tenant"] = "demo";
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

app.config.globalProperties.$axios = axios.create({
})



var origin = window.location.origin + "/api";
axios
    .get(origin)
    .then(response => {
        console.log(response.data)
        store.commit('links', response.data._links);
        axios
            .get(response.data._links['selectionvector'].href)
            .then( response => {
                console.log(response.data._embedded);
                store.commit('selectionvectors', response.data._embedded.selectionVectorProfiles);
            })
    });
