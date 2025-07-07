import { toValue } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/plugins/store';

const instance = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layout/AppLayout.vue'),
            meta: {
                requiresAuth: store.state.authRequired
            },
            children: [
                {
                    path: '/project',
                    children: [
                        {
                            path: '',
                            alias: '/',
                            component: () => import('@/pages/Projects.vue'),
                            name: 'projects',
                            meta: {
                                requiresAuth: store.state.authRequired
                            }
                        },
                        {
                            path: ':id',
                            component: () => import('@/pages/Project.vue'),
                            props: true,
                            name: 'project',
                            meta: {
                                requiresAuth: store.state.authRequired
                            }
                        },
                        {
                            path: 'new',
                            component: () => import('@/pages/ProjectNew.vue'),
                            name: 'projectnew',
                            meta: {
                                requiresAuth: store.state.authRequired
                            }
                        },
                        {
                            path: ':id/:tailoring/catalog',
                            component: () => import('@/pages/TailoringCatalog.vue'),
                            props: true,
                            name: 'catalog',
                            meta: {
                                requiresAuth: store.state.authRequired
                            }
                        },
                        {
                            path: ':id/tailoring/new',
                            component: () => import('@/pages/TailoringNew.vue'),
                            props: true,
                            name: 'tailoringnew',
                            meta: {
                                requiresAuth: store.state.authRequired
                            }
                        }
                    ]
                },
                {
                    path: '/catalog',
                    component: () => import('@/pages/BaseCatalog.vue'),
                    name: 'basecatalog',
                    meta: {
                        requiresAuth: store.state.authRequired
                    }
                }
            ]
        },
        {
            path: '/auth',
            children: [
                {
                    path: 'login',
                    component: () => import('@/pages/Login.vue'),
                    name: 'login',
                    meta: {
                        requiresAuth: false
                    }
                }
            ]
        }
    ]
});

instance.beforeEach((to, from, next) => {
    if (to == null || to.name == 'login') {
        store.mutations.returnUrl('projects');
    }

    if (to.meta.requiresAuth && !toValue(store.getters.authenticated)) {
        store.mutations.returnUrl(to != null ? to.name : 'projects');
        next({ name: 'login' });
    } else {
        next();
    }
});

export default instance;
