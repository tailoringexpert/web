import { reactive, toValue, readonly, toRef } from 'vue';
import api from '@/plugins/api';
import { useI18n } from 'vue-i18n';

export function useSelectionvectorDialog() {
    const { t } = useI18n();

    const state = reactive({
        tailoring: null,
        levels: []
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring)),
        levels: (levels) => (state.levels = toRef(levels))
    };

    const actions = {
        initialize: () => {
            const url = toValue(state.tailoring)._links.selectionvector.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        const items = [];
                        for (const name in response.data.levels) {
                            items.push({
                                label: t('tenant.selectionvector.' + name),
                                name: name,
                                value: response.data.levels[name]
                            });
                        }
                        items.sort((a, b) => (a.label > b.label ? 1 : -1));

                        mutations.levels(items);
                        resolve(items);
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
