import { createApp } from "vue";
import VueLogger from "vuejs3-logger";
import axios from "axios";
import Vue3Sanitize from "vue-3-sanitize";
import { Vuetify3Dialog } from "vuetify3-dialog";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import i18n from "@/plugins/i18n";
import vuetify from "@/plugins/vuetify";
import { useEnv } from "@/composables/env";

const app = createApp(App);

// logger
app.use(VueLogger, {
    isEnabled: true,
    logLevel: process.env.NODE_ENV === "production" ? "error" : "debug",
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: false,
    separator: "|",
    showConsoleColors: true,
});
app.provide("logger", app.config.globalProperties.$log);

// i8n
app.use(i18n);

// sanitite
app.use(Vue3Sanitize);

// vuetify
app.use(vuetify);
app.use(Vuetify3Dialog, {
    vuetify: vuetify,
    defaults: {
        //You can pass default options for dialogs, dialog's card, snackbars or bottom-sheets here
    },
});

// router
app.use(router);

// store
app.config.globalProperties.$log.debug(
    "Setting tenant " + useEnv().get("VUE_APP_TENANT")
);
app.provide("store", store);
store.mutations.tenant(useEnv().get("VUE_APP_TENANT"));

// axios
axios.defaults.headers.common["X-TENANT"] = store.state.tenant;
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";
app.config.globalProperties.$axios = axios.create({});

var origin = window.location.origin + "/api";
axios.get(origin).then((response) => {
    store.mutations.links(response.data._links);
    axios.get(response.data._links["selectionvector"].href).then((response) => {
        store.mutations.selectionvectors(
            response.data._embedded.selectionVectorProfiles
        );
        app.mount("#app");
    });
});
