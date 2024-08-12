import { reactive, readonly, toRef, toValue } from "vue";
import axios from "axios";

import store from "@/store";

export function useTailoringCatalog() {
    var number2Chapter = {};

    const createRequirementText = (text) => {
        var url = toValue(state.requirement)._links.self.href;
        if (url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            return axios
                .post(url, text, {
                    emulateJSON: true,
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
        var url = toValue(state.requirement)._links.text.href;
        if (url == null) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            axios
                .put(url, text, {
                    headers: { "Content-Type": "text/plain" },
                })
                .then((response) => {
                    var _requirement = getters
                        .requirements()
                        .find(
                            (requirement) =>
                                requirement.position ===
                                toValue(state.requirement).position
                        );
                    _requirement.text = response.data.text;
                    resolve(state.requirement);
                })
                .catch((error) => {
                    reject(error.data);
                });
        });
    };

    const loadRequirements = () => {
        var url = toValue(state.chapter)._links.self.href;
        if (url == null) {
            return Promise.resolve();
        }

        axios
            .get(url)
            .then((response) => {
                mutations.setChapterRequirements(toValue(state.chapter).id, response.data.requirements);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addChapterMapping = (chapter) => {
        number2Chapter[chapter.id] = chapter.name;
        mutations.setChapterRequirements(chapter.id, chapter.requirements);

        chapter.nodes.forEach((subchapter) => addChapterMapping(subchapter));
    };

    const state = reactive({
        catalog: {
            toc: {
                nodes: [],
                chapters: [],
            },
        },
        chapter: null,
        chapter2Requirements: {},
        requirement: null,
    });

    const getters = {
        requirements: () =>
            toValue(state.chapter) != null
                ? state.chapter2Requirements[toValue(state.chapter).id]
                : [],
        name: (number) => number2Chapter[number],
    };

    const mutations = {
        catalog: (catalog) => (state.catalog = toRef(catalog)),
        chapter: (chapter) => (state.chapter = toRef(chapter)),
        requirement: (requirement) => (state.requirement = toRef(requirement)),

        setChapterRequirements: (id, requirements) =>
            (state.chapter2Requirements[id] = toRef(requirements)),
        updateChapterRequirements: (requirements) => {
            state.chapter2Requirements[state.chapter.id] = requirements;
        },
    };

    const actions = {
        initialize: () => {
            var url = toValue(store.state.tailoring)._links.catalog.href;
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
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        save: (text) => {
            if (toValue(state.requirement).hasOwnProperty("position")) {
                return updateRequirementText(text);
            } else {
                return createRequirementText(text);
            }
        },
        state: () => {
            var url = toValue(state.requirement)._links.selected.href;
            if (url == null) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                return axios
                    .put(url)
                    .then((response) => {
                        var _requirement = getters
                            .requirements()
                            .find(
                                (requirement) =>
                                    requirement.position ===
                                    toValue(state.requirement).position
                            );
                        _requirement.selected = response.data.selected;
                        _requirement._links = response.data._links;
                        mutations.requirement(_requirement);
                        resolve(state.requirement);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
        states: (selected) => {
            var url = toValue(state.chapter)._links.selection.href;
            if (url == null) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                return axios
                    .put(url.replace("{selected}", toValue(selected)))
                    .then((response) => {
                        mutations.setChapterRequirements(toValue(state.chapter).id, response.data.requirements);
                        resolve(getters.requirements);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error.data);
                    });
            });
        },
    };

    //export function useTailoringCatalog() {
    return {
        state, //: readonly(state) => tree not working!,
        getters,
        mutations,
        actions,
    };
}
