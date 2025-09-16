import { reactive, readonly } from 'vue';

const state = reactive({
    loading: false,
    help: false,
    links: [],
    breadcrumbs: [],
    toast: null,
    project: null,
    tailoring: null,

});

const getters = {
    authenticated: () => state.auth != null,
    accessToken: () => state.auth?.accessToken
};

const mutations = {
    loading: (loading) => state.loading = loading,
    help: (help) => state.help = help,
    links: (links) => state.links = links,
    breadcrumbs: (breadcrumbs) => state.breadcrumbs = breadcrumbs,
    toast: (toast) => state.toast = toast,
    project: (project) => state.project = project,
    tailoring: (tailoring) => state.tailoring = tailoring,
};

const actions = {};
export default {
    state: readonly(state),
    getters,
    mutations,
    actions
};
