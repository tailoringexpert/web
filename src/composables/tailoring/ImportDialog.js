import { reactive, toValue, readonly, toRef } from 'vue';
import axios from 'axios';

export function useImportDialog() {
    const state = reactive({
        tailoring: null
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring))
    };

    const actions = {
        importRequirements: (data) => {
            const url = toValue(state.tailoring)._links.import.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .post(url, toValue(data), {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })

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
