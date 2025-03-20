<template>
  <div class="dashboardNotifications">
    <div class="dashboardNotifications__header">
      <div class="dashboardNotifications__header-title">
        <SvgIcon name="bell" class="mr-2" />
        Последние уведомления
      </div>
      <div class="dashboardNotifications__header-count element-pill">
        {{ dashboardNotifications.length }}
      </div>
      <div
        :style="`padding-right: ${dashboardNotifications.length > 3 ? '14px' : '0'} `"
        class="dashboardNotifications__header-filters"
      >
        <NotificationsFilters
          @update-notifications-filters="updateNotificationsFilters"
          component-type="dashboardNotifications"
        />
      </div>
    </div>
    <div class="dashboardNotifications__items" v-if="dashboardNotifications.length">
      <NotificationCard
        v-for="item in dashboardNotifications"
        :key="item.id"
        :notification-data="item"
        component-type="dashboardNotifications"
      />
    </div>
    <div class="empty" v-else>
      <img src="@/assets/img/empty.png" alt="" />
      <p>Ура! Пока нет новых уведомлений, можно немного расслабиться</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { cloneDeep } from 'lodash'
import { useNotificationsStore } from '@/core/store/notifications.store'
import { NotificationsConst } from '@/core/constants/Notifications'

const notifications = useNotificationsStore()

const requestArray = ref([...cloneDeep(NotificationsConst.DefaultArrayGroups)])

const dashboardNotifications = computed(() => {
  return notifications.dashboardNotificationsDataArray
})

const getDebounceNotifications = debounce((requestArray, componentName): void => {
  notifications.getNotificationsDashboard(requestArray, componentName)
}, 200)
//При запросе уведомлений с хедера они считаются и при отличии запрашивается новый список
watch(
  () => notifications.headerNotificationsCount,
  (headerNotificationsCount, oldValue) => {
    if (headerNotificationsCount !== oldValue) {
      getDebounceNotifications(requestArray.value, 'dashboardNotifications')
    }
  }
)

const updateNotificationsFilters = (array) => {
  requestArray.value = array
}

watch(
  () => requestArray.value,
  (requestArray, oldValue) => {
    if (requestArray && JSON.stringify(requestArray) !== JSON.stringify(oldValue)) {
      getDebounceNotifications([...requestArray], 'dashboardNotifications')
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss"></style>
