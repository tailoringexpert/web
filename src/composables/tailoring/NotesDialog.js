import { reactive, toRef, toValue, readonly } from 'vue';
import axios from 'axios';

export function useNotesDialog() {
    const state = reactive({
        tailoring: null,
        notes: []
    });

    const mutations = {
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring)),
        notes: (notes) => (state.notes = toRef(notes))
    };

    const actions = {
        initialize: () => {
            var url = toValue(state.tailoring)._links.note.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
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
            var url = toValue(state.tailoring)._links.note.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .post(url, toValue(text), {
                        headers: { 'Content-Type': 'text/plain' }
                    })

                    .then(() => {
                        actions.initialize().then(() => {
                            resolve(state.notes);
                        });
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
