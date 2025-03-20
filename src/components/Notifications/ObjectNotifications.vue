<template>
  <div
    :class="[
      'object-notifications',
      StopClickOutsideClasses.headerNotification,
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.objectEventsList,
      StopClickOutsideClasses.tableTr,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.windowManager,
    ]"
  >
    <div class="object-notifications__wrapper" @click.stop.prevent>
      <UiLoader :loading="isLoadingNotifications" theme="page" />
      <NotificationCard
        v-for="noty in notificationsCards"
        :key="noty.Id"
        :notification-data="noty"
      />
    </div>

    <div class="object-notifications__buttons">
      <div></div>
      <div>
        <UiButton1 theme="secondary" @click="onClose">Закрыть</UiButton1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetNotificationsForObject } from '@/core/api/notifications.api'
import type { IObjectDto } from '@/core/interface/Object'
import type { INotification } from '@/core/interface/Notifications'
import { buildNotificationCardItem } from '@/core/model/NotificationCard'
import NotificationCard from '../Notifications/NotificationCard.vue'
import UiLoader from '../Ui/DataDisplay/UiLoader.vue'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const props = defineProps<{
  object: IObjectDto
}>()

const emits = defineEmits(['close'])

const notifications = ref<INotification[]>([])
const notificationsCards = computed(() =>
  notifications.value.map((item) => buildNotificationCardItem(item)),
)
const isLoadingNotifications = ref(true)

const loadNotifications = async () => {
  isLoadingNotifications.value = true

  GetNotificationsForObject({
    ObjectId: props.object.BaseObjectId,
    ObjectType: props.object.BaseObjectType,
  })
    .then((result) => {
      if (!result?.data) {
        console.error('Cant load notifications')
        return
      }

      notifications.value = result.data.Items
    })
    .finally(() => {
      isLoadingNotifications.value = false
    })
}

loadNotifications()

const onClose = () => {
  emits('close')
}
</script>

<style scoped lang="scss">
.object-notifications {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 60px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.object-notifications__wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  overflow-y: auto;
}

.object-notifications__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 8px;
}

.object-notifications__notification {
  display: flex;
  flex-direction: column;
}
</style>
