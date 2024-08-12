import { createI18n } from "vue-i18n";
import axios from "axios";

import { useEnv } from "@/composables/env";

// fallback
const selectionvector = {
    tenant: {
        selectionvector: {
            A: "Product assurance",
            Q: "Quality assurance",
            M: "Maintainability",
            E: "EEE Components",
            P: "PMMP",
            R: "Reliability",
            S: "Safety",
            W: "Software",
            C: "Cyber- and Datasecurity",
            J: "Space Debris",
            F: "Planetary Protection",
            B: "Ground Segment",
            G: "Engineering",
            N: "Management",
        },
    },
};

const i18n = createI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "en",
    legacy: false,
    allowComposition: true,
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    globalInjection: true,
    messages: loadLocaleMessages(),
});

function loadLocaleMessages() {
    var tenant = useEnv().get("VUE_APP_TENANT");
    console.log("loading translations for " + tenant);
    const locales = require.context(
        "@/locales",
        true,
        /[A-Za-z0-9-_,\s]+\.json$/i
    );
    const messages = {};
    locales.keys().forEach((key) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            var bundle = locales(key);

            axios
                .get(window.location.origin + "/i18n/" + tenant + "/" + key)
                .then((response) => {
                    Object.assign(bundle, response.data);
                    messages[locale] = bundle;
                })
                .catch((error) => {
                    Object.assign(bundle, selectionvector);
                    messages[locale] = bundle;
                });
        }
    });
    return messages;
}

export default i18n;
