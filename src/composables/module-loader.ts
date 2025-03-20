import { defineAsyncComponent } from 'vue'

export const useModuleLoader = () => {
  const route = useRoute()

  const routeModuleId = computed(() => {
    return route.params.sid as string
  })

  const routeModuleUid = computed(() => {
    return route.params.uid as string
  })
  // переименовать  на ModuleComponent
  const ModuleCompontent = computed(() => {
    const whiteList = ['RequestsModule', 'ClientsModule']

    const id = routeModuleId.value
    if (!whiteList.includes(id)) return null

    return {
      sidepanel: defineAsyncComponent(() => import(`../modules/${id}/${id}.sidepanel.vue`)),
      cardview: defineAsyncComponent(() => import(`../modules/${id}/${id}.cardview.vue`)),
    }
  })

  return { routeModuleId, routeModuleUid, ModuleCompontent }
}
