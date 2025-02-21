import { reactive, readonly, toValue, toRef } from "vue";
import axios from "axios";

import i18n from "@/plugins/i18n";
import { useHttp } from "@/composables/http";

export function useScreeningsheetDialog() {
    const { download } = useHttp();

    const state = reactive({
        screeningsheet: null,
        selectionvectorParameter: [],
    });

    const mutations = {
        screeningsheet: (screeningsheet) => {
            state.screeningsheet = toRef(screeningsheet);
        },
        selectionvectorParameter: (selectionvectorParameter) => {
            state.selectionvectorParameter = toRef(selectionvectorParameter);
        },
    };

    const actions = {
        initialize: () => {
            var url = toValue(state.screeningsheet)._links.screeningsheet.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .get(url)
                    .then((response) => {
                        mutations.screeningsheet(response.data);
                        var selectionvectorParameter = [];
                        for (var name in response.data.selectionVector.levels) {
                            selectionvectorParameter.push({
                                label: i18n.global.t(
                                    "tenant.selectionvector." + name
                                ),
                                name: name,
                                value: response.data.selectionVector.levels[
                                    name
                                ],
                            });
                        }
                        selectionvectorParameter.sort((a, b) =>
                            a.label > b.label ? 1 : -1
                        );
                        mutations.selectionvectorParameter(
                            selectionvectorParameter
                        );
                        resolve(state.selectionvectorParameter);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        download: () => {
            var url = toValue(state.screeningsheet)._links.datei.href;
            if (url == null) {
                return Promise.resolve();
            }
            return download(url);
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions,
    };
}
