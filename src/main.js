import { createApp } from 'vue';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import VueLogger from 'vuejs3-logger';

import App from '@/App.vue';
import router from '@/plugins/router';
import store from '@/plugins/store';
import api from '@/plugins/api';
import i18n from '@/plugins/i18n';

import '@/assets/styles/main.scss';
import '@/assets/styles/main.css';

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
store.mutations.tenant(window?.configs?.APP_TENANT || APP_TENANT);
store.mutations.authRequired(window?.configs?.AUTH_REQUIRED || AUTH_REQUIRED);
console.log(store.state.authRequired)

// i18n
app.use(i18n);

// router
app.use(router);

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
const origin = window.location.origin + '/api/';
api.get(origin).then((response) => {
    store.mutations.links(response.data._links);
    app.mount('#app');
});
