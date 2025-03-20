export const Routes = {
  auth: {
    index: '/auth',
    recover: '/auth/recover',
  },
  module: {
    index: '/:id',
    submodule: '/:id/:sid',
    submoduleUid: '/:id/:sid/:uid',
  },
  service: {
    error: '/:pathMatch(.*)*',
  },
  dev: {
    ui: '/ui',
  },
  messenger: '/messenger',
  objectPage: '/object-page/:type/:id',
  resource: {
    image: '/resource/image/'
  }
}

export const RouteMeta = {
  home: {
    title: 'xLombard | Главная',
    meta: [],
  },
  auth: {
    index: {
      title: 'xLombard | Восстановление пароля',
      meta: [],
    },
    recover: {
      title: 'xLombard |Авторизация',
      meta: [],
    },
  },
  module: {
    index: {
      title: 'xLombard | Страница',
      meta: [],
    },
    submodule: {
      title: 'xLombard | Страница',
      meta: [],
    },
  },
  dev: {
    ui: {
      title: 'xLombard | Интерфейс',
      meta: [],
    },
  },
  messenger: {
    title: 'xLombard | Чаты с клиентом',
      meta: [],
  },
  objectPage: {
    title: '',
    meta: [],
  },
  resource: {
    image: {
      title: 'xLombard | Изображение',
      meta: [],
    },
  },
}


export const RouteNames = {
  root: 'root',
  [Routes.auth.index]: 'auth',
  [Routes.auth.recover]: 'authRecover',
  [Routes.module.index]: 'module',
  [Routes.module.submodule]: 'submodule',
  [Routes.module.submoduleUid]: 'submodule-guid',
  [Routes.dev.ui]: 'ui',
  [Routes.service.error]: 'error',
  [Routes.messenger]: 'messenger',
  [Routes.objectPage]: 'object-page',
  [Routes.resource.image]: 'image-resource',
}