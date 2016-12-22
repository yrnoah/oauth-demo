// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Index from './pages/Index';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/nroauth', component: Index, name: 'index' },
];

const router = new VueRouter({ mode: 'history', routes });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
