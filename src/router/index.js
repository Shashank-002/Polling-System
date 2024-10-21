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

  // Check if the user is logged in
  const { isAuthenticated } = authStore;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the route requires authentication
    if (!isAuthenticated) {
      next({ name: "PollLoginPage" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
