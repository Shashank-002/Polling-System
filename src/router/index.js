import { createRouter, createWebHashHistory } from "vue-router";

// Define your routes (at least an empty array if none are ready)
const routes = [
  {
    path: '/',
    name : 'PollLoginPage',
    component: () => import("../components/PollLoginPage.vue"), 
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes // <-- You need to pass this array
});

export default router;
