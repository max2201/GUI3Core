// import { Component } from 'vue'
import type { App, Component } from 'vue';
import type { Router } from 'vue-router'
import type { Pinia } from 'pinia'

/**
 * Интерфейс для модуля ядра
 */
export interface Module {
  name: string
  routes?: any[]
  stores?: any[]
  components?: Record<string, Component>
  services?: any[]
  setup?: (app: App, router: Router, pinia: Pinia) => void
  extend?: (core: CoreInstance) => void
}

/**
 * Интерфейс для экземпляра ядра
 */
export interface CoreInstance {
  // Основные настройки
  config: {
    appName: string
    logo: string
    theme: {
      primary: string
      secondary: string
      [key: string]: any
    }
    [key: string]: any
  }
  
  // Методы для работы с модулями
  registerModule: (module: Module) => void
  getModules: () => Module[]
  
  // Методы для расширения/переопределения элементов ядра
  extendConfig: (config: Partial<CoreInstance['config']>) => void
  overrideComponent: (name: string, component: Component) => void
  getComponent: (name: string) => Component | undefined
  
  // Методы авторизации
  auth: {
    login: (credentials: any) => Promise<any>
    logout: () => Promise<void>
    getUser: () => any
    isAuthenticated: () => boolean
  }
  
  // Публичное API для использования модулями
  api: {
    callService: (service: string, method: string, ...args: any[]) => Promise<any>
  }
}

/**
 * Опции для инициализации приложения
 */
export interface BootstrapOptions {
  rootComponent: any
  rootElement: string | Element
  modules?: string[] | Module[]
  useCoreLicense?: boolean
} 