import { reactive, readonly, toValue, toRef } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';
import { useFile } from '@/composables/file';

export function useCompareDialog() {
    const { download, provide } = useHttp();
    const { readAsString } = useFile();

    const state = reactive({
        catalogs: [],
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
        compareReleased: (base, revised) => {
            const url = toValue(store.state).links.catalogcompare.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url.replace('{base}', toValue(base)).replace("{revised}", toValue(revised)));
        },
        comparePreview: (base, revised) => {
            const url = toValue(store.state).links.catalogcomparepreview.href;
            console.log(url.replace('{base}', toValue(base)))
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                readAsString(toValue(revised)).then((response) => {
                    return api
                        .post(url.replace('{base}', toValue(base)), response, {
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            responseType: 'arraybuffer'
                        })
                        .then((response) => {
                            provide(response);
                            resolve(response.data);
                        })
                        .catch((error) => {
                            reject(error.data);
                        });
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
