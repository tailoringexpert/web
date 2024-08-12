import { reactive, readonly, toRef, toValue } from "vue";
import axios from "axios";

import store from "@/store";

export function useCatalogSelection() {
    const state = reactive({
        catalogs: [],
        catalog: null,
        note: null,
    });

    const mutations = {
        catalogs: (catalogs) => {
            state.catalogs = toRef(catalogs);
        },
        catalog: (catalog) => {
            state.catalog = toRef(catalog);
        },
        note: (note) => {
            state.note = toRef(note);
        },
    };

    const actions = {
        initialize: () => {
            console.log(store.state);
            var url = toValue(store.state).links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                axios
                    .get(url)
                    .then((response) => {
                        var _catalogs = [];
                        for (
                            let i = 0;
                            i <
                            response.data._embedded.baseCatalogVersions.length;
                            i++
                        ) {
                            var item =
                                response.data._embedded.baseCatalogVersions[i];
                            var links = item._links;

                            if (item.valid) {
                                mutations.catalog({
                                    version: item.version,
                                    project: links.project.href,
                                });

                                _catalogs.push({
                                    version: item.version,
                                    project: links.project.href,
                                });
                            }
                        }
                        mutations.catalogs(_catalogs);
                        resolve(_catalogs);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject(error);
                    });
            });
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions,
    };
}
