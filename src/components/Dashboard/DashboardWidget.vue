<template>
  <div class="dashboard-widget">
    <UiLoader :loading="loading" theme="page" />
    <div
      class="dashboard-widget__head"
      :class="{
        'dashboard-widget__head--numbers': [
          WidgetTypes.NumberValue,
          WidgetTypes.TableView,
        ].includes(widget.WidgetType),
      }"
    >
      <h4 class="dashboard-widget__name" :title="widget.Name">
        {{ widget.Name }}
      </h4>
      <div
        class="dashboard-widget__actions"
        :class="{ 'dashboard-widget__actions--hidden': hideActions }"
      >
        <slot name="actions">
          <UiButton1
            title="Просмотр виджета"
            variant="text"
            theme="transparent"
            :icon-size="20"
            icon-left="eye"
            @click="openWidgetDataView"
          />
          <UiButton1
            title="Обновить данные"
            :loading="loading"
            variant="text"
            theme="transparent"
            :icon-size="20"
            icon-left="rotate-cw"
            @click="reloadData"
          />
          <UiFilterGroupSwitcher
            class="dashboard-widget__actions-type-switcher"
            v-if="widgetTypesButtons.length"
            size="medium-small"
            :buttons="widgetTypesButtons"
            :selected-button="widgetSubType"
            @select="widgetSubType = $event"
          />
        </slot>
      </div>

      <div class="dashboard-widget__edit-actions">
        <slot name="edit-actions"></slot>
      </div>
    </div>

    <!--     v-if="
        !(
          [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.WidgetType) &&
          size === 'large'
        ) &&
        widget.CurrentValue &&
        widget.WidgetType !== WidgetTypes.TableView
      "-->
    <div
      class="dashboard-widget__values"
      :class="{
        'dashboard-widget__values--pie-legend':
          [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.WidgetType) &&
          size === 'large',
      }"
      v-if="widget.CurrentValue && widget.WidgetType !== WidgetTypes.TableView"
    >
      <div
        class="dashboard-widget__selected-pie-sector"
        v-if="
          selectedChartDataPoint &&
          [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.WidgetType) &&
          size === 'medium'
        "
      >
        <div
          class="dashboard-widget__selected-pie-sector-marker"
          :style="{ background: selectedChartDataPoint.color }"
        ></div>
        {{ selectedChartDataPoint.label }}
      </div>
      <div
        v-else
        class="dashboard-widget__current-value"
        :class="{
          'dashboard-widget__current-value--small':
            widget.WidgetType !== WidgetTypes.NumberValue &&
            !(
              [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.WidgetType) &&
              size === 'large'
            ),
        }"
        :title="widget.CurrentValue.Detailing"
      >
        <span class="dashboard-widget__current-value-count">
          <span>
            {{ currentValue.value }}
          </span>
          <span v-if="currentValue.rest" class="dashboard-widget__current-value-rest">
            {{ `,${currentValue.rest}` }}
          </span>
        </span>
        <span v-if="currentValue.measure" class="dashboard-widget__current-value-measure">
          {{ ` ${currentValue.measure}` }}
        </span>
      </div>
      <VDropdown
        v-if="
          previousValue.value &&
          (widget.WidgetType === WidgetTypes.NumberValue ||
            ([WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.WidgetType) &&
              size === 'large'))
        "
        placement="right"
        :distance="5"
        :title="widget.PreviousValue.Detailing"
        :triggers="[]"
        ref="diffDropdownRef"
        :shown="isDiffDropdownOpen"
        :autoHide="false"
      >
        <div
          class="dashboard-widget__previous-value"
          @contextmenu.prevent="isDiffDropdownOpen = true"
        >
          <span>{{ previousValue.value }}</span>
          <span v-if="previousValue.rest" class="dashboard-widget__previous-value-rest">
            {{ `,${previousValue.rest}` }}
          </span>
          <span v-if="previousValue.measure" class="dashboard-widget__previous-value-measure">
            {{ ` ${previousValue.measure}` }}
          </span>
        </div>
        <template #popper>
          <div class="dashboard-widget__dropdown">
            <div class="dashboard-widget__dropdown-header">Представление сравнения</div>
            <ul class="dashboard-widget__dropdown-list">
              <li
                v-close-popper
                class="dashboard-widget__dropdown-list-item"
                :class="{
                  'dashboard-widget__dropdown-list-item--active': key == widget.DiffViewType,
                }"
                v-for="(value, key) in widget.AppliableDiffViewType"
                :key="key"
                @click="setNewDiffViewType(String(key))"
              >
                {{ value }}
              </li>
            </ul>
          </div>
        </template>
      </VDropdown>
    </div>

    <VDropdown
      v-if="widget.WidgetType === WidgetTypes.NumberValue"
      placement="right"
      :distance="5"
      :triggers="[]"
      ref="groupingDropdownRef"
      :shown="isGroupingDropdownOpen"
      :autoHide="false"
    >
      <div
        v-if="widget.GroupDetails?.length"
        class="dashboard-widget__fields"
        @contextmenu.prevent="isGroupingDropdownOpen = true"
      >
        <div
          v-for="(field, index) in widget.GroupDetails"
          :key="index"
          class="dashboard-widget__field"
        >
          <div class="dashboard-widget__field-title" :title="field.Title">
            {{ field.Title }}
          </div>

          <div class="dashboard-widget__field-value">
            {{ field.Value }}
          </div>
        </div>
      </div>
      <template #popper>
        <div class="dashboard-widget__dropdown">
          <div class="dashboard-widget__dropdown-header">Детализация значений (группировка)</div>
          <ul class="dashboard-widget__dropdown-list">
            <li
              class="dashboard-widget__dropdown-list-item"
              :class="{
                'dashboard-widget__dropdown-list-item--active': String(key) == widget.GroupField,
              }"
              v-for="(value, key) in widget.AppliableGrouping"
              :key="key"
              @click="setNewGrouping(String(key))"
              v-close-popper
            >
              {{ value }}
            </li>
          </ul>
        </div>
      </template>
    </VDropdown>
    <DashboardWidgetTable
      v-else-if="widget.WidgetType === WidgetTypes.TableView"
      :table-data="widget.TableData"
    ></DashboardWidgetTable>
    <DashboardWidgetChart
      v-else
      :type="widgetSubType"
      :options="chartOptions"
      :series="chartSeries"
      @update:selected-data-point="selectedChartDataPoint = $event"
    ></DashboardWidgetChart>
  </div>
