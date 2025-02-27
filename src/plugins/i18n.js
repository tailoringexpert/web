import { createI18n } from 'vue-i18n';
import axios from 'axios';

import store from '@/store';

// fallback
const selectionvector = {
    tenant: {
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

const i18n = createI18n({
    locale: 'en',
    legacy: false,
    allowComposition: true,
    fallbackLocale: 'en',
    globalInjection: true,
    messages: loadLocaleMessages()
});

function loadLocaleMessages() {
    var tenant =  window?.configs?.PAGE_APP_TENANT || APP_TENANT;
    console.log('loading translations for ' + tenant);



    const locales = import.meta.glob('/public/locales/*.json');
    const messages = {};
    for (const locale in locales) {
        locales[locale]().then((current) => {
            const file = locale.split('/').slice(-1)[0];

            const matched = file.match(/([A-Za-z0-9-_]+)\./i);
            if (matched && matched.length > 1) {
                const key = file.split('.')[0];
                let bundle = {};

                axios
                    .get(window.location.origin + '/i18n/' + tenant + '/' + file)
                    .then((response) => {
                        Object.assign(bundle, current, response.data);
                        messages[key] = bundle;
                    })
                    .catch((error) => {
                        Object.assign(bundle, selectionvector);
                        messages[key] = bundle;
                    });
            }
        });
    }
    return messages;
}

export default i18n;
