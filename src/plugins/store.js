import { reactive, readonly, watch } from 'vue';

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
    links: (links) => state.links = links,
    breadcrumbs: (breadcrumbs) => state.breadcrumbs = breadcrumbs,
    toast: (toast) => state.toast = toast,
    project: (project) => state.project = project,
    tailoring: (tailoring) => state.tailoring = tailoring,
};

const actions = {};

watch(
    state.links,
    (links) =>  localStorage.setItem('links', JSON.stringify(links)),
    { deep: true }
);
watch(
    state.breadcrumbs,
    (breadcrumbs) =>  localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs)),
    { deep: true }
);

watch(() => state.project,
    (project) =>  localStorage.setItem('project', JSON.stringify(project)),
    { deep: true }
);

watch(() => state.tailoring,
 (tailoring) =>  localStorage.setItem('tailoring', JSON.stringify(tailoring)),
    { deep: true }
);

export default {
    state: readonly(state),
    mutations,
    actions
};
