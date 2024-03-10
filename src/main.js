import { createApp } from 'vue'
import VueResource from 'vue-resource';
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/plugins/i18n'
import md from "@mdi/font/css/materialdesignicons.min.css";
import Storage from 'vue-ls';
import getEnv from '@/utils/env';
import Vuetify from "vuetify";
import VuetifyConfirm from "vuetify-confirm";

import VueLogger from 'vuejs-logger';

const app = createApp(App)

// CREATE VUETIFY INSTANCE
const vuetify = new Vuetify({
  theme: { dark: false }
});


// THIS IS IMPORTANT TO INSTALL DIALOGS
// YOU NEED TO SEND VUETIFY INSTANCE INTO DIALOG CONTEXT
app.use(Vuetify);
app.use(VuetifyConfirm, {
  vuetify
});

app.use(VueResource);

Vue.config.productionTip = false;
app.use(VueLogger, {
    isEnabled: true,
    logLevel : Vue.config.productionTip  ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
}
);

app.use(Storage, {
    namespace: 'tailoringexpert__', // key prefix
    name: 'storage', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
});

app.storage.set('tenant', getEnv('VUE_APP_TENANT'));
app.http.interceptors.push(function(request) {
    request.headers.set('X-Tenant', Vue.storage.get('tenant'));
});

store.commit("selectionVectorParameterTranslations", i18n.t("tenants")[Vue.storage.get('tenant')]['selectionvector']);

var origin = window.location.origin + "/api";
app.http.get(origin).then(
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

