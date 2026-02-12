import { reactive, toValue, readonly, toRef } from 'vue';
import api from '@/plugins/api';

export function useImportDialog() {
    const state = reactive({
        tailoring: null
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring))
    };

    const actions = {
        importRequirements: (file) => {
            const url = toValue(state.tailoring)._links.import.href;
            if (url == null) {
                return Promise.resolve();
            }

            let data = new FormData();
            data.append('file', toValue(file));

            return new Promise((resolve, reject) => {
                return api
                    .post(url, data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })

                    .then(() => {
                        resolve('Accepted');
                    })
                    .catch((error) => {
                        reject(error.response.data);
                    });
            });
        },

        updateRequirements: () => {
            const url = toValue(state.tailoring)._links.requirementsphase.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .put(url)
                    .then(() => {
                        resolve('Accepted');
                    })
                    .catch((error) => {
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
