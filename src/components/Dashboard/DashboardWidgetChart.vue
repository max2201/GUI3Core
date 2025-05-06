<template>
  <div
    class="dashboard-widget-chart"
    :class="{
      'dashboard-widget-chart--pie': [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(type),
    }"
  >
    <apexchart
      ref="apexChart"
      height="100%"
      :type="typesMap[type]?.name"
      :options="chartOptions"
      :series="
        [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(type)
          ? series.map((value) => Math.abs(value))
          : series
      "
      @dataPointMouseEnter="handleDataPointMouseEnter"
      @dataPointMouseLeave="handleDataPointMouseLeave"
      @dataPointSelection="handleDataPointMouseEnter"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { typesMap, WidgetTypes } from '@/core/constants/DashboardWidgetTypes'
import merge from 'lodash/merge'

const props = defineProps<{
  type: WidgetTypes
  options: any
  series: any
}>()

const apexChart = ref(null)
const emit = defineEmits(['update:selected-data-point'])
const selectedPieSectorValue = ref<number | null>(null)
const handleDataPointMouseEnter = (evt, chartContext, { dataPointIndex, w }) => {
  const label = w.globals.labels[dataPointIndex]
  const color = w.globals.colors[dataPointIndex]
  selectedPieSectorValue.value = props.series[dataPointIndex]
  emit('update:selected-data-point', { label, color })
}
const handleDataPointMouseLeave = () => {
  selectedPieSectorValue.value = null
  emit('update:selected-data-point', null)
}

const barsChartOptions = computed(() => {
  return {
    chart: {
      toolbar: { show: false },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex, w }) {
        let tooltipItems = ''
        for (let i = 0; i < series.length; i++) {
          if (!w.globals.collapsedSeriesIndices.includes(i)) {
            tooltipItems += `
            <div class="dashboard-widget-chart__custom-tooltip-item">
              <div class="dashboard-widget-chart__custom-tooltip-marker" style="background: ${w.globals.markers.colors[i]}"></div>
              <div class="dashboard-widget-chart__custom-tooltip-data">
                <span class="dashboard-widget-chart__custom-tooltip-data-value">${series[i][dataPointIndex].toLocaleString()}</span>
                <div class="dashboard-widget-chart__custom-tooltip-data-period">
                  <span class="dashboard-widget-chart__custom-tooltip-data-period-date">${w.globals.seriesNames[i] === 'предыдущий' && w.config?.xaxis?.categoriesPrev?.length ? w.config.xaxis.categoriesPrev[dataPointIndex] : w.globals.labels[dataPointIndex]}</span>
                  <span class="dashboard-widget-chart__custom-tooltip-data-period-name">${w.globals.seriesNames[i]}</span>
                </div>
              </div>
            </div>
          `
          }
        }

        return `
          <div class="dashboard-widget-chart__custom-tooltip" style="grid-template-columns: ${series.length - w.globals.collapsedSeriesIndices.length < 3 ? `repeat(${series.length - w.globals.collapsedSeriesIndices.length}, min-content)` : 'repeat(3, min-content)'}">
            ${tooltipItems}
          </div>
        `
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 2,
        right: 12,
        top: -18,
        bottom: -15,
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: props.series.length > 4 ? '90%' : '50%',
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: 'Inter',
      fontWeight: 400,
      markers: {
        size: 5,
        shape: 'circle',
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
      },
    },
  }
})
const linesChartOptions = computed(() => {
  return {
    chart: { toolbar: { show: false } },
    legend: {
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: 'Inter',
      fontWeight: 400,
      markers: {
        size: 5,
        shape: 'circle',
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      min: (minValue) => {
        return minValue < 0 ? minValue : 0
      },
      labels: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: -10,
        right: 0,
        top: -18,
        bottom: -15,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      x: {
        show: true,
      },
      custom: function ({ series, dataPointIndex, w, a }) {
        let tooltipItems = ''
        for (let i = 0; i < series.length; i++) {
          if (!w.globals.collapsedSeriesIndices.includes(i)) {
            tooltipItems += `
            <div class="dashboard-widget-chart__custom-tooltip-item">
              <div class="dashboard-widget-chart__custom-tooltip-marker" style="background: ${w.globals.markers.colors[i]}"></div>
              <div class="dashboard-widget-chart__custom-tooltip-data">
                <span class="dashboard-widget-chart__custom-tooltip-data-value">${series[i][dataPointIndex].toLocaleString()}</span>
                <div class="dashboard-widget-chart__custom-tooltip-data-period">
                  <span class="dashboard-widget-chart__custom-tooltip-data-period-date">${w.globals.seriesNames[i] === 'предыдущий' && w.config?.xaxis?.categoriesPrev?.length ? w.config.xaxis.categoriesPrev[dataPointIndex] : w.globals.categoryLabels[dataPointIndex]}</span>
                  <span class="dashboard-widget-chart__custom-tooltip-data-period-name">${w.globals.seriesNames[i]}</span>
                </div>
              </div>
            </div>
          `
          }
        }

        return `
          <div class="dashboard-widget-chart__custom-tooltip" style="grid-template-columns: ${series.length - w.globals.collapsedSeriesIndices.length < 3 ? `repeat(${series.length - w.globals.collapsedSeriesIndices.length}, min-content)` : 'repeat(3, min-content)'}">
            ${tooltipItems}
          </div>
        `
      },
    },
  }
})

const donutChartOptions = computed(() => {
  return {
    chart: {
      offsetX: 0,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false, // Отключаем всплывающее значение
    },
    stroke: {
      width: 1, // Установите необходимую толщину
      colors: ['#fff'], // Цвет, который будет использоваться для обводки
    },
    legend: {
      onItemClick: {
        toggleDataSeries: true,
        custom: (chartContext, seriesIndex, dataPointIndex) => {
          console.log('asdadada')
        },
      },
      onItemHover: {
        custom: (chartContext, seriesIndex, dataPointIndex) => {
          console.log('asdadada')
        },
      },
      itemMargin: {
        horizontal: 0,
        vertical: 2,
      },
      position: 'right', // Расположение легенды справа
      offsetY: 0, // Вертикальное смещение легенды
      offsetX: -25, // Вертикальное смещение легенды
      formatter: function (seriesName, opts) {
        return `
				<div class="dashboard-widget-chart__pie-legend-item">
          <span class="dashboard-widget-chart__pie-legend-item-label">${seriesName}</span>
        	<span class="dashboard-widget-chart__pie-legend-item-value">${props.series[opts.seriesIndex].toLocaleString()}</span>
        </div>
    `
      },
      markers: {
        size: 5,
        shape: 'circle',
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '32px',
              fontFamily: 'Inter',
              fontWeight: 500,
              lineHeight: '120%',
              color: '#23282F',
              offsetY: 5,
              formatter: (name, bool, options) => {
                const total = options.globals.series.reduce((a, b) => a + b, 0)
                const percentage = (Math.abs(selectedPieSectorValue.value) / total) * 100

                return percentage.toFixed(percentage < 2 ? 3 : 2) + '%'
              },
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter',
              fontWeight: 500,
              color: '#23282F',
              offsetY: 6,
              formatter: () => {
                return selectedPieSectorValue.value.toLocaleString()
              },
            },
          },
          size: '70%',
        },
      },
    },
  }
})
const pieChartOptions = computed(() => {
  return {
    legend: {
      onItemClick: {
        toggleDataSeries: true,
      },
      itemMargin: {
        horizontal: 0,
        vertical: 2,
      },
      position: 'right', // Расположение легенды справа
      offsetY: 0, // Вертикальное смещение легенды
      offsetX: -25, // Вертикальное смещение легенды
      // width: 1, // Ширина легенды
      // height: '100%', // Высота легенды - настройте как надо
      formatter: function (seriesName, opts) {
        return `
				<div class="dashboard-widget-chart__pie-legend-item">
          <span class="dashboard-widget-chart__pie-legend-item-label">${seriesName}</span>
        	<span class="dashboard-widget-chart__pie-legend-item-value">${props.series[opts.seriesIndex].toLocaleString()}</span>
        </div>
    `
      },
      markers: {
        size: 5,
        shape: 'circle',
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
      },
    },
    stroke: {
      width: 0, // Установите необходимую толщину
      colors: ['#fff'], // Цвет, который будет использоваться для обводки
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: function ({ series, w, seriesIndex }) {
        return `
        <div class="dashboard-widget-chart__custom-tooltip">
          <div class="dashboard-widget-chart__custom-tooltip-item">
              <div class="dashboard-widget-chart__custom-tooltip-marker" style="background: ${w.globals.markers.colors[seriesIndex]}"></div>
              <div class="dashboard-widget-chart__custom-tooltip-data">
                <span class="dashboard-widget-chart__custom-tooltip-data-value">${props.series[seriesIndex].toLocaleString()}</span>
                <div class="dashboard-widget-chart__custom-tooltip-data-period">
                  <span class="dashboard-widget-chart__custom-tooltip-data-period-name">${w.globals.seriesNames[seriesIndex]}</span>
                </div>
              </div>
            </div>
        </div>
        `
      },
    },
  }
})