</template>

<script setup lang="ts">
import type { MetricWidgetDto } from '@/core/interface/Dashboard'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import { onClickOutside } from '@vueuse/core'
import { typesMap, WidgetTypes } from '@/core/constants/DashboardWidgetTypes'

const props = defineProps<{
  size?: 'small' | 'medium' | 'large'
  widget: MetricWidgetDto
  loading?: boolean
  hideActions?: boolean
}>()

const emit = defineEmits([
  'update:grouping',
  'update:diffViewType',
  'reload-data',
  'open-widget-data-view',
])

const selectedChartDataPoint = ref<{ color: string; label: string } | null>(null)

const widgetSubType = ref(props.widget.WidgetType)
watch(
  () => props.widget.WidgetType,
  (value) => {
    widgetSubType.value = value
  },
)
const widgetTypesButtons = computed(() => {
  switch (props.widget.WidgetType) {
    case WidgetTypes.DonutChart:
    case WidgetTypes.PieChart:
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
      ]
    case WidgetTypes.ColumnChart:
    case WidgetTypes.LineChart:
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
    default:
      return []
  }
})

const chartOptions = computed(() => {
  if ([WidgetTypes.DonutChart, WidgetTypes.PieChart].includes(props.widget.WidgetType)) {
    return {
      legend: {
        show: props.size !== 'medium', // Скрываем стандартную легенду
      },
      labels: props.widget.PieLabels,
    }
  }
  if ([WidgetTypes.LineChart, WidgetTypes.ColumnChart].includes(props.widget.WidgetType)) {
    return {
      annotations: {
        yaxis:
          props.widget.WidgetInfoFull?.MaxMediumBorder &&
          props.widget.WidgetInfoFull?.MinMediumBorder
            ? [
                {
                  y: props.widget.WidgetInfoFull?.MaxMediumBorder || undefined,
                  borderColor: '#00E396',
                  label: {
                    borderColor: '#00E396',
                    style: {
                      color: '#fff',
                      background: '#00E396',
                    },
                    text: 'Верхняя граница',
                  },
                },
                {
                  y: props.widget.WidgetInfoFull?.MinMediumBorder || undefined,
                  borderColor: '#F8393A',
                  label: {
                    borderColor: '#F8393A',
                    style: {
                      color: '#fff',
                      background: '#F8393A',
                    },
                    text: 'Нижняя граница',
                  },
                },
              ]
            : [],
      },
      chart: {
        id: 'vuechart',
      },
      xaxis: {
        categories: props.widget.LineChart?.categories,
        categoriesPrev: props.widget.LineChart?.categoriesPrev,
      },
    }
  }
  return {}
})

