<template>
  <DashboardWidgetGroup class="dashboard-notifications">
    <template #title>
      <div class="dashboard-notifications__header-title">
        <SvgIcon name="bell" class="mr-2" />
        Последние уведомления
      </div>
      <div class="dashboard-notifications__header-count element-pill">
        {{ dashboardNotifications.length }}
      </div>
    </template>
    <template #actions>
      <div class="dashboard-notifications__header-filters">
        <NotificationsFilters
          @update-notifications-filters="updateNotificationsFilters"
          component-type="dashboardNotifications"
        />
      </div>
    </template>
    <div class="dashboard-notifications__items" v-if="dashboardNotifications.length">
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
  </DashboardWidgetGroup>
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
  },
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
  { deep: true },
)
</script>

<style scoped lang="scss">
.dashboard-notifications {
  &__header {
    display: flex;
    align-items: center;

    &-title {
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: var(--font-weight-600);
      font-size: var(--font-size-16);
      line-height: 130%;
      user-select: none;

      svg {
        font-size: 20px;
        margin-right: 4px;

        &:hover {
          cursor: default;
        }
      }
    }

    &-count {
      margin-right: 40px;
    }

    &-filters {
      display: flex;
      margin-left: auto;
    }
  }


  &__items {
    &::-webkit-scrollbar {
      background-color: var(--component-background) !important;
    }

    &::-webkit-scrollbar-track {
      background: var(--component-background) !important;
    }

    &::-webkit-scrollbar-thumb {
      border-color: var(--component-background) !important;
    }
    display: block;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 50px;
    max-height: 300px;
  }

  &__header-filters {
    transition: 0.3s ease all;
  }
}
</style>
