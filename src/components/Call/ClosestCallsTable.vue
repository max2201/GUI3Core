<template>
  <div class="closest-calls-table">
    <Table
      class="closest-calls-table__table"
      :show-loader="isLoadingTableData"
      :table-state="localTableState"
      :dataset-snapshot="datasetSnapshot"
      :dataset-meta="datasetMeta"
      :dataset="dataset"
      @click-header-cell="sortColumn"
      @dblclick-row="openCallInfo"
    />
    <div v-if="showPagination" class="closest-calls-table__pagination">
      <div v-if="showPaginator">
        <UiPagination :value="datasetMeta" @onChange="paginationSelect" />
      </div>
      <div class="closest-calls-table__perpage">
        <span>Выводить</span>
        <UiSelect1
          :model-value="pageOption"
          :options="perPageOptions"
          @update:model-value="handleSelectPerpage"
        />
      </div>
      <span> Всего: {{ datasetMeta.count }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectTable, IObjectTableColumn } from '@/core/interface/Object'
import type { ITableCellHead, ITableDatasetMeta, ITableRow } from '@/core/interface/Table'
import { useTableState } from '@/composables/use-table-state'
import type { ISelect, SortingDirectionType } from '@/core/interface/Ui'
import { WindowContentClass } from '@/core/constants/GlobalClassNames'
import { TableCellTypes } from '@/core/constants/TableCellTypes'
import type { CallObject } from '@/core/model/CallObject'
import type { LiteViewArgs } from '@/core/interface/LiteView'
import { onUnmounted } from 'vue'
import { defineExpose } from 'vue'

const props = defineProps<{
  tableData: IObjectTable | undefined
  objectId: number
}>()

let object: CallObject | undefined
const windowStore = useWindowStore()
const localTableState = useTableState()

const datasetSnapshot = computed<ITableCellHead[]>(() => {
  return (
    props.tableData?.CurrentColumns?.map((column: IObjectTableColumn) => ({
      id: column.Id,
      width: column.Width,
      label: column.Title,
      sort: column.Id,
    })) || []
  )
})
const dataset = computed<ITableRow[]>(() => {
  return (
    props.tableData?.CurrentRows?.map(
      (row) =>
        ({
          title: row.Title,
          color: row.Color,
          id: row.Id,
          cells: row.Cells.map((cell, index) => ({
            id: String(index),
            value: cell.Value,
            type: cell.CellType,
            width: datasetSnapshot.value[index].width,
            presentation:
              cell.CellType === TableCellTypes.Icon
                ? null
                : {
                    background: cell.BackColor,
                    text: cell.TextColor,
                  },
          })),
        }) as ITableRow,
    ) || []
  )
})

const DEFAULT_SORT_LIMIT = 50

const DEFAULT_DATASET_META = {
  page: 1,
  count: 0,
  limit: DEFAULT_SORT_LIMIT,
  sort: {
    id: null,
    dir: 'ASC' as SortingDirectionType,
  },
}
const datasetMeta = ref({
  page: DEFAULT_DATASET_META.page,
  count: DEFAULT_DATASET_META.count,
  limit: DEFAULT_DATASET_META.limit,
  sort: {
    id: DEFAULT_DATASET_META.sort.id,
    dir: DEFAULT_DATASET_META.sort.dir,
  },
}) as Ref<ITableDatasetMeta>
const showPaginator = computed(() => (datasetMeta.value.count || 1) / datasetMeta.value.limit > 1)
const showPagination = computed(() => datasetMeta.value.count && datasetMeta.value.count > 50)

const sortColumn = async (data: any) => {
  datasetMeta.value.sort.dir =
    datasetMeta.value.sort.id === data.id
      ? datasetMeta.value.sort.dir === 'ASC'
        ? 'DESC'
        : 'ASC'
      : data.sortDir || datasetMeta.value.sort.dir
  datasetMeta.value.sort.id = data.id
  await loadTableData()
}

const perPageOptions = computed(() => localTableState?.perPageOptions.value || [])
const pageOption = computed(() => {
  return perPageOptions.value.find((option) => option.value === datasetMeta.value.limit)
})

const handleSelectPerpage = async (v: ISelect) => {
  datasetMeta.value.page = 1
  datasetMeta.value.limit = +v.value

  await loadTableData()
}

const paginationSelect = async (page: number) => {
  datasetMeta.value.page = page

  await loadTableData()
}

const openCallInfo = (item: ITableRow) => {
  const windowContentDiv = Array.from(document.getElementsByClassName(WindowContentClass))[0]
  const windowContentRect = windowContentDiv.getBoundingClientRect()
  const windowContentTabsDiv = Array.from(document.getElementsByClassName('component-tabs'))[0]
  const windowContentTabsRect = windowContentTabsDiv.getBoundingClientRect()

  if (!windowContentTabsRect || !windowContentRect) {
    console.error('Не удалось открыть окно звонка - не найдено view')
    return
  }

  EventBus.emit(GlobalEvents.OpenLiteView, {
    top: windowContentTabsRect.bottom,
    left: document.body.clientWidth - 690,
    height: windowContentRect.bottom - windowContentTabsRect.bottom,
    width: 690,
    objectId: item.id,
    baseObjectType: props.tableData?.LinkedObjectsType,
    baseObjectName: item.title,
  } as LiteViewArgs)
}

const isLoadingTableData = ref(false)
const loadTableData = async () => {
  isLoadingTableData.value = true
  await object.loadTableData(datasetMeta.value)
  isLoadingTableData.value = false
}
defineExpose({ loadTableData })

watch(
  () => props.objectId,
  async (BaseObjectId) => {
    if (BaseObjectId === undefined) {
      object = undefined
      return
    }
    object = windowStore.objectByTabId(BaseObjectId)

    if (!object) {
      object = undefined
      return
    }

    if (props.tableData?.SortedColumn && props.tableData?.SortedDirection) {
      datasetMeta.value.sort.id = props.tableData.SortedColumn
      datasetMeta.value.sort.dir = props.tableData.SortedDirection ? 'DESC' : 'ASC'
    }

    if (props.tableData) {
      await loadTableData()
    }
  },
  {
    immediate: true,
  },
)

const tableHeight = ref('0px')
const setTableHeight = () => {
  const tableDiv = Array.from(document.getElementsByClassName('closest-calls-table'))[0]
  const windowContentDiv = Array.from(document.getElementsByClassName('call-main-page__content'))[0]

  const tableDivRect = tableDiv.getBoundingClientRect()
  const windowContentRect = windowContentDiv.getBoundingClientRect()
  tableHeight.value = `${windowContentRect.bottom - tableDivRect.top - (showPagination.value ? 16 + 50 : 16)}px${showPagination.value ? ' 50px' : ''}`
}

let callContentResizeObserver: ResizeObserver

const startWatchCallContentResize = () => {
  const windowContentDiv = Array.from(
    document.getElementsByClassName('call-main-page__content-main'),
  )[0]
  callContentResizeObserver = new ResizeObserver(setTableHeight)
  callContentResizeObserver.observe(windowContentDiv)
}

const endWatchCallContentResize = () => {
  if (callContentResizeObserver) {
    callContentResizeObserver.disconnect()
  }
}

onMounted(() => {
  startWatchCallContentResize()
})

onUnmounted(() => {
  endWatchCallContentResize()
})
</script>

<style scoped lang="scss">
.closest-calls-table {
  display: grid;
  grid-template-rows: v-bind(tableHeight);
}

.closest-calls-table__pagination {
  display: flex;
  align-items: center;
  gap: 20px;
}

.closest-calls-table__table {
  overflow: auto;
}

.closest-calls-table__perpage {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
