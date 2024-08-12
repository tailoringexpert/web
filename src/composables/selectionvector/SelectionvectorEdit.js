import { reactive, toValue, readonly, toRef } from "vue";

import i18n from "@/plugins/i18n";

import store from "@/store";

export function useSelectionvectorEdit() {
    const state = reactive({
        profiles: store.state.selectionvectors,
        selectionvector: null,
        levels: [],
    });

    const mutations = {
        selectionvector: (selectionvector) => {
            state.selectionvector = toRef(selectionvector);
        },
        levels: (levels) => {
            state.levels = toRef(levels);
        },
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                var data = { levels: {} };
                var items = [];
                for (var name in toValue(state.selectionvector).levels) {
                    var item = {
                        label: i18n.global.t("tenant.selectionvector." + name),
                        name: name,
                        value: toValue(state.selectionvector).levels[name],
                    };
                    items.push(item);
                    data.levels[item.name] = item.value;
                }

                items.sort((a, b) => (a.label > b.label ? 1 : -1));
                mutations.levels(items);
                resolve(items);
            });
        },
        update: (level) => {
            return new Promise((resolve, reject) => {
                var data = { levels: {} };
                state.levels.forEach((item, index) => {
                    if (item.name == level.name) {
                        item.value = Number(level.value);
                    }
                    data.levels[item.name] = item.value;
                });
                resolve(data);
            });
        },
    };

    return {
        state: readonly(state),
        mutations,
        actions,
    };
}
