import Vue from 'vue'
import App from './App.vue'
import router from './router'
require('dotenv').config()

import 'bootstrap'
import "bootswatch/dist/flatly/bootstrap.min.css"; 

Vue.config.productionTip = false

// Defaults
window.appConfig = { API_ADDR: 'http://localhost:1337'} 

// Configs
// Import the Auth0 configuration
import { domain, clientId, audience } from "../auth_config.json";

// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
