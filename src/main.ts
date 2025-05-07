import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import 'vue-select/dist/vue-select.css'
import { bootstrap } from './core/bootstrap'
import App from './App.vue'
import { registerPlugins } from '@/core/plugins'
import '@/assets/styles/app.scss'
import VueApexCharts from "vue3-apexcharts"

// // Импортируем модули
// import testModule from './modules/test'
import customModule from './modules/custom';
// Инициализируем приложение через ядро
bootstrap({
  rootComponent: App,
  rootElement: '#app',
  modules: [
    customModule,
    // testModule,
    {
      name: 'core-module',
      extend: (core) => {
        // Расширяем конфигурацию ядра
        core.extendConfig({
          appName: 'Мое приложение',
          logo: '/assets/logo.png',
          theme: {
            primary: '#4CAF50',
            secondary: '#2196F3',
          },
        })
      },
    },
  ],
  useCoreLicense: false, // Отключаем проверку лицензии для разработки
})
.then(({ app, router, pinia }) => {
  // Устанавливаем глобальные плагины
  console.log(router)
  app.use(VueApexCharts)
  registerPlugins(app, router)
  
  console.log('Приложение успешно инициализировано!')
})
.catch((error) => {
  console.error('Ошибка инициализации приложения:', error)
})
