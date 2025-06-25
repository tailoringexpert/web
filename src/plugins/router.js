import { createRouter, createWebHistory } from 'vue-router';

const instance = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layout/AppLayout.vue'),
            children: [
                {
                    path: '/project',
                    children: [
                        {
                            path: '',
                            alias: '/',
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
                        }
                    ]
                },
                {
                    path: '/catalog',
                    component: () => import('@/pages/BaseCatalog.vue'),
                    name: 'basecatalog'
                }
            ]
        }
    ]
});

export default instance;
