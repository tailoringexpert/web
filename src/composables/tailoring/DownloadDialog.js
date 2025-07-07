import { reactive, readonly, toValue, toRef } from 'vue';
import api from '@/plugins/api';

import { useHttp } from '@/composables/http';

export function useDownloadDialog() {
    const { download } = useHttp();

    const state = reactive({
        tailoring: null,
        signatures: []
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring)),
        signatures: (signatures) => (state.signatures = toRef(signatures))
    };

    const actions = {
        initialize: () => {
            const url = toValue(state.tailoring)._links.signature.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        mutations.signatures(response.data._embedded.signatures);
                        resolve(state.signatures);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        download: (_url) => {
            const url = toValue(_url);
            if (url == null) {
                return Promise.resolve();
            }
            return download(url);
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
