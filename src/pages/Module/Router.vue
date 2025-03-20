<template>
  <Suspense>
    <template #default>
      <TablePage v-if="module?.IsTableModule" :module="module" />
      <Dashboard v-else-if="module?.Id === DashboardModuleId" />
      <notificationsTable v-else-if="module?.Id === NotificationsModuleId" />
      <kanban v-else-if="module?.Id === 'KanbanTasks'" />
      <template v-else>Не табличный модуль {{ module }}</template>
    </template>

    <template #fallback>
      <UiLoader :loading="true" theme="page" />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { TablePage } from '@/pages/Module'
import { RouteMeta } from '@/core/config'
import { DashboardModuleId } from '@/core/constants/DashboardModuleId'
import { NotificationsModuleId } from '@/core/constants/ModuleId'

const moduleStore = useModuleStore()
const route = useRoute()

const module = computed(() => {
  const { id, sid } = route.params

  return moduleStore.getCurrentModule(id as string, sid as string)
})

useHead({
  title: RouteMeta.module.index.title,
  meta: RouteMeta.module.index.meta,
})
</script>
