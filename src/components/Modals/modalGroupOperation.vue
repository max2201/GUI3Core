<template>
  <UiModal
    :name="GroupOperationResult"
    :size="tableValue ? 'large' : 'normal'"
    @opened="object.LinkValue ? downloadFile(object.LinkValue) : ''"
    @close="handleCloseAddModal()"
    :is-form="true"
  >
    <div class="modal-group-operation">
      <template v-if="linkValue">
        <div class="modal-group-operation__image">
          <div class="modal-group-operation__image-scaler">
            <img src="@/assets/img/decor/notification-success.svg" alt="notification image" />
          </div>
        </div>
        <div class="modal-group-operation__body">
          <div class="modal-group-operation__title">
            {{ object.ResultDialogTitle || 'Скачивание файла' }}
          </div>
          <p class="modal-group-operation__description">
            {{ object?.ResultDescription }}
          </p>
          <div class="modal-group-operation__link">
            <p>
              {{ object?.ResultDescription }} если скачивание не началось перейдите по
              <a @click="downloadFile(object.LinkValue)" :href="object.LinkValue" type="download"
                >ссылке</a
              >
            </p>
          </div>
        </div>
      </template>
      <div v-if="tableValue">
        <h3 class="mb-5">
          {{ object.ResultDialogTitle || 'Результат групповой операции' }}
        </h3>

        <Table
          :dataset-snapshot="datasetSnapshot"
          :dataset-meta="datasetMeta"
          :table-state="localTableState"
          :dataset="datasetPerPage"
          :has-action-cell="false"
        />
        <div v-if="dataset.length > 10" class="modal-group-operation__pagination flex">
          <UiPagination :value="datasetMeta" @onChange="handlePaginationChange" />
          <div>
            Всего: <span>{{ dataset.length }}</span>
          </div>
        </div>
      </div>
      <template v-if="props.object?.BoolValue === true || props.object?.BoolValue === false">
        <div class="modal-group-operation__image">
          <div class="modal-group-operation__image-scaler">
            <img
              v-if="props.object?.BoolValue === true"
              src="@/assets/img/decor/notification-success.svg"
            />
            <img v-else src="@/assets/img/decor/notification-warning.svg" />
          </div>
        </div>
        <div class="modal-group-operation__body">
          <h3 class="modal-group-operation__title">
            {{ object.ResultDialogTitle || 'Результат групповой операции' }}
          </h3>

          <p class="modal-group-operation__description">
            {{ object?.ResultDescription }}
          </p>
        </div>
      </template>
    </div>

    <template #buttons> </template>
  </UiModal>
</template>

<script setup lang="ts">
import { GroupOperationResult } from '@/core/constants/ModalsNames'
import type { IModuleGroupOperations } from '@/core/interface/Module'
import type { ITableCellHead, ITableDatasetMeta, ITableRow } from '@/core/interface/Table'
import type { SortingDirectionType } from '@/core/interface/Ui'
import { useTableState } from '@/composables/use-table-state'

const sharedModals = useSharedModalsStore()
const localTableState = useTableState()
const props = defineProps<{
  object: IModuleGroupOperations
}>()

const linkValue = computed(() => {
  if (!props.object?.LinkValue) return undefined
  return props.object?.LinkValue
})
const tableValue = computed(() => {
  if (!props.object?.TableValue) return undefined
  return props.object?.TableValue
})
const dataset = computed(() => {
  if (!props.object?.TableValue) return undefined
  return tableValue.value?.CurrentRows.map(
    (row) =>
      ({
        title: row.Title,
        color: row.Color,
        id: row.Id,
        cells: row.Cells.map((cell, index) => ({
          id: String(index),
          value: cell.Value,
          type: cell.CellType,
          width: undefined,
          presentation: {
            background: cell.BackColor,
            text: cell.TextColor,
          },
        })),
      }) as ITableRow,
  )
})
const DEFAULT_SORT_LIMIT = 10
const currentPage = ref(1)
const datasetMeta = computed(() => {
  return {
    page: currentPage.value,
    count: dataset.value.length,
    limit: DEFAULT_SORT_LIMIT,
    sort: {
      id: null,
      dir: 'ASC' as SortingDirectionType,
    },
    isContextView: false,
  }
}) as Ref<ITableDatasetMeta>

const datasetSnapshot = computed<ITableCellHead[]>(() => {
  return (
    tableValue.value?.CurrentColumns.map((column) => ({
      id: column.Id,
      width: undefined,
      label: column.Title,
      sort: column.Id,
    })) || []
  )
})

const handlePaginationChange = (newPage: number) => {
  currentPage.value = newPage // Автоматически пересчитывает datasetPerPage
}

const datasetPerPage = computed(() => {
  if (!props.object?.TableValue) return undefined
  const startIndex = (datasetMeta.value.page - 1) * DEFAULT_SORT_LIMIT
  const endIndex = startIndex + DEFAULT_SORT_LIMIT
  return dataset.value.slice(startIndex, endIndex)
})

async function downloadFile(url) {
  const filename = url.substring(url.lastIndexOf('/') + 1)

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Ошибка при загрузке файла')
    const blob = await response.blob()

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

const handleCloseAddModal = () => {
  currentPage.value = 1
  sharedModals.closeModal()
}
</script>
<style scoped lang="scss">
.modal-group-operation {
  display: flex;

  &__image {
    flex: 0 0 170px;
    font-size: 0;
  }

  &__body {
    padding-top: 16px;
    padding-left: 30px;
  }

  &__title {
    font-size: 18px;
    font-weight: var(--font-weight-600);
    line-height: 1.3;
  }

  &__description {
    padding-top: 18px;
    font-size: var(--font-size-14);
    line-height: 1.3;
  }

  &__pagination {
    display: flex;
    justify-content: end;
    gap: 15px;
    align-items: center;
    margin-top: 16px;
    span {
      font-weight: bold;
    }
  }

  &__image-scaler {
    text-align: center;
  }

  &__link {
    font-size: var(--font-size-14);
    line-height: 1.3;

    p::first-letter {
      text-transform: uppercase;
    }
  }

  &__input {
    margin-top: 32px;
  }

  &__buttons {
    display: flex;
    justify-content: end;
    gap: 10px;
  }
}
</style>
