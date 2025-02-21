import { reactive, ref, toRef, toValue, readonly } from "vue";
import axios from "axios";

import store from "@/store";

export function useProjects() {
    const state = reactive({
        projects: [],
        state: ref("ONGOING"),
        states: ref(["", "ONGOING", "COMPLETED"]),
    });

    const mutations = {
        projects: (projects) => (state.projects = toRef(projects)),
        state: (state) => (state.state = toRef(state)),
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                var _projects = [];
                return axios
                    .get(toValue(store.state).links.project.href)
                    .then((response) => {
                        if (response.data._embedded != undefined) {
                            for (
                                var i = 0;
                                i < response.data._embedded.projects.length;
                                i++
                            ) {
                                var item = response.data._embedded.projects[i];
                                var links =
                                    response.data._embedded.projects[i]._links;
                                _projects.push(
                                    reactive({
                                        name: item.name,
                                        creationTimestamp:
                                            item.creationTimestamp,
                                        state: item.state,
                                        _links: links,
                                    })
                                );
                            }
                        }

                        mutations.projects(_projects);
                        resolve(_projects);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject(error.response);
                    });
            });
        },

        updateState: (project) => {
            return new Promise((resolve, reject) => {
                return axios
                    .put(project._links.state.href)
                    .then((response) => {
                        var index = state.projects.indexOf(project);
                        state.projects.splice(index, 1, response.data);
                        resolve(resonse.data);
                    })
                    .catch((error) => {
                        reject(error.response);
                    });
            });
        },

        delete: (project) => {
            return new Promise((resolve, reject) => {
                console.log(project);
                return axios
                    .delete(toValue(project)._links.self.href)
                    .then(() => {
                        actions.initialize();
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.response);
                    });
            });
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions,
    };
}
