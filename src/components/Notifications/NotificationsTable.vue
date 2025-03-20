<template>
  <div class="notifications-table">
    <div class="notificationTable__header">
      <div class="notification-search">
        <UiInput1
          :additional-class="['notification-search__input']"
          v-model="filterName"
          placeholder="Поиск..."
          icon="search"
          icon-position="left"
        />
      </div>
      <NotificationsFilters
        @update-notifications-filters="updateNotificationsFilters"
        component-type="notificationsTable"
      />
      <div class="notification-filters">
        <UiCheckbox1 v-model="overdue"> Только просроченные </UiCheckbox1>
      </div>
      <div class="notification-pagination">
        <UiPagination :value="moduleDatasetMeta" @onChange="paginationSelect" />
      </div>
      <div class="notification-count">
        Всего: <span>{{ notifications.rowsCount }}</span>
      </div>
    </div>

    <Table
      :dataset="notificationDataSet"
      :table-state="localTableState"
      :dataset-snapshot="notificationDataSetSnapShot()"
      :dataset-meta="moduleDatasetMeta"
      has-action-cell
      sticky-cell
    />
  </div>
</template>
<script setup lang="ts">
import { useNotificationsStore } from '@/core/store/notifications.store'
import { useConfigurationStore } from '@/core/store/configuration.store'
import { useTableState } from '@/composables/use-table-state'
import type { ITableRow } from '@/core/interface/Table'
import { TableCellTypes } from '@/core/constants/TableCellTypes'
import type { SortingDirectionType } from '@/core/interface/Ui'

const moduleStore = useModuleStore()
moduleStore.getModuleState()

const notifications = useNotificationsStore()

const configurationStore = useConfigurationStore()

const filters = ref([])

const overdue = ref(false)

const filterName = ref('')

const notificationDataSet = computed(() => {
  return notifications.notificationsRows.map((notificationsRow: any) => {
    return {
      id: notificationsRow.Id,
      title: notificationsRow.Title,
      color: notificationsRow.Color,
      cells: notificationsRow.Cells.map((Cell, index) => {
        let value = Cell.Value

        if (Cell.CellType === TableCellTypes.BaseObject && Cell.Value) {
          value = JSON.parse(Cell?.Value)
        }

        return {
          id: index,
          value,
          type: Cell.CellType,
          width: undefined,
          presentation: {
            background: Cell.BackColor,
            text: Cell.TextColor,
          },
        }
      }),
    } as ITableRow
  })
})

const test = () => {
  overdue.value = !overdue.value
}

watch(
  () => filterName.value,
  () => {
    notifications.getNotificationsTable(filters.value, notifications.activePage, filterName.value)
  },
)

watch(
  () => overdue.value,
  (overdue) => {
    notifications.toggleOnlyOverdue(overdue)
    notifications.getNotificationsTable(filters.value, notifications.activePage, filterName.value)
  },
)

const notificationDataSetSnapShot = () => {
  return configurationStore.NotificationsTableSetting[0].Columns.map((item) => {
    return {
      id: item.Id,
      width: parseInt(item.Width),
      label: item.Title,
      sort: item.SortProperty,
      sortDir: item.SortedDirection,
    }
  })
}
const updateNotificationsFilters = (val) => {
  filters.value = val
  notifications.getNotificationsTable(val)
}
const moduleDatasetMeta = computed(() => {
  return {
    count: notifications.rowsCount,
    limit: 100,
    page: notifications.activePage,
    sort: { id: 'A610A6FE-CF91-4036-AD99-15FD0EB7A90C', dir: 'DESC' as SortingDirectionType },
  }
})

const paginationSelect = async (page: number) => {
  await notifications.getNotificationsTable(filters.value, page)
}

const localTableState = useTableState()
</script>
