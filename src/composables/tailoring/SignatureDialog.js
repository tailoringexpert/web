import { reactive, readonly, toValue, toRef } from 'vue';
import axios from 'axios';

export function useSignatureDialog() {
    const state = reactive({
        signature: {}
    });

    const mutations = {
        signature: (signature) => {
            state.signature = toRef(signature);
        }
    };

    const actions = {
        save: () => {
            let url = toValue(state.signature)._links.self.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .put(url, toValue(state.signature), {
                        emulateJSON: true,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        }
                    })
                    .then((response) => {
                        mutations.signature(response.data);
                        resolve(state.signature);
                    })
                    .catch((error) => {
                        console.log(error);
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
