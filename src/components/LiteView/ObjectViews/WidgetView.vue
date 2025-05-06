<template>
  <div class="widget-view">
    <UiLoader :loading="widgetDataLoading" theme="page" />
    <main class="widget-view__content" v-if="widgetData">
      <section class="widget-view__section-visualisation">
        <div class="widget-view__visualisation-controls">
          <UiButtonGroupSwitcher
            class="widget-view__visualisation-control"
            :buttons="modes"
            :selected-button="selectedMode"
            @select="selectedMode = $event"
          ></UiButtonGroupSwitcher>
          <UiButton1
            title="Фильтр"
            class="widget-view__filter-toggle"
            :class="[{ 'widget-view__filter-toggle--changed': filterHasChanges }]"
            variant="outline"
            icon-left="filter"
            theme="transparent"
            :icon-size="20"
            @click="filterModalVisible = true"
          ></UiButton1>
          <UiFilterGroupSwitcher
            v-if="widgetTypesButtons.length"
            class="widget-view__visualisation-control"
            size="medium-small"
            :buttons="widgetTypesButtons"
            :selected-button="selectedType"
            @select="selectedType = $event"
          >
          </UiFilterGroupSwitcher>
        </div>
        <div class="widget-view__visualisation-chart">
          <DashboardWidgetChart
            v-if="[0, 2].includes(selectedMode)"
            :type="selectedType"
            :options="currentChartOptions"
            :series="currentChartSeries"
          ></DashboardWidgetChart>
          <Table
            v-else-if="selectedMode === 4"
            :dataset-meta="moduleDatasetMeta"
            :dataset-snapshot="moduleDatasetSnapshot"
            :dataset="currentTableData"
          ></Table>
          <DashboardWidgetTable v-else :table-data="currentTableData"></DashboardWidgetTable>
        </div>
      </section>
      <section class="widget-view__section-settings">
        <div class="widget-view__values">
          <div class="widget-view__value-main">
            <span class="widget-view__value-main-count">
              <span>
                {{ currentValue.value }}
              </span>
              <span v-if="currentValue.rest" class="widget-view__value-main-rest">
                {{ `,${currentValue.rest}` }}
              </span>
            </span>
            <span v-if="currentValue.measure" class="widget-view__value-main-measure">
              {{ ` ${currentValue.measure}` }}
            </span>
          </div>

          <div class="widget-view__value-previous">
            <span>{{ previousValue.value }}</span>
            <span v-if="previousValue.rest" class="widget-view__value-previous-rest">
              {{ `,${previousValue.rest}` }}
            </span>
            <span v-if="previousValue.measure" class="widget-view__value-previous-measure">
              {{ ` ${previousValue.measure}` }}
            </span>
          </div>
        </div>
        <div class="widget-view__settings">
          <UiInput1 label="Название виджета" disabled :model-value="widgetData.Name"></UiInput1>
          <UiInput1 label="Тип метрики" disabled :model-value="widgetData.MetricType"></UiInput1>
          <FilterField
            :field="widgetData.PeriodType"
            @on-change="widgetData.PeriodType.currentVal = $event"
          ></FilterField>
          <FilterField
            :disabled="[80, 100].includes(+widgetData.PeriodType.currentVal)"
            :field="widgetData.PeriodShift"
            @on-change="debouncePeriodShift"
          ></FilterField>
          <UiInput1
            label="Актуальный период"
            disabled
            :model-value="widgetData.CurrentValue.Detailing.split('\n')[1]"
          ></UiInput1>
          <template v-if="selectedMode !== 4">
            <FilterField
              :field="widgetData.PeriodStepType"
              :source-field="widgetData.PeriodType"
              @on-change="widgetData.PeriodStepType.currentVal = $event"
            ></FilterField>

            <FilterField
              :field="widgetData.Grouping"
              @on-change="widgetData.Grouping.currentVal = $event"
            ></FilterField>

            <FilterField
              :field="widgetData.AggregateType"
              @on-change="widgetData.AggregateType.currentVal = $event"
            ></FilterField>
            <FilterField
              v-if="widgetData.AggregateType.currentVal !== '5'"
              :field="widgetData.AggregateColumn"
              :source-field="widgetData.AggregateType"
              @on-change="widgetData.AggregateColumn.currentVal = $event"
            ></FilterField>
            <FilterField
              v-else
              :field="widgetData.SqlFunction"
              @on-change="widgetData.SqlFunction.currentVal = $event"
            ></FilterField>

            <FilterField
              checkbox-is-switch
              :field="widgetData.CompareWithPrevious"
              @on-change="widgetData.CompareWithPrevious.currentVal = $event"
            ></FilterField>
          </template>
        </div>
      </section>
    </main>
    <UiFieldDetialsModal
      anchor-id="defaultLayout"
      width="819px"
      :is-open="filterModalVisible"
      @close="filterModalVisible = false"
      hide-close
    >
      <template #content>
        <h3>Фильтрация данных</h3>
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
  </div>
