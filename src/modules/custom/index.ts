import type { Module } from '@/core/types';
import CustomHome from './components/CustomHome.vue';
import CustomProfile from './components/CustomProfile.vue';
import CustomSettings from './components/CustomSettings.vue';
import CustomAnalytics from './components/CustomAnalytics.vue';

const customModule: Module = {
  name: 'custom',
  routes: [
    {
      path: '/',
      name: 'custom-home',
      component: CustomHome,
    },
    {
      path: '/profile',
      name: 'custom-profile',
      component: CustomProfile,
    },
    {
      path: '/settings',
      name: 'custom-settings',
      component: CustomSettings,
    },
    {
      path: '/analytics',
      name: 'custom-analytics',
      component: CustomAnalytics,
    },
  ],
  menu: [
    {
      title: 'Главная',
      icon: 'home',
      route: '/',
    },
    {
      title: 'Профиль',
      icon: 'user',
      route: '/profile',
    },
    {
      title: 'Настройки',
      icon: 'settings',
      route: '/settings',
    },
    {
      title: 'Аналитика',
      icon: 'chart',
      route: '/analytics',
    },
  ],
};

export default customModule; 