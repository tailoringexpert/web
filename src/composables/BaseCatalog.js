import { reactive, readonly, toRef, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';

export function useBaseCatalog() {
    const { download } = useHttp();

    const state = reactive({
        catalogs: [],
        conversionLink: null
    });

    const mutations = {
        catalogs: (catalogs) => (state.catalogs = toRef(catalogs)),
        conversionLink: (conversionLink) => (state.conversionLink = toRef(conversionLink))
    };

    const actions = {
        initialize: () => {
            const url = toValue(store.state).links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        mutations.catalogs(response.data._embedded.baseCatalogVersions);
                        mutations.conversionLink(response.data._links.convert.href);
                        resolve(state.catalogs);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        pdf: (catalog) => download(toValue(catalog)._links.pdf.href),
        json: (catalog) => download(toValue(catalog)._links.json.href),
        excel: (catalog) => download(toValue(catalog)._links.excel.href),
        zip: (catalog) => download(toValue(catalog)._links.document.href)
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
