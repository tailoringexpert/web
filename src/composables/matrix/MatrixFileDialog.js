import { reactive, toValue, readonly } from 'vue';
import api from '@/plugins/api';
import store from '@/plugins/store';

export function useMatrixFileDialog() {

    const state = reactive({
        catalogues: []
    });

    const mutations = {
        catalogues: (catalogues) => state.catalogues = catalogues
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
                        const catalogues = [];

                        for (const item of response.data._embedded.baseCatalogVersions) {
                            catalogues.push(
                                item.version
                            );
                        }
                        mutations.catalogues(catalogues);
                        resolve(state.catalogues);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        save: (file) => {
            const url = toValue(store.state).links.matrix.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .post(url, toValue(file), {
                        emulateJSON: true,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        }
                    })
                    .then((response) => {
                        console.log(response);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
