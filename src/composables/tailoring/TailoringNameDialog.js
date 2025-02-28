import { reactive, toValue, readonly, toRef } from 'vue';
import axios from 'axios';

export function useNameDialog() {
    const state = reactive({
        tailoring: null
    });

    const mutations = {
        tailoring: (tailoring) => state.tailoring = toRef(tailoring)
    };

    const actions = {
        save: (name) => {
            const url = toValue(state.tailoring)._links.name.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .put(url, name, {
                        headers: { 'Content-Type': 'text/plain' }
                    })
                    .then((response) => {
                        mutations.tailoring(response.data);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.data);
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
