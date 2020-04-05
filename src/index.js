
import './polyfills';
import './styles/index.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { mapGetters } from 'vuex';
import { sync } from 'vuex-router-sync';
import store from 'store';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
// import VueGettextPlugin from './vueGettextPlugin';

import router from './router';
import App from 'src/App';

import clickOutsideDirective from 'helpers/directives/clickOutside';

import './styles/_custom.scss';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
// Vue.use(VueGettextPlugin);

Vue.directive('click-outside', clickOutsideDirective);

const vuexStore = new Vuex.Store(store);
sync(vuexStore, router);

Vue.mixin({
  created() {

  },
  methods: {

  },
  computed: {
    ...mapGetters({
      appIsLoad: 'getAppIsLoad',
      isMobile: 'getIsMobile',
      windowWidth: 'getWindowWidth',
    }),
  }
});

const app = new Vue({
  el: '#app',
  store: vuexStore,
  router,
  render: (h) => h(App),
});

vuexStore.$app = app;

export default app;
