
import VueRouter from 'vue-router';

const routes = [
  {
    name: 'root',
    path: '/',
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
