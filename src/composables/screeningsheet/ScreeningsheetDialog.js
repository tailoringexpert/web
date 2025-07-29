import { reactive, readonly, toValue, toRef } from 'vue';
import api from '@/plugins/api';
import { useI18n } from 'vue-i18n';
import { useHttp } from '@/composables/http';

export function useScreeningsheetDialog() {
    const { download } = useHttp();
    const { t } = useI18n();

    const state = reactive({
        screeningsheet: null,
        selectionvectorParameter: []
    });

    const mutations = {
        screeningsheet: (screeningsheet) => (state.screeningsheet = toRef(screeningsheet)),
        selectionvectorParameter: (selectionvectorParameter) => (state.selectionvectorParameter = toRef(selectionvectorParameter))
    };

    const actions = {
        initialize: () => {
            const url = toValue(state.screeningsheet)._links.screeningsheet.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        mutations.screeningsheet(response.data);
                        const selectionvectorParameter = [];
                        for (const name in response.data.selectionVector.levels) {
                            selectionvectorParameter.push({
                                label: t('tenant.selectionvector.' + name),
                                name: name,
                                value: response.data.selectionVector.levels[name]
                            });
                        }
                        selectionvectorParameter.sort((a, b) => (a.label > b.label ? 1 : -1));
                        mutations.selectionvectorParameter(selectionvectorParameter);
                        resolve(state.selectionvectorParameter);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        download: () => {
            const url = toValue(state.screeningsheet)._links.file.href;
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
