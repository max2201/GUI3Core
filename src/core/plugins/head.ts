import { createHead } from '@vueuse/head'
export default (app: any) => {
  const head = createHead()

  app.use(head)
}
