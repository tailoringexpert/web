import { reactive, readonly } from 'vue';

const state = reactive({
    authRequired: window?.configs?.[AUTH_REQUIRED] || AUTH_REQUIRED,
    auth: null,
    tenant: window?.configs?.[APP_TENANT] || APP_TENANT,
    loading: false,
    help: false,
    links: [],
    catalogs: [],
    breadcrumbs: [],
    toast: null,
    selectionvectors: [],
    project: null,
    tailoring: null,
    returnUrl: null,

});

const getters = {
    authenticated: () => state.auth != null,
    accessToken: () => state.auth?.accessToken
};

const mutations = {
    authRequired: (authRequired) => state.authRequired = authRequired,
    auth: (auth) => {
        state.auth = auth;
    },
    logout: () => (state.auth = null),
    accessToken: (accessToken) => (state.auth.accessToken = accessToken),
    tenant: (tenant) => {
        state.tenant = tenant;
        localStorage.setItem('tenant', tenant);
    },
    loading: (loading) => (state.loading = loading),
    help: (help) => (state.help = help),
    links: (links) => (state.links = links),
    catalogs: (catalogs) => (state.catalogs = catalogs),
    breadcrumbs: (breadcrumbs) => (state.breadcrumbs = breadcrumbs),
    toast: (toast) => (state.toast = toast),
    selectionvectors: (selectionvectors) => (state.selectionvectors = selectionvectors),
    project: (project) => (state.project = project),
    tailoring: (tailoring) => (state.tailoring = tailoring),
    returnUrl: (returnUrl) => (state.returnUrl = returnUrl)
};

const actions = {};
export default {
    state: readonly(state),
    getters,
    mutations,
    actions
};
