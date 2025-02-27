import { reactive, readonly, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSelectionvectorComparison() {
    const { t } = useI18n();

    const state = reactive({
        calculatedSelectionvector: { levels: {} },
        editedSelectionvector: { levels: {} },
        comparedSelectionvectors: []
    });

    const mutations = {
        calculatedSelectionvector: (calculatedSelectionvector) => {
            state.calculatedSelectionvector = toRef(calculatedSelectionvector);
        },
        editedSelectionvector: (editedSelectionvector) => {
            if (editedSelectionvector) {
                state.editedSelectionvector = toRef(editedSelectionvector);
            }
        },
        comparedSelectionvectors: (comparedSelectionvectors) => {
            state.comparedSelectionvectors = toRef(comparedSelectionvectors);
        }
    };

    const actions = {
        initialize: () => {
            let items = [];
            for (let name in state.calculatedSelectionvector.levels) {
                items.push({
                    name: name,
                    label: t('tenant.selectionvector.' + name),
                    calculated: state.calculatedSelectionvector.levels[name],
                    modified: state.editedSelectionvector.levels[name]
                });
            }
            items.sort((a, b) => (a.label > b.label ? 1 : -1));
            mutations.comparedSelectionvectors(items);
        }
    };
    return {
        state: readonly(state),
        mutations,
        actions
    };
}
