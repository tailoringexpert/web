import { reactive, readonly, toValue, toRef } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';

export function useCompareDialog() {
    const { download } = useHttp();

    const state = reactive({
        catalogs: [],
        base: null,
        revised: null
    });

    const mutations = {
        catalogs: (catalogs) => state.catalogs = toRef(catalogs),
        base: (base) => state.base = toRef(base),
        revised: (revised) => state.base = toRef(revised)
    };

    const actions = {
        initialize: () => {
            const url = toValue(store.state).links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                api
                    .get(url)
                    .then((response) => {
                        const _catalogs = [];

                        for (const item of response.data._embedded.baseCatalogVersions) {
                            _catalogs.push(
                                item.version
                            );
                        }
                        mutations.catalogs(_catalogs);
                        resolve(_catalogs);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        compare: (base, revised) => {
            const url = toValue(store.state).links.catalogdiff.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url.replace('{base}', toValue(base)).replace("{revised}", toValue(revised)));
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
