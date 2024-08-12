import { reactive, readonly, toValue } from "vue";
import axios from "axios";

import store from "@/store";
import { useHttp } from "@/composables/http";

export function useExcel2JSONConverter() {
    const { provide } = useHttp();

    const state = reactive({});

    const mutations = {};

    const actions = {
        convert: (data) => {
            var url = toValue(store.state).links.catalogconversion.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .post(url, data, {
                        responseType: "arraybuffer",
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((response) => {
                        provide(response);
                        resolve(response.data);
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
