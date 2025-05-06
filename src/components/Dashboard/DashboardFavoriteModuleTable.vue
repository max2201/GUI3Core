<template>
  <DashboardWidgetGroup class="dashboard-fav-module-table">
    <template #title>
      <div class="favorite-module__icon">
        <SvgIcon :name="value.icon" />
      </div>
      <h3 class="favorite-module__title" :title="`${value.subtitle}: ${value.title}`">
        {{ value.subtitle }}: {{ value.title }}
      </h3>
    </template>
    <template #actions>
      <UiButton1
        v-if="!hideControls"
        style="transform: rotate(90deg); margin-right: auto"
        title="Свернуть"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="minimize-square"
        @click="hideModuleTable"
      ></UiButton1>
      <UiButton1
        class="dashboard-fav-module-table__filter-button"
        :class="{ 'dashboard-fav-module-table__filter-button--changed': filterHasChanges }"
        title="Фильтр"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="filter"
        @click="filterModalVisible = true"
      ></UiButton1>
      <UiButton1
        title="Обновить данные"
        :loading="moduleDatasetFetching"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="rotate-cw"
        @click="getTableRowsData"
      ></UiButton1>
      <UiButton1
        title="Перейти на страницу списка"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="external-link"
        @click="redirectToList"
      ></UiButton1>
    </template>
    <Table
      v-if="moduleDatasetSnapshot.length && tableDataset.length"
      :dataset-snapshot="moduleDatasetSnapshot"
      :dataset-meta="moduleDatasetMeta"
      :dataset="tableDataset"
      @dblclick-row="openWindowManger"
    />
    <div v-else>Нет данных</div>
    <div class="dashboard-fav-module-table__pagination-block">
      <UiPagination
        class="dashboard-fav-module-table__pagination"
        v-if="moduleDatasetSnapshot.length && tableDataset.length"
        :value="moduleDatasetMeta"
        @onChange="paginationSelect"
      ></UiPagination>
      <div class="dashboard-fav-module-table__total-count">
        Всего:
        <span class="dashboard-fav-module-table__total-count-value">{{
          moduleDatasetMeta?.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || 0
        }}</span>
      </div>
    </div>

    <UiLoader :loading="moduleDatasetFetching" theme="page" />
    <UiFieldDetialsModal
      anchor-id="defaultLayout"
      width="819px"
      :is-open="filterModalVisible"
      @close="filterModalVisible = false"
      hide-close
    >
      <template #content>
        <h3>Фильтрация данных</h3>
        <span>{{ value.subtitle }}: {{ value.title }}</span>
        <UiInput1
          :additional-class="['dashboard-fav-module-table__filters-search']"
          clearable
          v-model="moduleFilter.SmartFilterValue"
          icon="search"
          icon-position="left"
          placeholder="Поиск..."
          highlight-not-empty
          focus-on-mount
        />
        <div style="overflow: hidden; overflow-y: auto">
          <FilterFields
            :filter="moduleFilter"
            :showAdditionalFields="true"
            @update-filter-values="moduleFilter = $event"
          />
        </div>
      </template>
      <template #left-actions>
        <UiButton1 variant="outline" @click="resetFilter"> Сбросить</UiButton1>
      </template>
      <template #actions>
        <UiButton1 @click="submitFilter"> Применить</UiButton1>
      </template>
    </UiFieldDetialsModal>
  </DashboardWidgetGroup>
</template>

<script setup lang="ts">
import type { DashboardFavoritiesModuleItem } from '@/core/interface/Dashboard'
import { hexToRgb } from '@/core/utils/Color'
import { GetItems, GetModuleState } from '@/core/api/modules.api'
import type { ITableCell, ITableCellHead, ITableDatasetMeta } from '@/core/interface/Table'
import type { IModuleFilter, IModuleFilterField } from '@/core/interface/Auth'
import type { IModuleDto } from '@/core/interface/Module'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { cloneDeep } from 'lodash'
import merge from 'lodash/merge'

const props = defineProps<{
  value: DashboardFavoritiesModuleItem
  hideControls?: boolean
}>()
const emit = defineEmits(['redirect-to-list', 'hide-module-table'])
const redirectToList = () => {
  emit('redirect-to-list')
}
const hideModuleTable = () => {
  emit('hide-module-table')
}

