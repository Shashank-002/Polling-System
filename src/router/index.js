import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "PollLoginPage",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/poll-list",
    name: "PollPage",
    component: () => import("../pages/PollPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
