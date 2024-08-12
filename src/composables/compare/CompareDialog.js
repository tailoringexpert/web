import { reactive, readonly, toRef, toValue } from "vue";

import { useHttp } from "@/composables/http";

export function useCompareDialog() {
    const { download } = useHttp();

    const state = reactive({
        tailoring: null,
    });

    const mutations = {
        tailoring: (tailoring) => {
            state.tailoring = toRef(tailoring);
        },
    };

    const actions = {
        initialize: () => {
            var url = toValue(state.tailoring)._links.compare.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url);
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions,
    };
}