</template>

<script setup lang="ts">
import { GetWidgetView } from '@/core/api/wigets.api'
import UiLoader from '../../Ui/DataDisplay/UiLoader.vue'
import { typesMap, WidgetTypes } from '@/core/constants/DashboardWidgetTypes'
import UiButtonGroupSwitcher from '@c/Ui/DataEntry/UiButtonGroupSwitcher.vue'
import type { ITableCellHead, ITableDatasetMeta, ITableRow } from '@/core/interface/Table'
import { GetModuleState } from '@/core/api/modules.api'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import type { IModuleFilter, IModuleFilterField } from '@/core/interface/Auth'
import { cloneDeep } from 'lodash'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'

const props = defineProps<{
  widgetParams: any
}>()

const moduleFilter = ref<IModuleFilter>()
const filterModalVisible = ref(false)

const resetFilterValues = () => {
  moduleFilter.value?.PrimaryFields.map((field) => {
    field.currentVal = field.defaultVal

    if (!field.subItems) {
      return
    }

    field.subItems.forEach((subField) => {
      subField.currentVal = subField.defaultVal
    })
  })

  moduleFilter.value?.SecondaryFields.map((field) => {
    field.currentVal = field.defaultVal

    if (!field.subItems) {
      return
    }

    field.subItems.forEach((subField) => {
      subField.currentVal = subField.defaultVal
    })
  })

  if (moduleFilter.value?.SmartFilterValue) {
    moduleFilter.value.SmartFilterValue = ''
  }

  widgetData.value.Filter = moduleFilter.value
}
const resetFilter = async () => {
  resetFilterValues()
  filterModalVisible.value = false
}
const submitFilter = async () => {
  widgetData.value.Filter = merge(widgetData.value.Filter, moduleFilter.value)
  filterModalVisible.value = false
}
const modes = ref([
  {
    id: 0,
    label: 'График',
  },
  {
    id: 1,
    label: 'Таблица',
  },
  {
    id: 2,
    label: 'Дельта-график',
  },
  {
    id: 3,
    label: 'Дельта-таблица',
  },
  {
    id: 4,
    label: 'Данные',
  },
])

const debouncePeriodShift = debounce((event) => {
  widgetData.value.PeriodShift.currentVal = event
}, 500)

const currentValue = computed(() => {
  if (widgetData.value?.CurrentValue?.Value) {
    const [value, addition] = widgetData.value.CurrentValue.Value.split(',')
    if (addition) {
      const [rest, measure] = addition.split(' ')
      return { value: value.trim() || '', rest, measure }
    }
    return { value: value || '' }
  }
  return { value: '' }
})
const previousValue = computed(() => {
  if (widgetData.value?.PreviousValue?.Value) {
    const [value, addition] = widgetData.value.PreviousValue.Value.split(',')
    if (addition) {
      const [rest, measure] = addition.split(' ')
      return { value: value || '', rest, measure }
    }
    return { value: value || '' }
  }
  return { value: '' }
})

