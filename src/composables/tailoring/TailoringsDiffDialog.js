import { reactive, readonly, toRef, toValue } from 'vue';

import { useHttp } from '@/composables/http';
import api from '@/plugins/api';
import store from '@/plugins/store';

export function useTailoringsDiffDialog() {
    const { download } = useHttp();

    const state = reactive({
        projects: [],
        project: null,
        tailoring: null,
        cProject: null,
        cTailoring: null
    });

    const mutations = {
        project: (project) => (state.project = toRef(project)),
        tailoring: (tailoring) => (state.tailoring = toRef(tailoring)),
        selectedTailoring: (tailoring_) => {
            // selectionModel sieht so aus: { "PROJECT:TAILORING": true }
            const compoundKey = Object.keys(tailoring_)[0];
            const splitKey = compoundKey ? compoundKey.split(':') : null;

            state.cProject = splitKey ? splitKey[0] : null;
            state.cTailoring = splitKey ? splitKey[1] : null;
        }
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                const _projects = [];
                console.log('initial');
                console.log(toValue(state));
                return api
                    .get(toValue(store.state).links.projects.href)
                    .then((response) => {
                        if (response.data._embedded != undefined) {
                            for (const item of response.data._embedded.projects) {
                                const links = item._links;
                                const _tailorings = [];
                                for (const tailoring of item.tailorings) {
                                    // don't compare to self
                                    if (toValue(state.project) !== item.name || toValue(state.tailoring).name !== tailoring.name) {
                                        _tailorings.push(
                                            reactive({
                                                key: item.name + ':' + tailoring.name,
                                                label: tailoring.name
                                            })
                                        );
                                    }
                                }
                                _projects.push(
                                    reactive({
                                        key: item.name,
                                        label: item.name,
                                        _links: links,
                                        children: _tailorings
                                    })
                                );
                            }
                        }

                        console.log(_projects);
                        state.projects = _projects;
                        resolve(state.projects);
                    })
                    .catch((error) => {
                        reject(error.response);
                    });
            });
        },
        onDiff: () => {
            const url = toValue(state.tailoring)._links.tailoringdiff.href;
            if (url == null) {
                return Promise.resolve();
            }

            return download(url.replace('{cproject}', toValue(state.cProject)).replace('{ctailoring}', toValue(state.cTailoring)));
        }
    };

    return {
        state: readonly(state),
        mutations,
        actions
    };
}
