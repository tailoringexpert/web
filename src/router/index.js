import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
    {
        path: '',
        name: 'home',
        component: () => import('@/components/Home.vue'),
    },
    {
        path: '/catalog',
        component: () => import('@/components/BaseCatalog.vue'),
        name: 'basecatalog'
    },
    {
        path: '/project',
        component: () => import('@/components/Container.vue'),
        children: [
            {
                path: '',
                component: () => import('@/components/Projects.vue'),
                name: 'projects'
            },
            {
                path: ':id',
                component: () => import('@/components/Project.vue'),
                props: true,
                name: 'project'
            },
            {
                path: 'new',
                component: () => import('@/components/ProjectNew.vue'),
                name: 'projectnew'
            },
            {
                path: ':id/copy',
                component: () => import('@/components/ProjectCopy.vue'),
                props: true,
                name: 'projectcopy'
            },
            {
                path: ':id/:tailoring/catalog',
                component: () => import('@/components/TailoringCatalog.vue'),
                props: true,
                name: 'catalog'
            },
            {
                path: ':id/tailoring/new',
                component: () => import('@/components/TailoringNew.vue'),
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
