import { reactive, ref, toRef, toValue, readonly } from 'vue';
import api from '@/plugins/api';

import store from '@/plugins/store';

export function useProjects() {
    const state = reactive({
        projects: [],
        state: ref('ONGOING'),
        states: ref(['', 'ONGOING', 'COMPLETED'])
    });

    const mutations = {
        projects: (projects) => (state.projects = toRef(projects)),
        state: (state) => (state.state = toRef(state))
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                const _projects = [];
                return api
                    .get(toValue(store.state).links.projects.href)
                    .then((response) => {
                        if (response.data._embedded != undefined) {
                            for (const item of response.data._embedded.projects) {
                                const links = item._links;
                                _projects.push(
                                    reactive({
                                        name: item.name,
                                        creationTimestamp: item.creationTimestamp,
                                        state: item.state,
                                        _links: links
                                    })
                                );
                            }
                        }

                        mutations.projects(_projects);
                        resolve(_projects);
                    })
                    .catch((error) => {
                        reject(error.response);
                    });
            });
        },

        updateState: (project) => {
            return new Promise((resolve, reject) => {
                return api
                    .put(project._links.state.href)
                    .then((response) => {
                        let index = state.projects.indexOf(project);
                        state.projects.splice(index, 1, response.data);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.response);
                    });
            });
        },

        delete: (project) => {
            return new Promise((resolve, reject) => {
                return api
                    .delete(toValue(project)._links.self.href)
                    .then(() => {
                        actions.initialize();
                        resolve({});
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
