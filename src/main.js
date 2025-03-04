import { createApp } from 'vue';
import axios from 'axios';
import { createI18n } from 'vue-i18n';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import VueLogger from 'vuejs3-logger';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { useLocales } from '@/composables/locales'

const app = createApp(App);

// logger
app.use(VueLogger, {
    isEnabled: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: false,
    separator: '|',
    showConsoleColors: true
});
app.provide('logger', app.config.globalProperties.$log);

// store
app.provide('store', store);
store.mutations.tenant(window?.configs?.PAGE_APP_TENANT || APP_TENANT);

// i18n
const { get } = useLocales()
const systemLocales = import.meta.glob('./locales/*.json');
const i18n = createI18n({
    locale: 'en',
    legacy: false,
    allowComposition: true,
    fallbackLocale: 'en',
    globalInjection: true,
    messages: get(systemLocales)
});
app.use(i18n);

// router
app.use(router);

// axios
app.config.globalProperties.$axios = axios.create({});
axios.defaults.headers.common['X-TENANT'] = store.state.tenant;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
axios.interceptors.request.use(
    (config) => {
        store.mutations.loading(true);
        return config;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error)
    }
);
axios.interceptors.response.use(
    (response) => {
        setTimeout((response) => {
            store.mutations.loading(false);
        }, 10);
        return response;
    },
    (error) => {
        setTimeout((error) => {
            store.mutations.loading(false);
        }, 10);
        return Promise.reject(error);
    }
);

// primevue
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// initialize
const origin = window.location.origin + '/api';
axios.get(origin).then((response) => {
    store.mutations.links(response.data._links);
    axios.get(response.data._links['selectionvector'].href).then((response) => {
        store.mutations.selectionvectors(response.data._embedded.selectionVectorProfiles);
        app.mount('#app');
    });
});