const windowStore = useWindowStore()
const openWindowManger = async (item: any) => {
  const currentModule = moduleStore.findModuleById(props.value.id) as IModuleDto

  const object = createObjectInstance(item.id, currentModule.BaseObjectType)
  await object.loadData()
  windowStore.addTab({
    id: object.id,
    title: object.rawData?.WindowTitle,
    type: object.type,
    data: object.rawData,
    object,
  })
}

const backgroundRGB = computed(() => hexToRgb(props.value.backgroundColor))
const backgroundColorRGBA = computed(() => {
  if (!backgroundRGB.value) return ''

  return `rgba(${backgroundRGB.value.r}, ${backgroundRGB.value.g}, ${backgroundRGB.value.b}, .9)`
})
const backgroundHoverColorRGBA = computed(() => {
  if (!backgroundRGB.value) return ''

  return `rgba(${backgroundRGB.value.r}, ${backgroundRGB.value.g}, ${backgroundRGB.value.b}, .99)`
})

const iconBackground = computed(() => props.value.iconColor)
const iconColor = computed(() => {
  return props.value.backgroundColor.toLowerCase() === '#ffffff'
    ? 'var(--color-font)'
    : 'var(--color-font-invert)'
})
const iconBorder = computed(() => {
  return props.value.backgroundColor.toLowerCase() === '#ffffff'
    ? '1px solid var(--color-border)'
    : ''
})

const moduleDatasetSnapshot = ref<ITableCellHead[]>([]) // снапшот колонок
const DEFAULT_SORT_LIMIT = 100
const moduleDatasetMeta = ref({
  page: 1,
  count: 0,
  limit: DEFAULT_SORT_LIMIT,
  sort: {
    id: null,
    dir: 'ASC',
  },
  isContextView: false,
}) as Ref<ITableDatasetMeta>
const tableDataset = ref([])
const moduleDatasetFetching = ref(false)
const moduleFilter = ref<IModuleFilter>()
const initialModuleFilter = ref<IModuleFilter>()
const getTableData = async () => {
  try {
    const { data, error } = await GetModuleState({
      ViewId: '',
      ModuleId: props.value.id,
    })
    initialModuleFilter.value = data.Filter
    moduleFilter.value = cloneDeep(initialModuleFilter.value)
    moduleDatasetSnapshot.value = data.CurrentColumns.map((column) => {
      return {
        id: column.Id,
        label: column.Title,
        width: column.Width * 1.3,
      }
    })
    moduleDatasetMeta.value.page = data.PageNumber
    moduleDatasetMeta.value.count = 0
    moduleDatasetMeta.value.limit = data.PageSize
    moduleDatasetMeta.value.sort.id = data.SortedColumn
    moduleDatasetMeta.value.sort.dir = data.SortedDirection === 1 ? 'DESC' : 'ASC'
    moduleDatasetMeta.value.isContextView = data.AvailableContextView
  } catch (error) {
    console.error('Error loading table data', error)
  }
}
const moduleStore = useModuleStore()
const getTableRowsData = async () => {
  moduleDatasetFetching.value = true
  const request = {
    ViewId: '',
    ModuleId: props.value.id,
    PageNumber: moduleDatasetMeta.value.page,
    PageSize: moduleDatasetMeta.value.limit,
    SortColumn: moduleDatasetMeta.value.sort.id,
    SortMode: moduleDatasetMeta.value.sort.dir === 'ASC' ? 0 : 1,
    Filter: moduleStore.getFilterDTO(initialModuleFilter.value),
  }
  try {
    const { data: itemsData, error: itemsError } = await GetItems(request)
    moduleDatasetMeta.value.count = itemsData.TotalCount
    const { Rows } = itemsData
    tableDataset.value = []
    Rows.forEach((row) => {
      const mappedCells = row.Cells.map((cell) => {
        // базовый обьект содержит значения из листа данных и найстройки отображения
        const cellReturnable = {
          value: cell.Value,
          type: cell.CellType,
          presentation: {
            background: cell.BackColor === '#FFFFFF' ? '' : cell.BackColor,
            text: cell.TextColor || '',
          },
        } as ITableCell

        // конвертация ячеек с флагами
        if (cell.CellType === 3 && cell.Value) {
          cellReturnable.value = JSON.parse(cell.Value)
        }

        return cellReturnable
      })
      tableDataset.value.push({
        id: row.Id,
        title: row.Title,
        color: row.Color,
        cells: mappedCells.filter((x) => x.id !== '000x000'),
      })
    })
    moduleDatasetFetching.value = false
  } catch (error) {
    console.error('Error loading table data', error)
    moduleDatasetFetching.value = false
  }
}
const paginationSelect = async (page: number) => {
  moduleDatasetMeta.value.page = page
  await getTableRowsData()
}

