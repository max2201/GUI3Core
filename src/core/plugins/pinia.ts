import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { markRaw } from 'vue'

export default (app: any, router: any) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  })

  app.use(pinia)
}
