import api from '@/plugins/api';
import { reactive, readonly, toRef, toValue } from 'vue';

export function useIssueDialog() {
    const state = reactive({
        tailoring: null
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring))
    };

    const actions = {
        save: (issue) => {
            const url = toValue(state.tailoring)._links.issue.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .put(url.replace('{issue}', toValue(issue))
                    )
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
