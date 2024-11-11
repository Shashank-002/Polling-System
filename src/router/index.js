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
    path: "/signup",
    name: "SignupPage",
    component: () => import("../pages/SignupPage.vue"),
  },
  {
    path: "/poll-list",
    name: "PollPage",
    component: () => import("../pages/PollListPage.vue"),
    meta: { requiresAuth: true },
  },
  { path: '/edit-poll/:id',
    name: 'editPollPage',
    component: ()=> import("../pages/PollEditPage.vue"), 
   }
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
  } else if (authToken && (to.name === "PollLoginPage" || to.name === "SignupPage")) {
    next({ name: "PollPage" });  // Redirect authenticated users away from login/signup
  } else {
    next();  // Proceed as normal
  }
});

export default router;
