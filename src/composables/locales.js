import axios from 'axios';

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

export function useLocales() {
    const get = (files) => {
        const tenant =  window?.configs?.PAGE_APP_TENANT || APP_TENANT;
        console.log('loading translations for ' + tenant);

        const messages = {};
        for (const locale in files) {
            files[locale]().then((current) => {
                const file = locale.split('/').slice(-1)[0];

                const matched = file.match(/([A-Za-z0-9-_]+)\./i);
                if (matched && matched.length > 1) {
                    const key = file.split('.')[0];
                    let bundle = {};
                    axios
                        .get(window.location.origin + '/static/' + tenant + '/i18n/' + file)
                        .then((response) => {
                            Object.assign(bundle, current, response.data);
                            messages[key] = bundle;
                        })
                        .catch((error) => {
                            Object.assign(bundle, current, selectionvector);
                            messages[key] = bundle;
                        });
                }
            });
        }
        return messages;
    }

    return {
        get
    };
}
