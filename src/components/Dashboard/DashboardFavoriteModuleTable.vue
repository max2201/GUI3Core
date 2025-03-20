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
        title="Обновить данные"
        :loading="moduleDatasetFetching"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="rotate-cw"
        @click="getTableRowsData"
      ></UiButton1>
      <UiButton1
        :class="{ 'dashboard-fav-module-table__filter--active': showSearch }"
        title="Фильтр"
        variant="text"
        theme="transparent"
        :icon-size="20"
        icon-left="filter"
        @click="showSearch = !showSearch"
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
    <template v-if="moduleDatasetSnapshot.length && tableDataset.length">
      <UiInput1
        v-if="showSearch"
        clearable
        :model-value="moduleFilter?.SmartFilterValue || ''"
        icon="search"
        icon-position="left"
        placeholder="Поиск..."
        highlight-not-empty
        @update:model-value="onSearch"
      />
      <div class="dashboard-fav-module-table__pagination-block">
        <div class="dashboard-fav-module-table__total-count">
          Всего:
          <span class="dashboard-fav-module-table__total-count-value">{{
            moduleDatasetMeta.count
          }}</span>
        </div>
        <UiPagination
          class="dashboard-fav-module-table__pagination"
          style="align-self: flex-end"
          v-if="moduleDatasetSnapshot.length && tableDataset.length"
          :value="moduleDatasetMeta"
          @onChange="paginationSelect"
        ></UiPagination>
        <div class="dashboard-fav-module-table__perpage">
          <div class="dashboard-fav-module-table__perpage-label">Выводить</div>
          <UiSelect1
            :additional-class="['dashboard-fav-module-table__perpage-select']"
            :model-value="pageOption"
            :options="perPageOptions"
            @update:model-value="handleSelectPerpage"
          />
        </div>
      </div>
      <Table
        :dataset-snapshot="moduleDatasetSnapshot"
        :dataset-meta="moduleDatasetMeta"
        :dataset="tableDataset"
      />
    </template>
    <div v-else>Нет данных</div>
    <UiLoader :loading="moduleDatasetFetching" theme="page" />
  </DashboardWidgetGroup>
</template>

<script setup lang="ts">
import type { DashboardFavoritiesModuleItem } from '@/core/interface/Dashboard'
import { hexToRgb } from '@/core/utils/Color'
import { GetItems, GetModuleState } from '@/core/api/modules.api'
import type {
  ITableCell,
  ITableCellHead,
  ITableDatasetMeta,
  ITableRow,
} from '@/core/interface/Table'
import type { IModuleFilter } from '@/core/interface/Auth'
import { useTableState } from '@/composables/use-table-state'
import type { ISelect } from '@/core/interface/Ui'
import throttle from "lodash/throttle";

const props = defineProps<{
  value: DashboardFavoritiesModuleItem
}>()
const emit = defineEmits(['redirect-to-list'])
const redirectToList = () => {
  emit('redirect-to-list')
}

const localTableState = useTableState()
const perPageOptions = computed(() => localTableState?.perPageOptions.value || [])
const handleSelectPerpage = async (v: ISelect) => {
  moduleDatasetMeta.value.page = 1
  moduleDatasetMeta.value.limit = +v.value

  await getTableRowsData()
}
const pageOption = computed(() => {
  return perPageOptions.value.find((option) => option.value === moduleDatasetMeta.value.limit)
})

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
const showSearch = ref(false)
const getTableData = async () => {
  try {
    const { data, error } = await GetModuleState({
      ViewId: '',
      ModuleId: props.value.id,
    })
    moduleFilter.value = data.Filter
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
    Filter: moduleStore.getFilterDTO(moduleFilter.value),
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
const onSearch = throttle(
    async (v: string) => {
      if (moduleFilter.value) {
        moduleFilter.value.SmartFilterValue = v
        await getTableRowsData()
      }
    },
    500,
    { leading: false, trailing: true },
)

onMounted(async () => {
  await getTableData()
  await getTableRowsData()
  showSearch.value = !!moduleFilter.value?.SmartFilterValue
})
</script>

<style scoped lang="scss">
.dashboard-fav-module-table {
  &__filter {
    &--active {
      color: var(--input-hover-background-color) !important;
    }
  }

  &__pagination-block {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__total-count {
    margin-right: auto;
    display: flex;
    gap: 3px;
    width: max-content;
    font-size: var(--font-size-14);

    &-value {
      font-weight: var(--font-weight-600);
    }
  }

  &__pagination {
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
