import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
    {
        path: '',
        name: 'home',
        component: () => import('@/pages/Home.vue'),
    },
    {
        path: '/catalog',
        component: () => import('@/pages/BaseCatalog.vue'),
        name: 'basecatalog'
    },
    {
        path: '/project',
        component: () => import('@/pages/Container.vue'),
        children: [
            {
                path: '',
                component: () => import('@/pages/Projects.vue'),
                name: 'projects'
            },
            {
                path: ':id',
                component: () => import('@/pages/Project.vue'),
                props: true,
                name: 'project'
            },
            {
                path: 'new',
                component: () => import('@/pages/ProjectNew.vue'),
                name: 'projectnew'
            },
            {
                path: ':id/copy',
                component: () => import('@/pages/ProjectCopy.vue'),
                props: true,
                name: 'projectcopy'
            },
            {
                path: ':id/:tailoring/catalog',
                component: () => import('@/pages/TailoringCatalog.vue'),
                props: true,
                name: 'catalog'
            },
            {
                path: ':id/tailoring/new',
                component: () => import('@/pages/TailoringNew.vue'),
                props: true,
                name: 'tailoringnew'
            },
        ]
    },
];


export default new VueRouter({
  mode: 'history',
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active',
  routes
});