const colors = computed(() => {
  return {
    currentValue:
      widgetData.value?.CurrentValue && !widgetData.value?.PreviousValue
        ? getSystemColor(widgetData.value.CurrentValue.SystemColor as SystemColorsValue)?.primary ||
          ''
        : '',
    previousValue: widgetData.value?.PreviousValue
      ? getSystemColor(widgetData.value.PreviousValue.SystemColor as SystemColorsValue)?.primary ||
        ''
      : '',
  }
})

const selectedMode = ref(0)

const selectedType = ref(WidgetTypes.ColumnChart)

watch(
  () => selectedMode.value,
  (value) => {
    if (
      value === 0 &&
      [WidgetTypes.DonutChart, WidgetTypes.PieChart].includes(selectedType.value)
    ) {
      selectedType.value = WidgetTypes.ColumnChart
    }
  },
)

const widgetTypesButtons = computed(() => {
  switch (selectedMode.value) {
    case 0: {
      return [
        {
          id: WidgetTypes.ColumnChart,
          iconLeft: typesMap[WidgetTypes.ColumnChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.ColumnChart].title,
        },
        {
          id: WidgetTypes.LineChart,
          iconLeft: typesMap[WidgetTypes.LineChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.LineChart].title,
        },
      ]
    }
    case 2: {
      return [
        {
          id: WidgetTypes.PieChart,
          iconLeft: typesMap[WidgetTypes.PieChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.PieChart].title,
        },
        {
          id: WidgetTypes.DonutChart,
          iconLeft: typesMap[WidgetTypes.DonutChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.DonutChart].title,
        },
        {
          id: WidgetTypes.ColumnChart,
          iconLeft: typesMap[WidgetTypes.ColumnChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.ColumnChart].title,
        },
        {
          id: WidgetTypes.LineChart,
          iconLeft: typesMap[WidgetTypes.LineChart].icon,
          iconSize: 20,
          variant: 'outline',
          title: typesMap[WidgetTypes.LineChart].title,
        },
      ]
    }
    default: {
      return []
    }
  }
})

const currentChartOptions = computed(() => {
  if (selectedMode.value === 0) {
    switch (selectedType.value) {
      case WidgetTypes.DonutChart:
      case WidgetTypes.PieChart: {
        return []
      }
      case WidgetTypes.LineChart:
      case WidgetTypes.ColumnChart: {
        return {
          xaxis: {
            categories: widgetData.value?.LineChartByDate.categories,
            categoriesPrev: widgetData.value?.LineChartByDate.categoriesPrev,
          },
        }
      }
    }
  }
  if (selectedMode.value === 2) {
    switch (selectedType.value) {
      case WidgetTypes.DonutChart:
      case WidgetTypes.PieChart: {
        return {
          labels: widgetData.value.PieLabelsByGroup,
        }
      }
      case WidgetTypes.LineChart:
      case WidgetTypes.ColumnChart: {
        return {
          xaxis: {
            categories: widgetData.value.LineChartByGroup.categories,
          },
        }
      }
    }
  }
  return []
})

const currentChartSeries = computed(() => {
  if (selectedMode.value === 0) {
    switch (selectedType.value) {
      case WidgetTypes.DonutChart:
      case WidgetTypes.PieChart: {
        return []
      }
      case WidgetTypes.LineChart:
      case WidgetTypes.ColumnChart: {
        return widgetData.value.LineChartByDate.datasets
      }
    }
  }
  if (selectedMode.value === 2) {
    switch (selectedType.value) {
      case WidgetTypes.DonutChart:
      case WidgetTypes.PieChart: {
        return widgetData.value.PieValuesByGroup
      }
      case WidgetTypes.LineChart:
      case WidgetTypes.ColumnChart: {
        return widgetData.value.LineChartByGroup.datasets
      }
    }
  }
  return []
})

