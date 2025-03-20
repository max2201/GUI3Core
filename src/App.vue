<template>
  <UiLoader v-if="!route.name" theme="page" loading not-transparent />

  <LayoutMessenger v-else-if="route.name === RouteNames[Routes.messenger]">
    <RouterView />
  </LayoutMessenger>

  <LayoutObjectPage v-else-if="route.name === RouteNames[Routes.objectPage]">
    <RouterView />
  </LayoutObjectPage>

  <ResourceLayout v-else-if="resourcesPages.includes(String(route.name))">
    <RouterView />
  </ResourceLayout>

  <LayoutDefault v-else :simple="isSimpleView">
    <RouterView />

    <UiLoader :loading="showLoader" theme="page" not-transparent />

    <WindowManager />
    <ObjectEventsList />
    <LiteViewRoot />
    <FreeModalsRoot />
    <CreateNotificationModal />
  </LayoutDefault>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Routes, RouteNames } from '@/core/config'
import { LayoutDefault, ResourceLayout } from '@c/Layout'
import CreateNotificationModal from './components/Notifications/CreateNotificationModal.vue'

const $env = import.meta.env
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

const { isAuthenticated, isHasUserData } = storeToRefs(authStore)

useHead({
  bodyAttrs: {
    class: `theme-${$env.theme}`,
  },
})

const resourcesPages = ref([
  ...Object.values(Routes.resource).map<string>((resourcePage) => RouteNames[resourcePage]),
])

const showLoader = computed(() => {
  return Boolean(!isAuthenticated.value && route.meta.authRequired)
})

// шаблон имеет 2 состояния - простое (авторизация, лендинг) и основное (дашборд)
const isSimpleView = computed(() => {
  return typeof route.name === 'string' ? route.name.includes(RouteNames[Routes.auth.index]) : false
})
</script>
<style>
#app div::-webkit-scrollbar,
ul::-webkit-scrollbar {
  width: 15px;
  height: 15px;
  background-color: var(--color-background);
}
#app div::-webkit-scrollbar-track,
ul::-webkit-scrollbar-track {
  background-color: var(--color-background);
  border-radius: 8px;
}
#app div::-webkit-scrollbar-thumb,
ul::-webkit-scrollbar-thumb {
  background: #cad2d7;
  border-radius: 8px;
  border: 5px solid var(--color-background);
  width: 15px;
}
#app div::-webkit-scrollbar-thumb:hover,
ul::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray);
}
</style>
