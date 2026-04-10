import { reactive, readonly, toRef, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';
import { useHttp } from '@/composables/http';

export function useMatrix() {
    const { download } = useHttp();

    const state = reactive({
        matrices: [],
    });

    const mutations = {
        matrices: (matrices) => (state.matrices = toRef(matrices))
    };

    const actions = {
        initialize: () => {
            const url = toValue(store.state).links.matrix.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        mutations.matrices(response.data._embedded.matrices);
                        resolve(state.matrices);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },

        download: (matrix) => {
            const url = toValue(matrix)._links.self.href;

            if (url == null) {
                return Promise.resolve();
            }

            return download(url);
        },
        delete: (matrix) => {
            const url = toValue(matrix)._links.self.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .delete(url)
                    .then(() => {
                        state.matrices.splice(state.matrices.indexOf(matrix), 1);
                        resolve(state.matrices);
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
