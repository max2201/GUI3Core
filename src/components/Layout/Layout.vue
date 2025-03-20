<template>
  <div
    :class="[
      'page',
      {
        page__login: isLoginPage,
      },
    ]"
  >
    <LayoutHeaderAuth v-if="simple" />
    <LayoutHeader v-else />

    <div class="page__wrapper">
      <LayoutSidebar v-if="!simple && isHasUserData" />

      <div
        class="page__body"
        :class="[ui.sidebarOpened && 'sidebar-open', StopClickOutsideClasses.pageBody]"
      >
        <slot></slot>
      </div>
    </div>

    <SharedModals />
  </div>
</template>

<script setup lang="ts">
import { LayoutHeader, LayoutHeaderAuth, LayoutSidebar, SharedModals } from '@c/Layout'
import { RouteNames, Routes } from '@/core/config/Routes'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const props = defineProps<{ simple: boolean }>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, isHasUserData } = storeToRefs(authStore)
const ui = useUiStore()

const isLoginPage = computed(() => {
  return (
    route.name === RouteNames[Routes.auth.index] || route.name === RouteNames[Routes.auth.recover]
  )
})

const moduleStore = useModuleStore()
const { currentModuleId, currentModuleUid, modules } = storeToRefs(moduleStore)

const updateModuleIdInStore = (routeTo?: any) => {
  const targetRoute = routeTo || route
  const newModuleID = targetRoute.params.sid as string
  const newModuleUID = targetRoute.params.uid as string

  if (newModuleID) {
    currentModuleId.value = newModuleID
    currentModuleUid.value = newModuleUID || ''
  }
}

updateModuleIdInStore()

router.beforeEach(async (to) => {
  updateModuleIdInStore(to)

  if (to.meta.authRequired && !isHasUserData && to.name !== RouteNames[Routes.auth.index]) {
    return { name: RouteNames[Routes.auth.index] }
  }

  if (to.meta.redirectAuthenticated && isHasUserData.value) {
    return { name: RouteNames.root }
  }
})

// store init
moduleStore.init().then(() => {
  if (
    route.params.sid ||
    [RouteNames[Routes.messenger], RouteNames[Routes.objectPage]].includes(String(route.name))
  ) {
    return
  }

  const dashboard = modules.value.find((m) => m.Id === 'desktop')

  if (dashboard && dashboard.Modules[0] && route.name !== 'testUIKit') {
    router.push({
      name: RouteNames[Routes.module.submodule],
      params: {
        id: dashboard.Id,
        sid: dashboard.Modules[0].Id,
      },
    })
  }
})

getScrollbar()

const configurationStore = useConfigurationStore()
configurationStore.loadConfigurationFromLS()

const dashboardStore = useDashboardStore()
dashboardStore.loadDashboardSettingsFromLS()
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 50px auto;
  overflow: auto;

  &__wrapper {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 60px calc(100vw - 60px);
    width: 100vw;
    overflow: auto;
  }
  &__body {
    position: relative;
    padding-left: 0;
    display: grid;
    grid-template-rows: 1fr;
    width: calc(100vw - 60px);
    overflow: auto;
  }
}

.page.page__login {
  grid-template-rows: 80px auto;

  .page__body {
    width: 100vw;
  }
}
.page__body.sidebar-open {
  transition: 0.3s ease all;
  width: calc(100vw - 200px);
  margin-left: auto;
}
</style>
