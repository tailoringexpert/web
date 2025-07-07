import { createI18n } from 'vue-i18n';

import api from '@/plugins/api';
import store from '@/plugins/store';

// fallback
const tenantDefaults = {
    tenant: {
        Login: {
            title: 'Welcome to TailoringeXpert',
            subTitle: 'Sign in to continue',
            username: 'Username',
            password: 'Password',
            login: 'Sign In'
        },
        selectionvector: {
            A: 'Product assurance',
            Q: 'Quality assurance',
            M: 'Maintainability',
            E: 'EEE Components',
            P: 'PMMP',
            R: 'Reliability',
            S: 'Safety',
            W: 'Software',
            C: 'Cyber- and Datasecurity',
            J: 'Space Debris',
            F: 'Planetary Protection',
            B: 'Ground Segment',
            G: 'Engineering',
            N: 'Management'
        }
    }
};

const get = (locales) => {
    var tenant = window?.configs?.APP_TENANT || APP_TENANT;
    console.log('loading translations for ' + tenant);

    const messages = {};
    for (const locale in locales) {
        locales[locale]().then((current) => {
            const file = locale.split('/').slice(-1)[0];

            const matched = file.match(/([A-Za-z0-9-_]+)\./i);
            if (matched && matched.length > 1) {
                const key = file.split('.')[0];
                let bundle = {};
                api.get(window.location.origin + '/static/' + tenant + '/i18n/' + file)
                    .then((response) => {
                        Object.assign(bundle, current, response.data);
                        messages[key] = bundle;
                    })
                    .catch((error) => {
                        Object.assign(bundle, current, tenantDefaults);
                        messages[key] = bundle;
                    });
            }
        });
    }
    return messages;
};

const systemLocales = import.meta.glob('@/locales/*.json');
const instance = createI18n({
    locale: 'en',
    legacy: false,
    allowComposition: true,
    fallbackLocale: 'en',
    globalInjection: true,
    messages: get(systemLocales)
});

export default instance;
