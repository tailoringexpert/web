import { reactive, toRef, toValue, readonly } from 'vue';
import api from '@/plugins/api';

export function useNotesDialog() {
    const state = reactive({
        tailoring: null,
        notes: []
    });

    const mutations = {
        tailoring: (tailoring) => state.tailoring = toRef(tailoring),
        notes: (notes) => state.notes = toRef(notes)
    };

    const actions = {
        initialize: () => {
            const url = toValue(state.tailoring)._links.note.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                    .get(url)
                    .then((response) => {
                        if (response.data.hasOwnProperty('_embedded')) {
                            mutations.notes(response.data._embedded.notes);
                        }
                        resolve(state.notes);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        create: (text) => {
            const url = toValue(state.tailoring)._links.note.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return api
                   .post(url, { "note" : toValue(text) }, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })

                    .then(() => {
                        actions.initialize()
                            .then(() => resolve(state.notes));
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