onMounted(async () => {
  await getTableData()
  await getTableRowsData()
})

const ui = useUiStore()
const { filterOpened } = storeToRefs(ui)

const resetFilter = async () => {
  resetFilterValues()
  filterModalVisible.value = false
  await getTableRowsData()
}

const submitFilter = async () => {
  initialModuleFilter.value = merge(initialModuleFilter.value, moduleFilter.value)
  await getTableRowsData()
  filterModalVisible.value = false
}

const filterModalVisible = ref(false)

const resetFilterValues = () => {
  initialModuleFilter.value?.PrimaryFields.map((field) => {
    field.currentVal = field.defaultVal

    if (!field.subItems) {
      return
    }

    field.subItems.forEach((subField) => {
      subField.currentVal = subField.defaultVal
    })
  })

  initialModuleFilter.value?.SecondaryFields.map((field) => {
    field.currentVal = field.defaultVal

    if (!field.subItems) {
      return
    }

    field.subItems.forEach((subField) => {
      subField.currentVal = subField.defaultVal
    })
  })

  if (initialModuleFilter.value?.SmartFilterValue) {
    initialModuleFilter.value.SmartFilterValue = ''
  }
  moduleFilter.value = cloneDeep(initialModuleFilter.value)
}

const filterHasChanges = computed(() => {
  if (!initialModuleFilter.value) return false

  if (initialModuleFilter.value.SmartFilterValue) {
    return true
  }

  if (
    initialModuleFilter.value.PrimaryFields.find((field) => field.currentVal !== field.defaultVal)
  ) {
    return true
  }

  if (
    initialModuleFilter.value.SecondaryFields.find((field) => field.currentVal !== field.defaultVal)
  ) {
    return true
  }

  const subfields = [
    ...initialModuleFilter.value.PrimaryFields.filter((field) => field.subItems).reduce(
      (acc, field) => {
        if (!field.subItems) return acc

        acc.push(...field.subItems)
        return acc
      },
      [] as IModuleFilterField[],
    ),
    ...initialModuleFilter.value.SecondaryFields.filter((field) => field.subItems).reduce(
      (acc, field) => {
        if (!field.subItems) return acc

        acc.push(...field.subItems)
        return acc
      },
      [] as IModuleFilterField[],
    ),
  ]

  if (subfields.find((subField) => subField.currentVal !== subField.defaultVal)) {
    return true
  }

  return false
})
</script>

<style scoped lang="scss">
.dashboard-fav-module-table {
  &__filter-button {
    &--changed {
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        width: 7px;
        height: 7px;
        background: #f8393a;
        border-radius: 50%;
      }
    }
  }

  &__modal-content {
    :deep(.fields) {
      //grid-template-columns: repeat(4, 1fr);
    }
  }

  :deep(.dashboard-widget-group__head) {
    border: none;
  }

  :deep(.dashboard-widget-group__widgets) {
    padding: 0;
  }

  &__filter {
    &--active {
      color: var(--input-hover-background-color) !important;
    }
  }

  &__filters-block {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 0 20px;
  }

  &__filters-search {
    flex: 1;
  }

  &__filter-actions {
    align-items: center;
    gap: 4px;
  }

  &__pagination-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 0 20px 12px;
  }

  &__total-count {
    display: flex;
    gap: 3px;
    font-size: var(--font-size-14);

    &-value {
      font-weight: var(--font-weight-600);
    }
  }

  &__perpage {
    display: flex;
    align-items: center;
    gap: 10px;

    &-label {
      font-size: var(--font-size-14);
    }

    &-select {
      min-width: 120px;
    }
  }
}

.favorite-module {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 6px;
  padding: 16px 20px;
  overflow: hidden;
  background-color: v-bind(backgroundColorRGBA);
  transition: all 0.2s ease-out;

  &:hover {
    background-color: v-bind(backgroundHoverColorRGBA);
    cursor: pointer;
  }

  &_no-background {
    border: 1px solid var(--color-border);
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
  }
}

.favorite-module:hover .favorite-module__subtitle {
  color: var(--color-font);
}

.favorite-module__title {
  text-overflow: ellipsis;
  overflow: hidden;
}

.favorite-module__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: v-bind(iconBackground);
  border: v-bind(iconBorder);
  flex-shrink: 0;

  > svg {
    width: 24px;
    height: 24px;
    color: v-bind(iconColor);
  }
}
</style>
