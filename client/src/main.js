import Vue from 'vue'
import App from './App.vue'
import router from './router'
require('dotenv').config()

import 'bootstrap'
import "bootswatch/dist/flatly/bootstrap.min.css"; 

Vue.config.productionTip = false
// window.appConfig = { API_ADDR: 'http://localhost:1337'} 
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
