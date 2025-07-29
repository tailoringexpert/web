import { toValue } from 'vue';
import api from '@/plugins/api';
import store from '@/plugins/store';

export function useMasterdata() {
    const loadMasterdata = () => {
        api.get(store.state.links['selectionvector'].href).then((response) => {
            store.mutations.selectionvectors(response.data._embedded.selectionVectorProfiles);
        });
    };

    return {
        loadMasterdata
    };
}
