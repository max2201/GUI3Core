<!-- @/components/ExistLockModal.vue -->
<template>
  <UiModal
    name="confirm-merge"
    :isCustomForm="modalParams?.isActions"
    @opened="generateNewTable"
    size="large"
    :class="[
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.objectEventsList,
      StopClickOutsideClasses.tableTr,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.windowManager,
    ]"
  >
    <div class="confirm-merge">
      <h3 class="mb-6">Изменение данных клиента</h3>
      <Table
        :dataset="TableDataSet"
        :table-state="localTableState"
        :dataset-snapshot="mergeDataSetSnapShot()"
        :dataset-meta="moduleDatasetMeta"
        :has-action-cell="true"
        :isActiveBatchEditing="true"
        sticky-cell
      />
    </div>
    <template #buttons>
      <div class="confirm-merge__actions" v-if="modalParams?.isActions">
        <div>
          <UiButton1 size="large" theme="secondary" variant="outline" @click="close">
            Закрыть
          </UiButton1>
        </div>
        <div>
          <UiButton1 size="large" @click="forceUnlock"> Сохранить </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const sharedModals = useSharedModalsStore()
const { modalParams } = storeToRefs(sharedModals)

import { useTableState } from '@/composables/use-table-state'
import type { ITableDatasetMeta, ITableRow } from '@/core/interface/Table'
import { TableCellTypes } from '@/core/constants/TableCellTypes'
import type { SortingDirectionType } from '@/core/interface/Ui'

const localTableState = useTableState()
const data = ref(modalParams)
const TableDataSet = ref<ITableRow[]>([])
const tableHeader = ['Название', 'Текущие значение', 'Новое значение']
const generateNewTable = () => {
  const newObj = {}
  const selectedBatchIds = []
  Object.entries(data.value?.data).forEach(([key, value]) => {
    selectedBatchIds.push(key)
    newObj[key] = {
      ...value,
      id: key,
      checked: value.Checked,
      cells: [
        {
          type: TableCellTypes.text,
          value: value.Name,
        },
        {
          type: TableCellTypes.text,
          value: value.DisplaySource,
        },
        {
          type: TableCellTypes.text,
          value: value.DisplayTarget,
        },
      ],
    }
  })
  TableDataSet.value = newObj
  localTableState.selectedBatchIds.value = selectedBatchIds
}

const mergeDataSetSnapShot = () => {
  return tableHeader.map((item, id) => {
    return {
      id: id,
      label: item,
    }
  })
}
const moduleDatasetMeta = computed(() => {
  return {
    count: 12,
    limit: 20,
    page: 1,
    sort: { id: 'A610A6FE-CF91-4036-AD99-15FD0EB7A90C', dir: 'DESC' as SortingDirectionType },
  }
})

const close = () => {
  modalParams.value?.onCancel?.()
}

const forceUnlock = () => {
  const newObj = {}
  Object.entries(data.value?.data).forEach(([key, value]) => {
    let isSelect = false
    if (localTableState.selectedBatchIds.value.includes(key)) {
      isSelect = true
    }
    newObj[key] = {
      ...value,
      Checked: isSelect,
    }
  })
  modalParams.value?.onSave?.(newObj)
}
</script>

<style lang="scss" scoped>
.confirm-merge {
  &__actions {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  &__body {
    padding-top: 8px;
    padding-left: 8px;
  }

  &__text {
    margin-top: 18px;
  }
}
</style>
