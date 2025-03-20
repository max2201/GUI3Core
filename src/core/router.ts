import { createRouter, createWebHistory } from 'vue-router'
import root from '@/pages/Main.vue'
import { RouteNames, Routes } from '@/core/config/Routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.root,
      component: root,
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.auth.index,
      name: RouteNames[Routes.auth.index],
      component: () => import('@/pages/Auth/Login.page.vue'),
      meta: {
        redirectAuthenticated: true,
      },
    },
    {
      path: Routes.auth.recover,
      name: RouteNames[Routes.auth.recover],
      component: () => import('@/pages/Auth/Recover.page.vue'),
      meta: {
        redirectAuthenticated: true,
      },
    },
    {
      path: Routes.module.index,
      name: RouteNames[Routes.module.index],
      component: () => import('@/pages/Module/Router.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.module.submodule,
      name: RouteNames[Routes.module.submodule],
      component: () => import('@/pages/Module/Router.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.module.submoduleUid,
      name: RouteNames[Routes.module.submoduleUid],
      component: () => import('@/pages/Module/Router.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.messenger,
      name: RouteNames[Routes.messenger],
      component: () => import('@/pages/Messenger/Messenger.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.objectPage,
      name: RouteNames[Routes.objectPage],
      component: () => import('@/pages/ObjectPage/ObjectPage.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.resource.image,
      name: RouteNames[Routes.resource.image],
      component: () => import('@/pages/Resource/ImageResource.vue'),
      meta: {
        authRequired: true,
      },
    },
    {
      path: Routes.service.error,
      name: RouteNames[Routes.service.error],
      component: () => import('@/pages/Service/Error.vue'),
    },
    {
      path: '/testUIKit',
      name: 'testUIKit',
      component: () => import('@/pages/UIKit.vue'),
      meta: {
        redirectAuthenticated: false,
        authRequired: false,
      },
    },
  ],
})

export default router
