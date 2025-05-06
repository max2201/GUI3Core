<template>
  <div ref="pageRef" class="table-object">
    <h3 class="table-title">
      <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24"></UiButton1>
      <span>{{ tableNames }}</span>
    </h3>
    <UiLoader v-if="loading" theme="page" loading />
    <div class="table-object__content" v-if="dataset.length || isLoadingTableData">
      <Table
        :show-loader="isLoadingTableData"
        :table-state="localTableState"
        :dataset-snapshot="datasetSnapshot"
        :dataset-meta="datasetMeta"
        :dataset="dataset"
        @click-header-cell="sortColumn"
        @dblclick-row="openObjectLiteView"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  IObjectDto,
  IObjectStep,
  IObjectStepField,
  IObjectTable,
  IObjectTableColumn,
} from '@/core/interface/Object'
import { useTableState } from '@/composables/use-table-state'
import type {
  ITableRow,
  ITableCell,
  ITableCellHead,
  ITableDatasetMeta,
} from '@/core/interface/Table'
import { GetDtoObjectsForCustomTable } from '@/core/api/modules.api'
import type { GetDtoObjectsForCustomTablePayload } from '@/core/api/modules.api'
import type { ISelect, SortingDirectionType } from '@/core/interface/Ui'
import type { LiteViewArgs } from '@/core/interface/LiteView'
import { useToast } from 'vue-toastification'
import type { IClientDto } from '@/core/interface/Client'

const toast = useToast()

const props = defineProps<{
  object: IClientDto
  tableKey: string
  tableName?: string
  loading?: boolean
}>()

const tables = computed(() => {
  return props.object?.AdditionalTables || []
})

const currentTable = computed<IObjectTable | undefined>(() =>
  tables.value.find((table) => table.ViewId === props.tableKey),
)
const tableNames = computed(() => {
  return currentTable.value.TabName
})
const datasetSnapshot = computed<ITableCellHead[]>(() => {
  return (
    currentTable.value?.CurrentColumns.map((column: IObjectTableColumn) => ({
      id: column.Id,
      width: column.Width,
      label: column.Title,
      sort: column.Id,
    })) || []
  )
})

const DEFAULT_SORT_LIMIT = 50

const localTableState = useTableState()
const dataset = ref<ITableRow[]>([])

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

const clearTableData = () => {
  dataset.value = []
  datasetMeta.value.page = DEFAULT_DATASET_META.page
  datasetMeta.value.count = DEFAULT_DATASET_META.count
  datasetMeta.value.limit = DEFAULT_DATASET_META.limit
  datasetMeta.value.sort.id = DEFAULT_DATASET_META.sort.id
  datasetMeta.value.sort.dir = DEFAULT_DATASET_META.sort.dir
}

const isLoadingTableData = ref(true)

const loadTableData = () => {
  if (!currentTable.value) return
  isLoadingTableData.value = true
  GetDtoObjectsForCustomTable({
    BaseObjectId: props.object.BaseObjectId,
    ViewId: currentTable.value.ViewId,
    PageSize: 20,
    PageNumber: 1,
    SortColumn: datasetMeta.value.sort.id,
    SortMode: datasetMeta.value.sort.dir === 'DESC' ? 1 : 0,
  } as GetDtoObjectsForCustomTablePayload)
    .then((result) => {
      if (!result?.data || result.error) {
        toast.error('Ошибка при загрузке дополнительной информации: ', result.error)
        return
      }

      dataset.value = result.data.Rows.map(
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
              presentation: {
                background: cell.BackColor,
                text: cell.TextColor,
              },
            })),
          }) as ITableRow,
      )

      datasetMeta.value.count = result.data.TotalCount
    })
    .catch((err) => {
      toast.error('Ошибка при загрузке дополнительной информации')
    })
    .finally(() => {
      isLoadingTableData.value = false
    })
}

const sortColumn = async (data: any) => {
  const direction =
    datasetMeta.value.sort.id === data.id
      ? datasetMeta.value.sort.dir === 'ASC'
        ? 'DESC'
        : 'ASC'
      : data.sortDir || datasetMeta.value.sort.dir

  datasetMeta.value.sort.dir = direction
  datasetMeta.value.sort.id = data.id

  loadTableData()
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

const pageRef = ref(null)

const openObjectLiteView = (item: ITableRow, e: Event) => {
  if (!pageRef.value) return

  const rect = (pageRef.value as HTMLElement).getBoundingClientRect()
  EventBus.emit(GlobalEvents.OpenLiteView, {
    e: e as MouseEvent,
    top: rect.top,
    left: rect.right - 690,
    height: rect.bottom - rect.top - 60,
    width: 690,
    objectId: item.id,
    baseObjectType: currentTable.value?.LinkedObjectsType,
    baseObjectName: String(currentTable.value?.LinkedObjectsType),
  } as LiteViewArgs)
}

onMounted(() => {
  loadTableData()

  if (currentTable.value?.SortedColumn && currentTable.value?.SortedDirection) {
    datasetMeta.value.sort.id = currentTable.value.SortedColumn
    datasetMeta.value.sort.dir = currentTable.value.SortedDirection ? 'DESC' : 'ASC'
  }
})
</script>

<style lang="scss">
.table {
  width: 100%;
  border-collapse: collapse;

  &-title {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
  }
}
.table-object {
  display: grid;
  grid-template-columns: 100%;

  overflow: hidden;
}

.table-object__content {
  max-height: 350px;
  display: grid;
  grid-template-columns: 100%;
}
</style>
