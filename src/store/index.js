import { reactive, readonly } from "vue";

const state = reactive({
    tenant: null,
    links: [],
    catalogs: [],
    breadcrumbs: [],
    selectionvectors: [],
    project: null,
    tailoring: null,
});

const mutations = {
    tenant: (tenant) => {
        state.tenant = tenant;
        localStorage.setItem("tenant", tenant);
    },
    links: (links) => {
        state.links = links;
    },
    catalogs: (catalogs) => (state.catalogs = catalogs),
    breadcrumbs: (breadcrumbs) => (state.breadcrumbs = breadcrumbs),
    selectionvectors: (selectionvectors) =>
        (state.selectionvectors = selectionvectors),
    project: (project) => (state.project = project),
    tailoring: (tailoring) => (state.tailoring = tailoring),
};

const actions = {};
export default {
    state: readonly(state),
    mutations,
    actions,
};
