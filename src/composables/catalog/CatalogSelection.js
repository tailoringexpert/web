import { reactive, readonly, toRef, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';

export function useCatalogSelection() {
    const state = reactive({
        catalogs: [],
        catalog: {
            version: null,
            project: null
        },
        note: null
    });

    const mutations = {
        catalogs: (catalogs) => state.catalogs = toRef(catalogs),
        catalog: (catalog) => state.catalog = toRef(catalog),
        note: (note) =>  state.note = toRef(note)
    };

    const actions = {
        initialize: () => {
            const url = toValue(store.state).links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                axios
                    .get(url)
                    .then((response) => {
                        const _catalogs = [];
                        for (const item of response.data._embedded.baseCatalogVersions) {
                            const links = item._links;

                            if (item.valid) {
                                mutations.catalog({
                                    version: item.version,
                                    project: links.project.href
                                });

                                _catalogs.push({
                                    version: item.version,
                                    project: links.project.href
                                });
                            }
                        }
                        mutations.catalogs(_catalogs);
                        resolve(_catalogs);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
