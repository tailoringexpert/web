import App from './App.vue'
import { createApp } from "vue"
import router from '@/router'
import store from "@/store"

import VueLogger from "vuejs3-logger"
import axios from "axios"
import i18n from "@/plugins/i18n"

import vuetify from "@/plugins/vuetify"
import {Vuetify3Dialog} from "vuetify3-dialog"

import getEnv from '@/utils/env'

const app = createApp(App);

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

// i8n
app.use(i18n);

// vuetify
app.use(vuetify);
app.use(Vuetify3Dialog, {
    vuetify: vuetify, 
    defaults: {
      //You can pass default options for dialogs, dialog's card, snackbars or bottom-sheets here
    }
  }
);

// router
app.use(router);

// store
app.use(store);
store.commit('tenant', getEnv('VUE_APP_TENANT'));





// axios
axios.defaults.headers.common['X-TENANT'] = store.state.tenant;
app.config.globalProperties.$axios = axios.create({
})

var origin = window.location.origin + "/api";
axios
    .get(origin)
    .then(response => {
        store.commit('links', response.data._links);
        axios
            .get(response.data._links['selectionvector'].href)
            .then( response => {
                store.commit('selectionvectors', response.data._embedded.selectionVectorProfiles);
                app.mount('#app')
            })
    });
