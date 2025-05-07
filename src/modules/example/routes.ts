import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'example-dashboard',
    component: () => import('./components/ExampleDashboard.vue'),
    meta: {
      title: 'Пример панели управления',
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'example-settings',
    component: () => import('./components/ExampleSettings.vue'),
    meta: {
      title: 'Настройки модуля',
      requiresAuth: true,
    },
  },
];

export default routes; 