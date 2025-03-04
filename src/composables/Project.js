import { reactive, readonly, toRef, toValue } from 'vue';
import axios from 'axios';

import store from '@/store';
import { useHttp } from '@/composables/http';

export function useProject() {
    const { download } = useHttp();

    const state = reactive({
        url: null,
        project: {
            name: null,
            tailorings: [],
            _links: []
        },
        tailoring: null
    });

    const getters = {
        isEditable: (tailoring) => 'CREATED' == toValue(tailoring.state),
        isDeletable: (tailoring) => 'CREATED' == toValue(tailoring.state)
    };

    const mutations = {
        project: (project) => state.project = toRef(project),
        tailoring: (tailoring) => state.tailoring = toRef(tailoring)
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                return axios
                    .get(toValue(store.state).project._links.self.href)
                    .then((response) => {
                        mutations.project(response.data);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        updateState: (tailoring) => {
            return new Promise((resolve, reject) => {
                return axios
                    .put(toValue(tailoring)._links.state.href)
                    .then((response) => {
                        const index = state.project.tailorings.indexOf(tailoring);
                        state.project.tailorings.splice(index, 1, response.data);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        delete: (tailoring) => {
            return new Promise((resolve, reject) => {
                return axios
                    .delete(toValue(tailoring)._links.self.href)
                    .then((response) => {
                        state.project.tailorings.splice(state.project.tailorings.indexOf(tailoring), 1);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        getBaseCatalog: (tailoring) => download(toValue(tailoring)._links.basecatalog.href),
        getComparison: (tailoring) => download(toValue(tailoring)._links.compare.href)
    };

    return {
        state: readonly(state),
        getters,
        mutations,
        actions
    };
}
