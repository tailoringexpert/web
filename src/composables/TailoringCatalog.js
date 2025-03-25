import { reactive, readonly, toRef, toValue } from 'vue';
import axios from 'axios';

import store from '@/store';

export function useTailoringCatalog() {
    let number2Chapter = {};

    const createRequirementText = (text) => {
        const url = toValue(state.requirement)._links.self.href;
        if (url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            return axios
                .post(url, { "text" : toValue(text) }, {
                    headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then((response) => {
                    mutations.requirement(response.data);
                    loadRequirements();
                    resolve(state.requirement);
                })
                .catch((error) => {
                    reject(error.data);
                });
        });
    };

    const updateRequirementText = (text) => {
        const url = toValue(state.requirement)._links.text.href;
        if (url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            axios
                .put(url, { "text": text }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .then((response) => {
                    const _requirement = getters.requirements().find((requirement) => requirement.position === toValue(state.requirement).position);
                    _requirement.text = response.data.text;
                    resolve(state.requirement);
                })
                .catch((error) => {
                    reject(error.data);
                });
        });
    };

    const loadRequirements = () => {
        const url = toValue(state.chapter)._links.self.href;
        if (url == null) {
            return Promise.resolve();
        }

        axios
            .get(url)
            .then((response) => {
                mutations.setChapterRequirements(toValue(state.chapter).key, response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addChapterMapping = (chapter) => {
        number2Chapter[chapter.key] = chapter.name;
        mutations.setChapterRequirements(chapter.key, chapter.data);

        chapter.children.forEach((subchapter) => addChapterMapping(subchapter));
    };

    const state = reactive({
        catalog: {
            toc: {
                nodes: [],
                chapters: []
            }
        },
        chapter: null,
        chapter2Requirements: {},
        requirement: null,
        breadcrumbs: []
    });

    const getters = {
        requirements: () => toValue(state.chapter) != null ? state.chapter2Requirements[toValue(state.chapter).key] : [],
        name: (number) => number2Chapter[number]
    };

    const mutations = {
        catalog: (catalog) => state.catalog = toRef(catalog),
        chapter: (chapter) => {
            state.chapter = toRef(chapter);

            if (!Object.hasOwn(state.chapter2Requirements, state.chapter.key) || !state.chapter2Requirements[chapter.key]) {
                loadRequirements();
            }

            state.breadcrumbs = [];
            [...state.chapter.key.matchAll(/\./g)].map((match) => {
                const number = chapter.key.substring(0, match.index);
                state.breadcrumbs.push({
                    label: number + ' ' + getters.name(number),
                    disabled: true
                });
            });

            state.breadcrumbs.push({
                label: chapter.key + ' ' + chapter.name,
                disabled: true
            });
        },
        requirement: (requirement) => state.requirement = toRef(requirement),
        setChapterRequirements: (key, requirements) => state.chapter2Requirements[key] = toRef(requirements),
        updateChapterRequirements: (requirements) => state.chapter2Requirements[state.chapter.key] = requirements
    };

    const actions = {
        initialize: () => {
            const url = toValue(store.state.tailoring)._links.catalog.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .get(url)
                    .then((response) => {
                        mutations.catalog({ toc: response.data.toc });
                        addChapterMapping(response.data.toc);
                        resolve(state.catalog);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        save: (text) => {
            if (toValue(state.requirement).hasOwnProperty('position')) {
                return updateRequirementText(toValue(text));
            } else {
                return createRequirementText(toValue(text));
            }
        },
        state: () => {
            const url = toValue(state.requirement)._links.selected.href;
            if (url == null) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                return axios
                    .put(url)
                    .then((response) => {
                        const _requirement = getters.requirements().find((requirement) => requirement.position === toValue(state.requirement).position);
                        _requirement.selected = response.data.selected;
                        _requirement._links = response.data._links;
                        mutations.requirement(_requirement);
                        resolve(state.requirement);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        states: (selected) => {
            const url = toValue(state.chapter)._links.selection.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .put(url.replace('{selected}', toValue(selected)))
                    .then((response) => {
                        addChapterMapping(response.data);
                        resolve(getters.requirements);
                    })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        }
    };

    return {
        state: readonly(state),
        getters,
        mutations,
        actions
    };
}
