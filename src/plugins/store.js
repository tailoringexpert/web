import { reactive, readonly } from 'vue';

const breadcrumbs  = JSON.parse(localStorage.getItem('breadcrumbs') || '[]');
const project = JSON.parse(localStorage.getItem('project') || null);
const tailoring = JSON.parse(localStorage.getItem('tailoring') || null);
const links = JSON.parse(localStorage.getItem('links') || '[]');

const state = reactive({
    loading: false,
    help: false,
    toast: null,
    links: links,
    breadcrumbs: breadcrumbs,
    project: project,
    tailoring: tailoring,

});

const mutations = {
    loading: (loading) => state.loading = loading,
    help: (help) => state.help = help,
    toast: (toast) => state.toast = toast,
    links: (links) => {
        state.links = links;
        localStorage.setItem('links', JSON.stringify(links));
    },
    breadcrumbs: (breadcrumbs) => {
        state.breadcrumbs = breadcrumbs;
        localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));
    },
    project: (project) => {
        state.project = project;
        localStorage.setItem('project', JSON.stringify(project));
    },
    tailoring: (tailoring) => {
        state.tailoring = tailoring;
        localStorage.setItem('tailoring', JSON.stringify(tailoring))
    },
};

const actions = {};

export default {
    state: readonly(state),
    mutations,
    actions
};
