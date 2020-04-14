import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSpinners from 'vue-spinners'

require('dotenv').config()

var SocialSharing = require('vue-social-sharing');

import 'bootstrap'
import "bootswatch/dist/flatly/bootstrap.min.css"; 


// Configs
// Defaults
Vue.config.productionTip = false
// window.appConfig = { API_ADDR: "https://someapi" }

import { domain, clientId, audience } from "../auth_config.json";

// Import the Auth0 configuration
// var domain = window.appConfig.AUTH0_DOMAIN
// var clientId = window.appConfig.AUTH0_CLIENT_ID
// var audience = window.appConfig.AUTH0_AUDIENCE

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
 
Vue.use(SocialSharing);
Vue.use(VueSpinners)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
