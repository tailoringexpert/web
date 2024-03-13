import { createApp } from "vue"
import App from './App.vue'
import router from '@/router'

import i18n from "@/plugins/i18n"
import vuetify from "@/plugins/vuetify"
import store from "@/store"
import VueLogger from "vuejs3-logger"
import axios from "axios"

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

// router
app.use(router);

// store
app.use(store);

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
                 app.mount('#app')
            })
    });
//app.mount('#app')
