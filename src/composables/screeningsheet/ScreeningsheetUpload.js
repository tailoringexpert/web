import { reactive, readonly, toRef, toValue } from "vue";
import axios from "axios";

import store from "@/store";

export function useScreeningsheetUpload() {
    const state = reactive({
        screeningsheet: { parameters: [] },
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
        upload: (data) => {
            var url = toValue(store).state.links.screeningsheet.href;
            if (url == null) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                axios
                    .post(url, data, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((response) => {
                        mutations.screeningsheet(response.data);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                        throw error;
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
