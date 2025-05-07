import type { Module } from '../types';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import type { Pinia } from 'pinia';

/**
 * Регистрирует маршруты модуля в роутере
 */
export function registerModuleRoutes(router: Router, module: Module): void {
  if (module.routes && module.routes.length > 0) {
    module.routes.forEach(route => {
      // Добавляем префикс для маршрутов модуля
      const moduleRoute = {
        ...route,
        path: `/module/${module.name}${route.path}`,
        meta: {
          ...route.meta,
          module: module.name,
        },
      };
      
      router.addRoute(moduleRoute);
    });
  }
}

/**
 * Регистрирует хранилище модуля в Pinia
 */
export function registerModuleStores(pinia: Pinia, module: Module): void {
  if (module.stores && module.stores.length > 0) {
    module.stores.forEach(storeFactory => {
      if (typeof storeFactory === 'function') {
        // Используем defineStore из Pinia для определения хранилища
        const store = storeFactory(defineStore);
        
        // Хранилище будет автоматически зарегистрировано в Pinia
      }
    });
  }
}

/**
 * Помощник для создания модуля
 */
export function createModule(moduleConfig: Partial<Module>): Module {
  const defaultModule: Module = {
    name: 'unnamed-module',
    routes: [],
    stores: [],
    components: {},
    services: [],
    setup: undefined,
    extend: undefined,
  };
  
  return {
    ...defaultModule,
    ...moduleConfig,
  };
}

/**
 * Загружает модули динамически по их именам
 */
export async function loadModules(moduleNames: string[]): Promise<Module[]> {
  const modules: Module[] = [];
  
  for (const moduleName of moduleNames) {
    try {
      // Динамический импорт модуля
      const moduleImport = await import(`@/modules/${moduleName}`);
      
      if (moduleImport.default && typeof moduleImport.default === 'object') {
        modules.push(moduleImport.default as Module);
      }
    } catch (error) {
      console.error(`Failed to load module: ${moduleName}`, error);
    }
  }
  
  return modules;
} 