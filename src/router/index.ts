import {
  RouteRecordRaw,
  createRouter as createVueRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";

import Home from "../views/Home.vue";
import NotFound from "../views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("../components/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../components/SignUp.vue"),
  },
  {
    path: "/upload",
    name: "Upload",
    component: () => import("../components/Upload.vue"),
  },
  {
    path: "/files",
    name: "Files",
    component: () => import("../components/Files.vue"),
  },
  {
    path: "/:a(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

export function createRouter() {
  return createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