const chartSeries = computed(() => {
  if ([WidgetTypes.DonutChart, WidgetTypes.PieChart].includes(props.widget.WidgetType)) {
    return props.widget.PieValues
  }
  if ([WidgetTypes.LineChart, WidgetTypes.ColumnChart].includes(props.widget.WidgetType)) {
    return props.widget.LineChart?.datasets
  }
  return []
})

const reloadData = () => {
  emit('reload-data')
}
const openWidgetDataView = () => {
  emit('open-widget-data-view')
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

const currentValue = computed(() => {
  if (props.widget.CurrentValue?.Value) {
    const [value, addition] = props.widget.CurrentValue.Value.split(',')
    if (addition) {
      const [rest, measure] = addition.split(' ')
      return { value: value.trim() || '', rest, measure }
    }
    return { value: value || '' }
  }
  return { value: '' }
})
const previousValue = computed(() => {
  if (props.widget.PreviousValue?.Value) {
    const [value, addition] = props.widget.PreviousValue.Value.split(',')
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
      props.widget.CurrentValue && !props.widget.PreviousValue
        ? getSystemColor(props.widget.CurrentValue.SystemColor as SystemColorsValue)?.primary || ''
        : '',
    previousValue: props.widget.PreviousValue
      ? getSystemColor(props.widget.PreviousValue.SystemColor as SystemColorsValue)?.primary || ''
      : '',
  }
})
</script>

<style lang="scss" scoped>
.dashboard-widget {
  overflow: hidden;
  $this: &;

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--component-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 #273f530f;

  &__dropdown {
    &-header {
      padding: 16px;
      border-bottom: 1px solid var(--color-border);
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 18.2px;
      color: var(--color-font-2);
    }

    &-list {
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 1px;

      &-item {
        font-weight: var(--font-weight-400);
        font-size: var(--font-size-14);
        line-height: 18.2px;
        color: var(--color-font-2);
        padding: 8px 16px;
        cursor: pointer;

        &:hover {
          background: var(--color-background);
        }

        &--active {
          background: var(--color-bg-active-10alpha);
        }
      }
    }
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &--numbers {
      margin-bottom: 16px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;

    &--hidden {
      opacity: 0;
    }

    &-type-switcher {
      margin-left: 8px;
    }
  }

  &__edit-actions {
    position: absolute;
    top: 12px;
    right: 16px;
    display: flex;
    gap: 2px;
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-gray);
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    line-height: 20px;
  }

  &__selected-pie-sector {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 1.5px 0;
    font-family: Inter;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    letter-spacing: 0;
    vertical-align: middle;
    color: #23282f;

    &-marker {
      border-radius: 50%;
      width: 10px;
      height: 10px;
    }
  }

  &__values {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-start;

    &--pie-legend {
      position: absolute;
      width: 347px;
      top: 64px;
      right: 20px;
      z-index: 1;
    }
  }

  &__current-value {
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

    &--small {
      font-size: 16px;
      line-height: 20.8px;

      #{$this}__current-value-rest {
        font-size: 16px;
        line-height: 20.8px;
        color: v-bind('colors.currentValue');
      }
    }
  }

  &__previous-value {
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

  &__fields {
    max-height: 118px;
    overflow: hidden;
    overflow-y: auto;
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;

    &::-webkit-scrollbar {
      background-color: var(--component-background) !important;
    }

    &::-webkit-scrollbar-track {
      background: var(--component-background) !important;
    }

    &::-webkit-scrollbar-thumb {
      border-color: var(--component-background) !important;
    }
  }

  &__field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    padding: 2px 4px;

    &-title {
      font-family: Inter;
      font-weight: var(--font-weight-400);
      font-size: var(--font-size-14);
      line-height: 18px;
      color: var(--color-font);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &-value {
      white-space: nowrap;
      font-family: Roboto Mono;
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 18px;
      color: var(--color-font);
    }
  }
}
</style>
