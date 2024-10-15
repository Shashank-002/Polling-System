import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons"; // Use the correct import for the eye icon

library.add(faEyeSlash, faEye);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount("#app");
