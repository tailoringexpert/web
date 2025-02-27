import { reactive, readonly, toRef, toValue } from 'vue';
import axios from 'axios';

import store from '@/store';
import { useHttp } from '@/composables/http';

export function useBaseCatalog() {
    const { download } = useHttp();

    const state = reactive({
        catalogs: [],
        conversionLink: null
    });

    const mutations = {
        catalogs: (catalogs) => {
            state.catalogs = toRef(catalogs);
        },
        conversionLink: (conversionLink) => {
            state.conversionLink = toRef(conversionLink);
        }
    };

    const actions = {
        initialize: () => {
            var url = toValue(store.state).links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
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
        pdf: (catalog) => {
            var url = toValue(catalog)._links.pdf.href;
            return download(url);
        },
        json: (catalog) => {
            var url = toValue(catalog)._links.json.href;
            return download(url);
        },
        excel: (catalog) => {
            var url = toValue(catalog)._links.excel.href;
            return download(url);
        },
        zip: (catalog) => {
            var url = toValue(catalog)._links.document.href;
            return download(url);
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