const currentTableData = computed(() => {
  switch (selectedMode.value) {
    case 1: {
      return widgetData.value.TableDataByDate
    }
    case 3: {
      return widgetData.value.TableDataByGroup
    }
    case 4: {
      return widgetData.value.TableDataAll.Rows.map(
        (row) =>
          ({
            title: row.Title,
            color: row.Color,
            id: row.Id,
            cells: row.Cells.map((cell, index) => ({
              id: String(index),
              value: cell.Value,
              type: cell.CellType,
              width: moduleDatasetSnapshot.value[index].width,
              presentation: {
                background: cell.BackColor,
                text: cell.TextColor,
              },
            })),
          }) as ITableRow,
      )
    }
    default: {
      return null
    }
  }
})
const widgetDataLoading = ref(false)
const widgetData = ref()

const moduleDatasetSnapshot = ref<ITableCellHead[]>([]) // снапшот колонок
const moduleDatasetMeta = ref({
  page: 1,
  count: 0,
  limit: 100,
  sort: {
    id: null,
    dir: 'ASC',
  },
  isContextView: false,
}) as Ref<ITableDatasetMeta>

onMounted(async () => {
  widgetDataLoading.value = true
  try {
    const { data, error } = await GetWidgetView({
      WidgetGroupId: props.widgetParams.groupId,
      WidgetGuid: props.widgetParams.widgetGuid,
    })
    if (!data || error) {
      console.log('Ошибка при загрузке: ', error)
      return
    }
    widgetData.value = data

    moduleFilter.value = cloneDeep(widgetData.value.Filter)

    const { data: moduleSnapshot } = await GetModuleState({
      ViewId: '',
      ModuleId: widgetData.value.ModuleId,
    })

    if (moduleSnapshot) {
      moduleDatasetSnapshot.value = moduleSnapshot!.CurrentColumns.map((column) => {
        return {
          id: column.Id,
          label: column.Title,
          width: column.Width,
        }
      })
      moduleDatasetMeta.value.page = moduleSnapshot.PageNumber
      moduleDatasetMeta.value.count = 0
      moduleDatasetMeta.value.limit = moduleSnapshot.PageSize
      moduleDatasetMeta.value.sort.id = moduleSnapshot.SortedColumn
      moduleDatasetMeta.value.sort.dir = moduleSnapshot.SortedDirection === 1 ? 'DESC' : 'ASC'
      moduleDatasetMeta.value.isContextView = moduleSnapshot.AvailableContextView
    }
  } catch (error) {
    console.error('Error loading async block info', error)
  } finally {
    widgetDataLoading.value = false
  }
})

const moduleStore = useModuleStore()

