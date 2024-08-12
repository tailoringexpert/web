import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/catalog",
        component: () => import("@/pages/BaseCatalog.vue"),
        name: "basecatalog",
    },
    {
        path: "/project",
        children: [
            {
                path: "",
                alias: "/",
                component: () => import("@/pages/Projects.vue"),
                name: "projects",
            },
            {
                path: ":id",
                component: () => import("@/pages/Project.vue"),
                props: true,
                name: "project",
            },
            {
                path: "new",
                component: () => import("@/pages/ProjectNew.vue"),
                name: "projectnew",
            },
            {
                path: ":id/:tailoring/catalog",
                component: () => import("@/pages/TailoringCatalog.vue"),
                props: true,
                name: "catalog",
            },
            {
                path: ":id/tailoring/new",
                component: () => import("@/pages/TailoringNew.vue"),
                props: true,
                name: "tailoringnew",
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
