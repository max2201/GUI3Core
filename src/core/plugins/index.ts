import { default as head } from './head'
import { default as pinia } from './pinia'
import { default as floatingVue } from './floating-vue'
import { default as toastification } from './toastification'
import { default as calendar } from './v-calendar'

export const registerPlugins = (app: any, router: any) => {
  head(app)
  pinia(app, router)
  floatingVue(app)
  toastification(app)
  calendar(app)
}
