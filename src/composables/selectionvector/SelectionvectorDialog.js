import { reactive, toValue, readonly, toRef } from "vue";

import axios from "axios";
import i18n from "@/plugins/i18n";

export function useSelectionvectorDialog() {
    const state = reactive({
        tailoring: null,
        levels: [],
    });

    const mutations = {
        tailoring: (tailoring) => {
            state.tailoring = toRef(tailoring);
        },
        levels: (levels) => {
            state.levels = toRef(levels);
        },
    };

    const actions = {
        initialize: () => {
            var url = toValue(state.tailoring)._links.selectionvector.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .get(url)
                    .then((response) => {
                        var items = [];
                        for (var name in response.data.levels) {
                            items.push({
                                label: i18n.global.t(
                                    "tenant.selectionvector." + name
                                ),
                                name: name,
                                value: response.data.levels[name],
                            });
                        }
                        items.sort((a, b) => (a.label > b.label ? 1 : -1));

                        mutations.levels(items);
                        resolve(items);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
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
