import { App } from 'vue';
import { Router } from 'vue-router';
import { Pinia } from 'pinia';
import { CoreInstance, CoreModule } from '@/core';
import { createModule } from '@/core/utils/module-utils';

// Импорт маршрутов модуля
import moduleRoutes from './routes';

// Используем динамический импорт для компонентов
// Это поможет избежать циклических зависимостей
const ExampleDashboardComponent = () => import('./components/ExampleDashboard.vue');
const ExampleSettingsComponent = () => import('./components/ExampleSettings.vue');

// Создание модуля с помощью хелпера
const exampleModule: CoreModule = createModule({
  name: 'example',
  
  // Маршруты модуля
  routes: moduleRoutes,
  
  // Компоненты модуля (теперь используем динамические импорты)
  components: {
    Dashboard: ExampleDashboardComponent,
    Settings: ExampleSettingsComponent,
  },
  
  // Метод расширения ядра
  extend: (core: CoreInstance) => {
    // Переопределяем некоторые настройки ядра
    core.extendConfig({
      theme: {
        primary: '#FF5722', // Меняем основной цвет
        secondary: '#424242', // Сохраняем вторичный цвет
      },
    });
    
    // Также можно заменить логотип или другие настройки
    // core.extendConfig({
    //   logo: '/assets/custom-logo.svg',
    // });
  },
  
  // Метод инициализации модуля
  setup: (app: App, router: Router, pinia: Pinia) => {
    console.log(`Module 'example' initialized`);
    
    // Здесь можно выполнить дополнительные настройки модуля
    // Например, добавить глобальные миксины, директивы и т.д.
  },
});

export default exampleModule; 