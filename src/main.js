import Vue from 'vue';
import App from './App.vue';
import router from './router';
import iView from 'iview';
import Ajax from './assets/js/ajax'
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.prototype.ajax = Ajax;
Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
