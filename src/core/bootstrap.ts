import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { Router } from 'vue-router';
import { createPinia } from 'pinia';
import type { Pinia } from 'pinia';
import { loadModules } from './utils/module-utils';
import { core } from './index';
import type { Module, BootstrapOptions } from './types';
import type { App } from 'vue';

/**
 * Инициализирует приложение с ядром и модулями
 */
export async function bootstrap(options: BootstrapOptions): Promise<{
  app: App;
  router: Router;
  pinia: Pinia;
}> {
  const { rootComponent, rootElement, modules = [], useCoreLicense = true } = options;
  
  // Проверка лицензии (заглушка)
  if (useCoreLicense) {
    // Здесь добавляем проверку лицензии для ядра
    // Может быть запрос к API, проверка ключа и т.д.
    console.log('Core license verification...');
  }
  
  // Создание основных экземпляров приложения
  const app = createApp(rootComponent);
  const router = createRouter({
    history: createWebHistory(),
    routes: [],
  });
  const pinia = createPinia();
  
  // Подключение Pinia
  app.use(pinia);
  app.use(router);
  
  // Загрузка модулей
  let coreModules: Module[] = [];
  
  if (modules.length > 0) {
    if (typeof modules[0] === 'string') {
      // Если передан массив строк, загружаем модули динамически
      coreModules = await loadModules(modules as string[]);
    } else {
      // Если передан массив модулей, используем их напрямую
      coreModules = modules as Module[];
    }
    
    // Регистрация модулей в ядре
    for (const module of coreModules) {
      core.registerModule(module);
    }
  }
  
  // Инициализация ядра
  await core.init(app, router, pinia);
  
  // Монтирование приложения
  app.mount(rootElement);
  
  return { app, router, pinia };
}

/**
 * Экспортирует ядро и все необходимые утилиты
 */
export default {
  bootstrap,
  core,
}; 