watch(
  () => widgetData.value,
  async () => {
    if (!widgetDataLoading.value) {
      widgetDataLoading.value = true
      try {
        const { data, error } = await GetWidgetView({
          WidgetGroupId: props.widgetParams.groupId,
          WidgetGuid: props.widgetParams.widgetGuid,
          ddlPeriodType: widgetData.value.PeriodType.currentVal,
          ctrlPeriodShiftSize: widgetData.value.PeriodShift.currentVal,
          ddlPeriodStepSize: widgetData.value.PeriodStepType.currentVal,
          ddlGroupings: widgetData.value.Grouping.currentVal,
          ddlAggType: widgetData.value.AggregateType.currentVal,
          ddlAggColumn: widgetData.value.AggregateColumn.currentVal,
          txtSqlFunction: widgetData.value.SqlFunction.currentVal,
          chbCompareWithPreviousPeriod: widgetData.value.CompareWithPrevious.currentVal,
          Filter: JSON.stringify(moduleStore.getFilterDTO(widgetData.value.Filter)),
          // PageSize:widgetData.value.,
          // PageNumber:widgetData.value.,
          // SortColumn:widgetData.value.,
          // SortMode:widgetData.value.,
        })
        if (!data || error) {
          console.log('Ошибка при загрузке: ', error)
          return
        }
        widgetData.value = data

        moduleFilter.value = cloneDeep(widgetData.value.Filter)

        const { data: moduleSnapshot } = await GetModuleState({
          ViewId: '',
          ModuleId: widgetData.value.ModuleId,
        })

        if (moduleSnapshot) {
          moduleDatasetSnapshot.value = moduleSnapshot!.CurrentColumns.map((column) => {
            return {
              id: column.Id,
              label: column.Title,
              width: column.Width,
            }
          })
          moduleDatasetMeta.value.page = moduleSnapshot.PageNumber
          moduleDatasetMeta.value.count = 0
          moduleDatasetMeta.value.limit = moduleSnapshot.PageSize
          moduleDatasetMeta.value.sort.id = moduleSnapshot.SortedColumn
          moduleDatasetMeta.value.sort.dir = moduleSnapshot.SortedDirection === 1 ? 'DESC' : 'ASC'
          moduleDatasetMeta.value.isContextView = moduleSnapshot.AvailableContextView
        }
      } catch (error) {
        console.error('Error loading async block info', error)
      } finally {
        widgetDataLoading.value = false
      }
    }
  },
  { deep: true },
)

const filterHasChanges = computed(() => {
  if (!widgetData.value.Filter) return false

  if (widgetData.value.Filter.SmartFilterValue) {
    return true
  }

  if (
    widgetData.value.Filter.PrimaryFields.find((field) => field.currentVal !== field.defaultVal)
  ) {
    return true
  }

  if (
    widgetData.value.Filter.SecondaryFields.find((field) => field.currentVal !== field.defaultVal)
  ) {
    return true
  }

  const subfields = [
    ...widgetData.value.Filter.PrimaryFields.filter((field) => field.subItems).reduce(
      (acc, field) => {
        if (!field.subItems) return acc

        acc.push(...field.subItems)
        return acc
      },
      [] as IModuleFilterField[],
    ),
    ...widgetData.value.Filter.SecondaryFields.filter((field) => field.subItems).reduce(
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
.widget-view {
  $this: &;
  overflow: hidden;

  &__content {
    height: 100%;
    display: grid;
    grid-template-columns: auto 300px;
    overflow: hidden;
  }

  &__section {
    &-visualisation {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &-settings {
      border-left: 1px solid #d5dde3;
    }
  }

  &__filter-toggle {
    margin-left: auto;

    &--changed {
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        z-index: 2;
        top: 3px;
        right: 3px;
        width: 7px;
        height: 7px;
        background: #f8393a;
        border-radius: 50%;
      }
    }
  }

  &__visualisation {
    flex: 1;

    &-controls {
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      gap: 28px;
    }

    &-control {
      width: min-content;
    }

    &-chart {
      padding: 0 24px 20px;
      overflow: hidden;
      display: flex;
      height: 100%;
    }
  }

  &__values {
    padding: 22px 24px 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-start;
  }

  &__value-main {
    font-weight: var(--font-weight-600);
    font-size: 30px;
    line-height: 39px;
    color: v-bind('colors.currentValue');

    &-count {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-rest {
      color: var(--color-gray);
      font-size: var(--font-size-24);
      font-weight: var(--font-weight-400);
    }

    &-measure {
      color: var(--color-gray);
      font-weight: var(--font-weight-400);
    }
  }

  &__value-previous {
    cursor: pointer;
    font-weight: var(--font-weight-600);
    font-size: 16px;
    line-height: 20.8px;
    color: v-bind('colors.previousValue');

    &-measure {
      color: var(--color-gray);
      font-weight: var(--font-weight-400);
    }
  }

  &__settings {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
