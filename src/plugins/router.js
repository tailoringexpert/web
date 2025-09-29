import { createRouter, createWebHistory } from 'vue-router';
import api from '@/plugins/api';
import store from '@/plugins/store';

const history= createWebHistory();
const routes = [
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
                       name: 'projects',
                   },
                   {
                       path: ':id',
                       component: () => import('@/pages/Project.vue'),
                       props: true,
                       name: 'project',
                       beforeEnter: (to, from) => {
                            const state = store.state.project;
                            if ( state == null) {
                                const url = store.state.links.project.href.replace('{project}', to.params.id);
                                api.get(url)
                                    .then((response) => {
                                        store.mutations.project(response.data);
                                        return true;
                                    })
                                    .catch((error) => {
                                        return false
                                    });
                            }
                            return true;
                       },
                   },
                   {
                       path: 'new',
                       component: () => import('@/pages/ProjectNew.vue'),
                       name: 'projectnew',
                   },
                   {
                       path: ':id/:tailoring/catalog',
                       component: () => import('@/pages/TailoringCatalog.vue'),
                       props: true,
                       name: 'catalog',
                       beforeEnter: (to, from) => {
                            const state = store.state.tailoring;
                            if ( state == null) {
                                const url = store.state.links.project.href.replace('{project}', to.params.id);
                                api.get(url)
                                    .then((response) => {
                                        const project = response.data;
                                        store.mutations.project(project);
                                        const tailoring = project.tailorings.find(tailoring => tailoring.name === to.params.tailoring);
                                        store.mutations.tailoring(tailoring);
                                        return true;
                                    })
                                    .catch((error) => {
                                        return false
                                    });
                            }
                            return true;
                       },
                   },
                   {
                       path: ':id/tailoring/new',
                       component: () => import('@/pages/TailoringNew.vue'),
                       props: true,
                       name: 'tailoringnew',
                   }
               ]
           },
           {
               path: '/catalog',
               component: () => import('@/pages/BaseCatalog.vue'),
               name: 'basecatalog',
           }
       ]
   }

];

const instance = createRouter({ history, routes });
instance.beforeEach((to, from) => {
    if (to.hash?.length > 0) {
        return { path: to.path, hash: '' };
    }
});
export default instance;
