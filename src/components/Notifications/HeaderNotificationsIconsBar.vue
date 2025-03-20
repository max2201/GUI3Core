<template>
  <div class="notificationsBar">
    <div
      v-for="(item, index) in notificationsBarArray"
      :key="item.type"
      @click.stop="openNotifications(item.type, index, $event)"
      :class="['notificationsBar__item', { _active: activeIndex === index }]"
    >
      <div class="notificationsBar__item-icon">
        <SvgIcon :name="item.iconType" />
      </div>
      <div class="notificationsBar__item-count">
        {{ item.count }}
      </div>
      <div v-if="item.newCount" class="notificationsBar__item-newCount">+{{ item.newCount }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'
import { onUnmounted } from 'vue'
import { NotificationsConst } from '@/core/constants/Notifications'
import { useNotificationsStore } from '@/core/store/notifications.store'
const notifications = useNotificationsStore()
const activeIndex = ref(-1)

const clearActiveIndex = () => {
  activeIndex.value = -1
}

const getNotificationsBar = (): void => {
  notifications.getNotificationsBar()
}

const setOffsetRight = (event) => {
  const targetDiv = event.target.closest('.notificationsBar__item')
  const marginRight = window.innerWidth - (targetDiv.offsetLeft + targetDiv.offsetWidth)

  notifications.marginRightNotificationsBlock = `${marginRight}px`
}

const openNotifications = async (type: number, index: number, event: any): Promise<void> => {
  if (notifications.showNotificationsOnHeader && activeIndex.value === index) {
    clearActiveIndex()
    notifications.closeNotifications()
  } else {
    if (activeIndex.value !== -1) {
      clearActiveIndex()
    }
    //Отступ у блока справа
    setOffsetRight(event)
    await notifications.getNotificationGroup(type)
    activeIndex.value = index
    notifications.toggleNotificationsOnHeader(true)
  }
}

const throttledNotificationsBar = throttle(getNotificationsBar, NotificationsConst.RequestInterval)

// Делаем запрос каждые 30 секунд
const intervalNotificationsBar = setInterval(
  throttledNotificationsBar,
  NotificationsConst.RequestInterval
)

const notificationsBarArray = computed(() => {
  return notifications.notificationsBarArray
})

onMounted(() => {
  getNotificationsBar()
})

onUnmounted(() => {
  clearInterval(intervalNotificationsBar)
})
</script>
