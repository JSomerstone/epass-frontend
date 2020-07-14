import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from "./router";
import store from "./store";
import 'buefy/dist/buefy.css'
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-vue';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

Vue.config.productionTip = false
Vue.use(Buefy);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
