import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "../stores/auth-store";
import { usePollsStore } from "../stores/polls-store";

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
  {
    path: "/edit-poll/:id",
    name: "editPollPage",
    component: () => import("../pages/PollEditPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();  
  const pollsStore = usePollsStore();  

  const authToken = localStorage.getItem("authToken");

  // Handle authentication checks
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authToken) {
      authStore.logout();  // Log out if no auth token exists
      next({ name: "PollLoginPage" });  // Redirect to login if not authenticated
    } else {
      next();  // Proceed to the route if authenticated
    }
  } else if (authToken && (to.name === "PollLoginPage" || to.name === "SignupPage")) {
    next({ name: "PollPage" });  // Redirect authenticated users away from login/signup
  } else {
    next();  // Proceed as normal if no special conditions
  }

  // Reset polls and fetch fresh polls when navigating to the PollPage
  if (to.name === "PollPage") {
    pollsStore.resetPolls();  // Reset polls before fetching new ones
    // pollsStore.fetchPolls();  // Fetch the latest polls
  }
});

export default router;
