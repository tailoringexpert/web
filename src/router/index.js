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
        path: '/katalog',
        component: () => import('@/components/KatalogImport.vue'),
        name: 'gesamtkatalog'
    },
    {
        path: '/projekt',
        component: () => import('@/components/Container.vue'),
        children: [
            {
                path: '',
                component: () => import('@/components/Projekte.vue'),
                name: 'projekte'
            },
            {
                path: ':id',
                component: () => import('@/components/Projekt.vue'),
                props: true,
                name: 'projekt'
            },
            {
                path: 'neu',
                component: () => import('@/components/ProjektAnlegen.vue'),
                name: 'projektanlegen'
            },
            {
                path: ':id/kopie',
                component: () => import('@/components/ProjektKopieren.vue'),
                props: true,
                name: 'projektkopieren'
            },
            {
                path: ':id/:phase/katalog',
                component: () => import('@/components/Katalog.vue'),
                props: true,
                name: 'katalog'
            },
            {
                path: ':id/phase/neu',
                component: () => import('@/components/TailoringAnlegen.vue'),
                props: true,
                name: 'tailoringanlegen'
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
