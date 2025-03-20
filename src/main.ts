import { createApp } from 'vue'
import 'virtual:svg-icons-register'

import App from './App.vue'
import router from '@/core/router'
import { registerPlugins } from '@/core/plugins'
import '@/assets/styles/app.scss'

const app = createApp(App)

app.use(router)
registerPlugins(app, router)

app.mount('#app')
