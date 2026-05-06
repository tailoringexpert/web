import api from '@/plugins/api';
import { reactive, readonly, toRef, toValue } from 'vue';

import store from '@/plugins/store';

export function useTailoringNew() {
    const state = reactive({
        catalog: null,
        note: null,
        project: null,
        screeningsheet: { levels: {} },
        selectionvector: null,
        matrix: null
    });

    const mutations = {
        catalog: (catalog) => (state.catalog = toRef(catalog)),
        note: (note) => (state.note = toRef(note)),
        project: (project) => (state.project = toRef(project)),
        screeningsheet: (screeningsheet) => (state.screeningsheet = toRef(screeningsheet)),
        selectionvector: (selectionvector) => (state.selectionvector = toRef(selectionvector)),
        matrix: (matrix) => (state.matrix = toRef(matrix))
    };

    const actions = {
        create: () => {
            const data = {
                catalog: toValue(state.catalog).version,
                note: toValue(state.note),
                screeningSheet: toValue(state.screeningsheet),
                selectionVector: toValue(state.selectionvector),
                matrix: toValue(state.matrix)
            };

            return new Promise((resolve, reject) => {
                return api
                    .post(toValue(store.state.project)._links.tailoring.href, data, {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    })
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.response);
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
