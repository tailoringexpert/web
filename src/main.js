import Vue from 'vue'
import VueResource from 'vue-resource';
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/plugins/i18n'
import md from "@mdi/font/css/materialdesignicons.min.css";

import Vuetify from "vuetify";
import VuetifyConfirm from "vuetify-confirm";

import VueLogger from 'vuejs-logger';


// CREATE VUETIFY INSTANCE
const vuetify = new Vuetify({
  theme: { dark: false }
});


// THIS IS IMPORTANT TO INSTALL DIALOGS
// YOU NEED TO SEND VUETIFY INSTANCE INTO DIALOG CONTEXT
Vue.use(Vuetify);
Vue.use(VuetifyConfirm, {
  vuetify
});

Vue.use(VueResource);

Vue.config.productionTip = false;
Vue.use(VueLogger, {
    isEnabled: true,
    logLevel : Vue.config.productionTip  ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
}
);

Vue.http.interceptors.push(function(request) {
    request.headers.set('X-Tenant', process.env.VUE_APP_TENANT);
});


var origin = window.location.origin + "/api";
Vue.http.get(origin).then(
    response => {
        store.commit('links', response.body._links);

        Vue.http.get(response.body._links['selectionvector'].href).then(
            response => {
                store.commit('selectionvectors', response.body._embedded.selectionVectorProfiles);
            },
            response => {
                console.log(response);
            }
        );

        new Vue({
            vuetify,
            i18n,
            router,
            store,
            render: h => h(App)
        }).$mount('#app')


    },
    response => {
        console.log(response);
    }
);
