import { reactive, readonly, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';

export function useExcel2JSONConverterDialog() {
    const { provide } = useHttp();

    const state = reactive({});

    const mutations = {};

    const actions = {
        convert: (data) => {
            const url = toValue(store.state).links.catalogconversion.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .post(url, data, {
                        responseType: 'arraybuffer',
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    .then((response) => {
                        provide(response);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.response.data);
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
