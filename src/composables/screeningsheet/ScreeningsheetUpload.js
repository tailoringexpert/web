import { reactive, readonly, toRef, toValue } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';

export function useScreeningsheetUpload() {
    const state = reactive({
        screeningsheet: { parameters: [] }
    });

    const mutations = {
        screeningsheet: (screeningsheet) => (state.screeningsheet = toRef(screeningsheet)),
        selectionvectorParameter: (selectionvectorParameter) => (state.selectionvectorParameter = toRef(selectionvectorParameter))
    };

    const actions = {
        upload: (file) => {
            const url = toValue(store).state.links.screeningsheet.href;
            if (url == null) {
                return Promise.resolve();
            }

            let data = new FormData();
            data.append('file', toValue(file));

            return new Promise((resolve, reject) => {
                axios
                    .post(url, data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    .then((response) => {
                        mutations.screeningsheet(response.data);
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
