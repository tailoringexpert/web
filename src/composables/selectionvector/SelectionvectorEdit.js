import api from '@/plugins/api';
import store from '@/plugins/store';
import { reactive, readonly, toRef, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSelectionvectorEdit() {

    api
        .get(store.state.links['selectionvector'].href)
        .then((response) => {
            state.profiles = response.data._embedded.selectionVectorProfiles;
        });

    api
        .get(store.state.links['matrix'].href)
        .then((response) => {
            state.matrices = response.data._embedded.matrices;

            const _matrices = [];
            for (const item of response.data._embedded.matrices) {
                const links = item._links;

                _matrices.push({
                    name: item.name,
                    file: links.self.href
                });
            }
            mutations.matrices(_matrices);
        });


    const { t } = useI18n();

    const state = reactive({
        profiles: [],
        selectionvector: null,
        levels: [],
        matrices: []
    });

    const mutations = {
        selectionvector: (selectionvector) => (state.selectionvector = toRef(selectionvector)),
        levels: (levels) => (state.levels = toRef(levels)),
        matrices: (matrices) => (state.matrices = toRef(matrices))
    };

    const actions = {
        initialize: () => {
            return new Promise((resolve, reject) => {
                const data = { levels: {} };
                const items = [];
                for (const name in toValue(state.selectionvector).levels) {
                    const item = {
                        label: t('tenant.selectionvector.' + name),
                        name: name,
                        value: toValue(state.selectionvector).levels[name]
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
                const data = { levels: {} };
                state.levels.forEach((item, index) => {
                    if (item.name == level.name) {
                        item.value = Number(level.value);
                    }
                    data.levels[item.name] = item.value;
                });
                resolve(data);
            });
        },
        loadMatrix: (matrix) => {
            const url = toValue(matrix.file);
            if (url == null) {
                return Promise.resolve(null);
            }

            return new Promise((resolve, reject) => {
            return api
                .get(url, { responseType: 'arraybuffer' })
                .then((response) => {
                    const bytes = new Uint8Array(response.data);
                    resolve(bytes.toBase64());
                })
                .catch((error) => {
                    reject(new Error(error.data));
                });
        });
        }
    }
    return {
        state: readonly(state),
            mutations,
            actions
    };
}
