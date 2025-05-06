<template>
  <UiModal
    :name="ModalTableModal"
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
    <div class="modal-table">
      <h3 class="mb-6">{{ params?.title }}</h3>
      <p class="mb-4">{{ params?.description }}</p>
      <div class="modal-table__table mb-4">
        <Table
          :dataset="tableDataSet"
          :table-state="localTableState"
          :dataset-snapshot="dataSetSnapShot"
          :dataset-meta="datasetMeta"
          :has-action-cell="isConflict || isConflictNumber"
          :isActiveBatchEditing="isConflict || isConflictNumber"
          :sticky-cell="isConflict || isConflictNumber"
          :is-bath-edit-one="isConflict || isConflictNumber"
        />
      </div>
      <div class="modal-table__select" v-if="isConflict || isConflictNumber">
        <UiSelect1
          v-if="isConflict"
          :model-value="conflictSelectValue"
          :options="conflictActions"
          @update:model-value="handleConflictActions"
          select-label="Возможные варианты"
        >
        </UiSelect1>
        <UiSelect1
          v-if="isConflictNumber"
          :model-value="conflictNumberSelectValue"
          :options="conflictActionsNumber"
          @update:model-value="handleConflictActionsNumber"
          select-label="Возможные варианты"
        >
        </UiSelect1>
        <UiInput1
          :disabled="!(conflictNumberSelectValue.value === 'addContact' && isConflictNumber)"
          label="Кем приходится"
        ></UiInput1>
      </div>
    </div>
    <template #buttons>
      <div class="modal-table__actions" v-if="modalParams?.isActions">
        <div>
          <UiButton1 size="large" theme="secondary" variant="outline" @click="close">
            Закрыть
          </UiButton1>
        </div>
        <div>
          <UiButton1 size="large" :disabled="!canSave" @click="SaveHandler"> Сохранить </UiButton1>
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
import type {
  ITableCell,
  ITableCellHead,
  ITableDatasetMeta,
  ITableRow,
} from '@/core/interface/Table'
import type { SortingDirectionType } from '@/core/interface/Ui'
import type { IObjectTableColumn } from '@/core/interface/Object'
import { ModalTableModal } from '@/core/constants/ModalsNames'
import { TableCellTypes } from '@/core/constants/TableCellTypes'
const localTableState = useTableState()
const params = ref(modalParams)
const tableDataSet = ref<ITableRow[]>([])
const dataSetSnapShot = ref<ITableCellHead[]>([])
const isConflict = computed(() => params.value?.type === 'conflict')
const isConflictNumber = computed(() => params.value?.type === 'conflict-number')

const canSave = computed(() => {
  return localTableState.selectedBatchIds.value.length || !isConflict.value
})
const conflictActions = [
  {
    label: 'Подставить существующего клиента',
    value: 'replace',
  },
  {
    label: 'Оставить без изменений',
    value: 'add',
  },
]
const conflictActionsNumber = [
  {
    label: 'Добавить как контактное лицо',
    value: 'addContact',
  },
  {
    label: 'Сохранить как личный номер клиента',
    value: 'add',
  },
]
const conflictSelectValue = ref(conflictActions[0])
const conflictNumberSelectValue = ref(conflictActionsNumber[0])
const handleConflictActions = (value) => {
  conflictSelectValue.value = value
}
const handleConflictActionsNumber = (value) => {
  conflictNumberSelectValue.value = value
}
const generateNewTable = () => {
  dataSetSnapShot.value = params.value?.data?.CurrentColumns.map((column: IObjectTableColumn) => ({
    id: column.Id,
    width: column.Width || 100,
    label: column.Title,
    sort: column.Id,
  }))
  console.log(params.value?.data?.CurrentRows)
  tableDataSet.value = params.value?.data?.CurrentRows?.map(
    (row) =>
      ({
        title: row.Title,
        color: row.Color,
        id: row.Id,
        cells: row.Cells.map((cell, index) => ({
          id: String(index),
          value: cell.Value,
          type: cell.CellType,
        })),
      }) as ITableRow,
  )
}

const DEFAULT_SORT_LIMIT = 20
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

const SaveHandler = () => {
  console.log(isConflict.value)
  if (isConflict.value) {
    if (conflictSelectValue.value.value === 'replace') {
      console.log(conflictSelectValue.value.value)
      modalParams.value?.onSave?.(localTableState.selectedBatchIds.value)
    } else {
      modalParams.value?.onSave?.(false)
      console.log(false)
    }

    return
  } else if (isConflictNumber.value) {
    if (conflictNumberSelectValue.value.value === 'addContact') {
      console.log(localTableState.selectedBatchIds.value)
      modalParams.value?.onSave?.(localTableState.selectedBatchIds.value)
    } else {
      modalParams.value?.onSave?.(true)
    }
  } else {
    modalParams.value?.onSave(true)
  }
}
</script>

<style lang="scss" scoped>
.modal-table {
  &__actions {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
  &__select {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }

  &__table {
    max-height: 400px;
    overflow-y: auto;
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
