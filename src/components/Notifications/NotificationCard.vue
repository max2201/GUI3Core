<template>
  <div
    v-if="notificationData"
    :class="[componentType === 'dashboardNotifications' && 'notification_card-dashboard']"
    class="notification_card"
    @click="openObject(notificationData)"
  >
    <div
      class="notification_card-close"
      @click.stop="preDeleteNotification(notificationData, $event)"
    >
      <SvgIcon name="close" />
    </div>

    <div
      v-if="componentType === 'dashboardNotifications'"
      :class="`color-${notificationData.valueType}`"
      class="notification_card-icon"
    >
      <SvgIcon :name="`iconNotificationBar-${notificationData.groupType}`" />
    </div>

    <div class="notification_card__info">
      <div
        :class="`color-${notificationData.valueType} bckColor-${notificationData.valueType}`"
        class="notification_card__info-header"
      >
        <h2>
          {{ notificationData.title }}: {{ notificationData.day }} {{ notificationData.time }}
        </h2>

        <div
          v-show="showHint"
          class="hint"
          @click.stop="deleteNotification(notificationData.id, $event)"
        >
          Нажмите сюда чтобы продолжить удаление
        </div>
      </div>

      <div :class="[componentType === 'dashboardNotifications' && 'notification_card__info-row']">
        <div
          v-if="notificationData.author"
          :title="notificationData.hintAuthor"
          class="notification_card__info-author"
        >
          <span>Кому:</span>
          <p>{{ notificationData.author }}</p>
        </div>
        <div v-if="notificationData.client" class="notification_card__info-client">
          <span>Клиент:</span>
          <BaseObjectLink :value="notificationData.clientData" />
        </div>
      </div>
      <div
        v-if="notificationData.text"
        :title="notificationData.hintText"
        class="notification_card__info-text"
      >
        <p>{{ notificationData.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { delay } from 'lodash'
import type { UiNotificationsGroupItem } from '@/core/interface/Ui'

const notifications = useNotificationsStore()

const props = defineProps<{
  notificationData: UiNotificationsGroupItem
  componentType: string
}>()

const emits = defineEmits(['open-object', 'delete'])

const showHint = ref(false)

const preDeleteNotification = (notification, event) => {
  if (!notification.quickDeleteAvailable) {
    showHint.value = true
    delay(() => {
      showHint.value = false
    }, 2000)
  } else {
    emits('delete')
    deleteNotification(notification.id, event)
  }
}

const addDeletedClasses = (event) => {
  const parentBlock = event.target.closest('.notification_card')
  parentBlock.classList.add('notification_card-delete')
}

const deleteNotification = (notificationId, event) => {
  addDeletedClasses(event)

  delay(() => {
    emits('delete')
  }, 300)
}

const openObject = async (item) => {
  emits('open-object')
}
</script>
