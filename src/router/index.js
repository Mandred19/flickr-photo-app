
import VueRouter from 'vue-router';

import Main from '../views/Main';

const routes = [
  {
    name: 'main',
    path: '/',
    component: Main,
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
