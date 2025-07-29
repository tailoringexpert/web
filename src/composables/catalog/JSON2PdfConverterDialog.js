import { reactive, readonly, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';
import { useFile } from '@/composables/file';

export function useJSON2PdfConverterDialog() {
    const { provide } = useHttp();
    const { readAsString } = useFile();

    const state = reactive({});

    const mutations = {};

    const actions = {
        convert: (file) => {
            const url = toValue(store.state).links.catalogpreview.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                readAsString(toValue(file)).then((response) => {
                    return api
                        .post(url, response, {
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