const chartOptions = computed(() => {
  switch (props.type) {
    case WidgetTypes.ColumnChart:
      return merge({}, barsChartOptions.value, props.options)
    case WidgetTypes.LineChart:
      return merge({}, linesChartOptions.value, props.options)
    case WidgetTypes.DonutChart:
      return merge({}, donutChartOptions.value, props.options)
    case WidgetTypes.PieChart:
      return merge({}, pieChartOptions.value, props.options)
    default:
      return {}
  }
})
</script>

<style lang="scss" scoped>
.dashboard-widget-chart--pie {
  :deep(.dashboard-widget-chart__pie-legend-item) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dashboard-widget-chart__pie-legend-item {
      &-label {
        font-family: Inter;
        font-weight: 400;
        font-size: 14px;
        line-height: 130%;
        letter-spacing: 0%;
        vertical-align: middle;
        color: #23282f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-value {
        font-family: Roboto Mono;
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        text-align: right;
        vertical-align: middle;
        color: #23282f;
      }
    }
  }

  :deep(.apexcharts-legend-series) {
    width: 100%;
  }

  :deep(.apexcharts-legend-text) {
    width: 100%;
    margin-left: -11px;
  }

  :deep(.apexcharts-legend) {
    margin-top: 80px;
    padding: 0;
    overflow-x: hidden;
    width: 100% !important;
    max-width: 347px;
    padding-left: 4px;
  }
}

.dashboard-widget-chart {
  flex: 1;
  :deep(.dashboard-widget-chart__custom-tooltip) {
    padding: 10px 12px;
    border-radius: 5px;
    gap: 24px;
    box-shadow: 0 4px 28px 0 #061c2829;
    background: #ffffff;
    display: grid;
    grid-template-columns: min-content;

    .dashboard-widget-chart__custom-tooltip-item {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .dashboard-widget-chart__custom-tooltip-marker {
      width: 4px;
      height: calc(100% - 6px);
      border-radius: 1px;
    }

    .dashboard-widget-chart__custom-tooltip-data {
      display: flex;
      flex-direction: column;
      gap: 4px;

      &-value {
        font-family: Inter;
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        letter-spacing: 0;
        vertical-align: middle;
        color: #23282f;
      }

      &-period {
        display: flex;
        flex-direction: column;
        font-family: Inter;
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
        letter-spacing: 0%;
        vertical-align: middle;
        color: #8990a2;
      }
    }
  }
}
</style>
