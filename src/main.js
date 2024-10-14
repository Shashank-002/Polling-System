import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"; 
import { faEye } from "@fortawesome/free-solid-svg-icons"; // Use the correct import for the eye icon

// Add Font Awesome icons to the library
library.add(faEyeSlash, faEye);

// Create the Vue app
const app = createApp(App);

// Register Font Awesome icon component
app.component('font-awesome-icon', FontAwesomeIcon);

// Create and use Pinia
const pinia = createPinia();
app.use(router);
app.use(pinia);

// Mount the app
app.mount('#app');
