// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "../stores/auth-store";

const routes = [
  {
    path: "/",
    name: "PollLoginPage",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/poll-list",
    name: "PollPage",
    component: () => import("../pages/PollListPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const authToken = localStorage.getItem("authToken");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authToken) {
      authStore.logout();
    } else {
      next();
    }
  } else {
    if (authToken) {
      next({ name: "PollPage" });
    } else {
      next();
    }
  }
});

export default router;
