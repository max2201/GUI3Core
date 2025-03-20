<template>
  <div class="notifications-wrapper">
    <div class="notifications" v-if="componentType !== 'tasks'">
      <NotificationCard
        v-for="item in notificationArray"
        :key="item.id"
        :notification-data="item"
        :component-type="props.componentType"
        @delete="deleteNotification(item.id)"
        @open-objects="openWindowManagerWithObject"
      />
      <div
        v-if="notifications.notificationsCount > NotificationsConst.RequestViewNotifications"
        class="action"
      >
        <RouterLink to="/desktop/Notifications">
          Посмотреть еще {{ notificationsCount }}
        </RouterLink>
      </div>
    </div>
    <div v-else class="tasks">
      <taskCard v-for="(task, index) in tasksArray" :key="index" :task-data="task" />
      <div
        v-if="tasks.countTasksOnHeader > NotificationsConst.RequestViewNotifications"
        class="action"
      >
        <RouterLink to="/desktop/KanbanTasks"> Посмотреть еще {{ tasksCount }} </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getTaskWord } from '@/core/utils/getTaskWord'
import { useNotificationsStore } from '@/core/store/notifications.store'
import { NotificationsConst } from '@/core/constants/Notifications'
import type { UiNotificationsGroupItem } from '@/core/interface/Ui'
import { GetObjectDto } from '@/core/api/object.api'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'

import { useTasksStore } from '@/core/store/tasks.store'
import { createObjectInstance } from '@/core/services/createObjectInstance'
const tasks = useTasksStore()

const props = defineProps<{
  componentType: string
}>()

const notifications = useNotificationsStore()
const notificationArray = computed(() => {
  return notifications.notificationsDataArray
})

const tasksArray = computed(() => {
  return tasks.tasksHeaderArray
})
const notificationsCount = computed(() => {
  return getTaskWord(
    notifications.notificationsCount - NotificationsConst.RequestViewNotifications,
    ['уведомление', 'уведомления', 'уведомлений']
  )
})
const tasksCount = computed(() => {
  return getTaskWord(tasks.countTasksOnHeader - NotificationsConst.RequestViewNotifications, [
    'задача',
    'задачи',
    'задач',
  ])
})

watch(
  () => props.componentType,
  (componentType) => {
    if (componentType === 'tasks') {
      tasks.getTasksOnHeader(5, 1)
    } else {
      if (tasks.tasksHeaderArray.length) {
        tasks.tasksHeaderArray = []
      }
    }
  },
  { deep: true, immediate: true }
)

const deleteNotification = (notificationId: number) => {
  notifications.deleteNotification([notificationId], props.componentType)
}

const windowStore = useWindowStore()
const sharedModals = useSharedModalsStore()

const openWindowManagerWithObject = async (item: UiNotificationsGroupItem) => {
  const object = createObjectInstance(item.objectId, item.objectType)
  notifications.closeNotifications()
  windowStore.addTab({
    id: object.id,
    title: `${item.title}`,
    type: object.type,
    data: object.rawData,
    object,
  })
}
</script>
