<template>
  <div class="dashboard-widget-table">
    <Table :dataset-snapshot="tableDatasetSnapshot" :dataset="tableDataset"></Table>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { IObjectTable, IObjectTableColumn } from '@/core/interface/Object'
import type { ITableRow } from '@/core/interface/Table'

const props = defineProps<{
  tableData: IObjectTable
}>()

const tableDatasetSnapshot = computed(() => {
  return (
    props.tableData?.CurrentColumns.map((column: IObjectTableColumn) => ({
      id: column.Id,
      width: column.Width,
      label: column.Title,
      sort: column.Id,
    })) || []
  )
})
const tableDataset = computed(() => {
  return (
    props.tableData?.CurrentRows.map(
      (row) =>
        ({
          title: row.Title,
          color: row.Color,
          id: row.Id,
          cells: row.Cells.map((cell, index) => ({
            id: String(index),
            value: cell.Value,
            type: cell.CellType,
            width: tableDatasetSnapshot.value[index].width,
            presentation: {
              background: cell.BackColor,
              text: cell.TextColor,
            },
          })),
        }) as ITableRow,
    ) || []
  )
})
const reloadData = () => {
  emit('reload-data')
}

const setNewGrouping = (groupField: string) => {
  emit('update:grouping', groupField)
}
const setNewDiffViewType = (diffViewType: string) => {
  emit('update:diffViewType', diffViewType)
}
const isDiffDropdownOpen = ref(false)
const diffDropdownRef = ref(null)
onClickOutside(diffDropdownRef, () => {
  isDiffDropdownOpen.value = false
})
const isGroupingDropdownOpen = ref(false)
const groupingDropdownRef = ref(null)
onClickOutside(groupingDropdownRef, () => {
  isGroupingDropdownOpen.value = false
})
</script>

<style lang="scss" scoped>
.dashboard-widget-table {
  overflow: hidden;
  display: flex;
  height: 100%;
  flex: 1;
}
</style>
