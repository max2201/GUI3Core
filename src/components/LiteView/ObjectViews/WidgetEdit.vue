<template>
  <div class="widget-edit">
    <UiLoader :loading="widgetDataLoading" theme="page" />
    <main class="widget-edit__content" v-if="widgetData">
      <section class="widget-edit__section">
        <section class="widget-edit__section-block">
          <h3 class="widget-edit__section-block-title">Настройка данных</h3>
          <div class="widget-edit__section-block-content">
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="currentMetricType"
              @on-change="currentMetricType = $event"
            ></FilterField>
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="currentMetricSettings.PeriodType"
              @on-change="currentMetricSettings = { key: 'PeriodType', value: $event }"
            ></FilterField>
            <FilterField
              :disabled="!widgetParams.allowEdit"
              input-type="number"
              :field="currentMetricSettings.PeriodShift"
              :source-field="currentMetricSettings.PeriodType"
              @on-change="currentMetricSettings = { key: 'PeriodShift', value: $event }"
            ></FilterField>
            <!--            <UiInput1 label="Актуальный период" disabled :model-value="actualPeriod"></UiInput1>-->
            <UiInput1 label="Актуальный период" disabled model-value=""></UiInput1>
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="currentMetricSettings.AggregateType"
              @on-change="currentMetricSettings = { key: 'AggregateType', value: $event }"
            ></FilterField>

            <FilterField
              :disabled="!widgetParams.allowEdit"
              :additional-class="['span-2']"
              v-if="currentMetricSettings.AggregateType.currentVal !== '5'"
              :field="currentMetricSettings.AggregateColumn"
              :source-field="currentMetricSettings.AggregateType"
              @on-change="currentMetricSettings = { key: 'AggregateColumn', value: $event }"
            ></FilterField>

            <FilterField
              v-else
              :disabled="!widgetParams.allowEdit"
              :additional-class="['span-2']"
              :field="currentMetricSettings.SqlFunction"
              @on-change="currentMetricSettings = { key: 'SqlFunction', value: $event }"
            ></FilterField>
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="currentMetricSettings.DateTimeParam"
              @on-change="currentMetricSettings = { key: 'DateTimeParam', value: $event }"
            ></FilterField>
          </div>
        </section>
        <section class="widget-edit__section-block">
          <h3 class="widget-edit__section-block-title">Визуализация</h3>
          <div class="widget-edit__section-block-content">
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="widgetData.Name"
              @on-change="widgetData.Name.currentVal = $event"
            ></FilterField>
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :additional-class="['span-2']"
              :field="currentMetricSettings.Grouping"
              @on-change="currentMetricSettings = { key: 'Grouping', value: $event }"
            ></FilterField>
            <UiFormField
              :id="widgetData.WidgetType.id"
              :label="widgetData.WidgetType.title"
              separate-label
              :has-modified="widgetData.WidgetType.currentVal !== widgetData.WidgetType.defaultVal"
            >
              <UiFilterGroupSwitcher
                :disabled="!widgetParams.allowEdit"
                size="medium-small"
                :buttons="widgetTypesButtons"
                :selected-button="widgetData.WidgetType.currentVal"
                @select="widgetData.WidgetType.currentVal = $event"
              />
            </UiFormField>
            <div
              class="span-4"
              style="
                border-radius: 10px;
                background: #f0f5f9;
                padding: 16px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                overflow: hidden;
              "
            >
              <DashboardWidget
                :style="{
                  height:
                    +widgetData.WidgetType.currentVal === WidgetTypes.NumberValue &&
                    !currentMetricSettings.Grouping.currentVal
                      ? '140px'
                      : '300px',
                }"
                :class="{
                  'span-2': currentMetricSettings.Grouping.currentVal,
                  'span-4': +widgetData.WidgetType.currentVal !== WidgetTypes.NumberValue,
                }"
                :widget="stubWidgetData"
                size="large"
              ></DashboardWidget>
            </div>

            <div
              class="span-2"
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                align-items: start;
                border: 1px solid #d5dde3;
                padding: 12px;
                border-radius: 5px;
              "
            >
              <FilterField
                :disabled="!widgetParams.allowEdit"
                checkbox-is-switch
                class="span-2"
                :field="currentMetricSettings.CompareWithPrevious"
                @on-change="currentMetricSettings = { key: 'CompareWithPrevious', value: $event }"
              ></FilterField>
              <template v-if="currentMetricSettings.CompareWithPrevious.currentVal === '1'">
                <FilterField
                  :disabled="!widgetParams.allowEdit"
                  :field="currentMetricSettings.CompareGoodOrBad"
                  @on-change="currentMetricSettings = { key: 'CompareGoodOrBad', value: $event }"
                ></FilterField>
                <FilterField
                  :disabled="!widgetParams.allowEdit"
                  :field="currentMetricSettings.CompareDiffViewType"
                  @on-change="currentMetricSettings = { key: 'CompareDiffViewType', value: $event }"
                ></FilterField>
              </template>
            </div>

            <div
              class="span-2"
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                align-items: start;
                border: 1px solid #d5dde3;
                padding: 12px;
                border-radius: 5px;
              "
            >
              <FilterField
                :disabled="!widgetParams.allowEdit"
                checkbox-is-switch
                class="span-2"
                :field="currentMetricSettings.ValueBorderCheck"
                @on-change="currentMetricSettings = { key: 'ValueBorderCheck', value: $event }"
              ></FilterField>
              <template v-if="currentMetricSettings.ValueBorderCheck.currentVal === '1'">
                <FilterField
                  :disabled="!widgetParams.allowEdit"
                  input-type="number"
                  :field="currentMetricSettings.ValueBorderMax"
                  @on-change="currentMetricSettings = { key: 'ValueBorderMax', value: $event }"
                >
                </FilterField>
                <FilterField
                  :disabled="!widgetParams.allowEdit"
                  input-type="number"
                  :field="currentMetricSettings.ValueBorderMin"
                  @on-change="currentMetricSettings = { key: 'ValueBorderMin', value: $event }"
                ></FilterField>
              </template>
            </div>
          </div>
        </section>
        <section class="widget-edit__section-block">
          <h3 class="widget-edit__section-block-title">Фильтрация данных</h3>
          <FilterFields
            :filter="currentMetricSettings.Filter"
            :showAdditionalFields="true"
            @update-filter-values="
              widgetData.MetricSettings[currentMetricType.currentVal].Filter = $event
            "
          />
          <div class="widget-edit__section-block-content"></div>
        </section>
      </section>
      <section class="widget-edit__section widget-edit__access-section">
        <section class="widget-edit__section-block">
          <h3 class="widget-edit__section-block-title">Доступ к виджету</h3>
          <div class="widget-edit__section-block-content widget-edit__section-block-content">
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="widgetData.ExecutorType"
              @on-change="widgetData.ExecutorType.currentVal = $event"
            ></FilterField>
            <template v-if="widgetData.ExecutorType.currentVal === '1'">
              <FilterField
                :disabled="!widgetParams.allowEdit"
                :source-field="widgetData.ExecutorType"
                :field="widgetData.Roles"
                @on-change="widgetData.Roles.currentVal = $event"
              ></FilterField>
              <UiTags
                :tags="
                  widgetData.Roles.subItems[0].values
                    .filter((item) => {
                      return widgetData.Roles.currentVal.split(',').includes(item.Value)
                    })
                    .map((item) => {
                      return {
                        value: item.Value,
                        label: item.Title,
                        iconAfter: 'close',
                        tagClickAction: () => {
                          widgetData.Roles.currentVal = widgetData.Roles.currentVal
                            .split(',')
                            .filter((value) => value !== item.Value)
                            .join(',')
                        },
                      }
                    })
                "
              ></UiTags>
            </template>
            <template v-else-if="widgetData.ExecutorType.currentVal === '2'">
              <FilterField
                :disabled="!widgetParams.allowEdit"
                :source-field="widgetData.ExecutorType"
                :field="widgetData.Users"
                @on-change="widgetData.Users.currentVal = $event"
              ></FilterField>
              <UiTags
                :tags="
                  widgetData.Users.subItems[1].values
                    .filter((item) => {
                      return widgetData.Users.currentVal.split(',').includes(item.Value)
                    })
                    .map((item) => {
                      return {
                        value: item.Value,
                        label: item.Title,
                        iconAfter: 'close',
                        tagClickAction: () => {
                          widgetData.Users.currentVal = widgetData.Users.currentVal
                            .split(',')
                            .filter((value) => value !== item.Value)
                            .join(',')
                        },
                      }
                    })
                "
              ></UiTags>
            </template>
          </div>
        </section>
        <section class="widget-edit__section-block">
          <h3 class="widget-edit__section-block-title">Владелец виджета</h3>
          <div class="widget-edit__section-block-content">
            <FilterField
              :disabled="!widgetParams.allowEdit"
              :field="widgetData.WidgetOwner"
              @on-change="widgetData.WidgetOwner.currentVal = $event"
            ></FilterField>
          </div>
        </section>
      </section>
    </main>
    <footer class="widget-edit__footer">
      <UiButton1
        v-if="widgetParams.groupId && widgetParams.allowEdit"
        theme="danger"
        variant="outline"
        size="large"
        class="widget-edit__footer-action"
        @click="deleteWidget"
        >Удалить
      </UiButton1>
      <div class="widget-edit__footer-actions-right">
        <UiButton1
          variant="outline"
          size="large"
          class="widget-edit__footer-action"
          @click="close()"
          >Отмена
        </UiButton1>
        <UiButton1
          v-if="widgetParams.groupId"
          variant="outline"
          size="large"
          class="widget-edit__footer-action"
          @click="saveWidget(true)"
          >Дублировать виджет
        </UiButton1>
        <UiButton1
          v-if="widgetParams.allowEdit"
          size="large"
          class="widget-edit__footer-action"
          @click="saveWidget()"
          >Сохранить
        </UiButton1>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { DeleteWidget, GetWidgetEdit, SaveWidgetSettings } from '@/core/api/wigets.api'
import UiLoader from '../../Ui/DataDisplay/UiLoader.vue'
import { typesMap, WidgetEditEventTypes, WidgetTypes } from '@/core/constants/DashboardWidgetTypes'
import { getTimePeriod } from '/src/core/utils/PeriodsHelper.ts'

const widgetTypesButtons = computed(() => {
  return widgetData.value.WidgetType.values.map((item) => {
    return {
      id: item.Value,
      iconLeft: typesMap[item.Value].icon,
      iconSize: 20,
      variant: 'outline',
      title: item.Title,
      disabled:
        [WidgetTypes.PieChart, WidgetTypes.DonutChart, WidgetTypes.TableView].includes(
          +item.Value,
        ) && !currentMetricSettings.value.Grouping.currentVal,
    }
  })
})

const props = defineProps<{
  widgetParams: any
}>()

const emits = defineEmits(['close'])
const deleteWidget = async () => {
  await DeleteWidget({
    groupId: props.widgetParams.groupId,
    widgetGuid: props.widgetParams.widgetGuid,
  })
  close(WidgetEditEventTypes.Delete)
}

const moduleStore = useModuleStore()

const saveWidget = async (isNew?: boolean) => {
  await SaveWidgetSettings({
    WidgetGroupId: String((!isNew && props.widgetParams?.groupId) || '-1'),
    WidgetGuid: (!isNew && props.widgetParams.widgetGuid) || '',
    tbWidgetName: widgetData.value.Name.currentVal || 'Новый виджет',
    ddlMetricType: currentMetricType.value.currentVal,
    WidgetType: widgetData.value.WidgetType.currentVal,
    infoWorker: props.widgetParams.allowEdit
      ? widgetData.value.WidgetOwner.currentVal
      : widgetData.value.WidgetOwner.defaultVal,
    ddlExecutorType: props.widgetParams.allowEdit
      ? widgetData.value.ExecutorType.currentVal
      : widgetData.value.ExecutorType.defaultVal,
    lstUsers: props.widgetParams.allowEdit
      ? widgetData.value.Users.currentVal
      : widgetData.value.Users.defaultVal,
    ctrlDictsRoles: props.widgetParams.allowEdit
      ? widgetData.value.Roles.currentVal
      : widgetData.value.Roles.defaultVal,
    ddlPeriodType: currentMetricSettings.value.PeriodType.currentVal,
    ctrlPeriodShiftSize: currentMetricSettings.value.PeriodShift.currentVal,
    ddlAggType: currentMetricSettings.value.AggregateType.currentVal,
    ddlAggColumn: currentMetricSettings.value.AggregateColumn.currentVal,
    ddlGroupings: currentMetricSettings.value.Grouping.currentVal,
    ddlDateTimeParam: currentMetricSettings.value.DateTimeParam.currentVal,
    txtSqlFunction: currentMetricSettings.value.SqlFunction.currentVal,
    chbCompareWithPreviousPeriod: currentMetricSettings.value.CompareWithPrevious.currentVal,
    ddlCompareSettings: currentMetricSettings.value.CompareGoodOrBad.currentVal,
    ddlCompareView: currentMetricSettings.value.CompareDiffViewType.currentVal,
    chbBorders: currentMetricSettings.value.ValueBorderCheck.currentVal,
    ctrlMinMediumValue: currentMetricSettings.value.ValueBorderMin.currentVal,
    ctrlMaxMediumValue: currentMetricSettings.value.ValueBorderMax.currentVal,
    Filter: JSON.stringify(moduleStore.getFilterDTO(currentMetricSettings.value.Filter)),
  })
  close(WidgetEditEventTypes.Update)
}

const actualPeriod = computed(() => {
  // return getTimePeriodLabelWithParams(
  //   +currentMetricSettings.value.PeriodType.currentVal,
  //   currentMetricSettings.value.PeriodShift.currentVal,
  // )
  const [startDate, timeSpan] = getTimePeriod(
    +currentMetricSettings.value.PeriodType.currentVal,
    currentMetricSettings.value.PeriodShift.currentVal,
  )
  return `${startDate}${timeSpan}`
})

// const periodResult = ref<{ startDate: Date; timeSpan: number } | null>(null)

// const calculateTimePeriod = () => {
//   const [startDate, timeSpan] = getTimePeriod(
//     +currentMetricSettings.value.PeriodType.currentVal,
//     currentMetricSettings.value.PeriodShift.currentVal,
//   )
//   periodResult.value = { startDate, timeSpan }
// }

const close = (eventType?: WidgetEditEventTypes) => {
  emits('close', eventType)
}

const widgetDataLoading = ref(false)
const widgetData = ref()

const currentMetricType = computed({
  get: () => {
    return widgetData.value?.MetricType
  },
  set: (newValue) => {
    widgetData.value.MetricType.currentVal = newValue
  },
})
const currentMetricSettings = computed({
  get: () => {
    return widgetData.value?.MetricSettings?.[currentMetricType.value.currentVal]
  },
  set: ({ key, value }) => {
    return (widgetData.value.MetricSettings[currentMetricType.value.currentVal][key].currentVal =
      value)
  },
})

onMounted(async () => {
  widgetDataLoading.value = true
  try {
    const { data, error } = await GetWidgetEdit({
      groupId: props.widgetParams.groupId,
      widgetGuid: props.widgetParams.widgetGuid,
    })
    if (!data || error) {
      console.log('Ошибка при загрузке: ', error)
      return
    }
    widgetData.value = data
    widgetData.value.MetricType.currentVal =
      widgetData.value.MetricType.currentVal || widgetData.value.MetricType.defaultVal

    currentMetricSettings.value = {
      key: 'PeriodType',
      value:
        currentMetricSettings.value.PeriodType.currentVal ||
        currentMetricSettings.value.PeriodType.defaultVal,
    }
  } catch (error) {
    console.error('Error loading async block info', error)
  } finally {
    widgetDataLoading.value = false
  }
})

const stubWidgetData = computed(() => {
  return {
    WidgetInfoFull: +currentMetricSettings.value.ValueBorderCheck.currentVal
      ? {
          MinMediumBorder: 30,
          MaxMediumBorder: 90,
        }
      : undefined,
    WidgetType: +widgetData.value.WidgetType.currentVal,
    PieValues: [152, 114, 84, 79, 28, 3],
    PieLabels: ['Тест', 'Тестовый', 'Шанс', 'НН', 'Супер Лизинг', 'Виктория МКК'],
    TableData: {
      CurrentColumns: [
        {
          Title: 'Название',
          Id: '',
          IsColorForAllRow: false,
          Position: 0,
          Width: 100,
          SortProperty: '',
        },
        {
          Title: 'Значение',
          Id: '',
          IsColorForAllRow: false,
          Position: 0,
          Width: 100,
          SortProperty: '',
        },
        {
          Title: '%',
          Id: '',
          IsColorForAllRow: false,
          Position: 0,
          Width: 50,
          SortProperty: '',
        },
      ],
      CurrentRows: [
        {
          Id: 0,
          Title: 'Итого',
          Color: '#F0F5F9',
          Cells: [
            {
              ColumnId: '',
              Value: 'Итого',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
            { ColumnId: '', Value: '207', TextColor: '', BackColor: '', CellType: 0 },
            { ColumnId: '', Value: '', TextColor: '', BackColor: '', CellType: 0 },
          ],
        },
        {
          Id: 0,
          Title: 'Кредитное тело',
          Color: '',
          Cells: [
            {
              ColumnId: '',
              Value: 'Кредитное тело',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
            { ColumnId: '', Value: '96', TextColor: '', BackColor: '', CellType: 0 },
            {
              ColumnId: '',
              Value: '46,38',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
          ],
        },
        {
          Id: 0,
          Title: 'Проценты по договору',
          Color: '',
          Cells: [
            {
              ColumnId: '',
              Value: 'Проценты по договору',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
            { ColumnId: '', Value: '61', TextColor: '', BackColor: '', CellType: 0 },
            {
              ColumnId: '',
              Value: '29,47',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
          ],
        },
        {
          Id: 0,
          Title: 'Проценты по договору',
          Color: '',
          Cells: [
            {
              ColumnId: '',
              Value: 'Проценты по договору',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
            { ColumnId: '', Value: '61', TextColor: '', BackColor: '', CellType: 0 },
            {
              ColumnId: '',
              Value: '29,47',
              TextColor: '',
              BackColor: '',
              CellType: 0,
            },
          ],
        },
      ],
    },
    LineChart: {
      categories: [
        '01.07.2024',
        '01.08.2024',
        '01.09.2024',
        '01.10.2024',
        '01.11.2024',
        '01.12.2024',
      ],
      categoriesPrev: [
        '01.07.2023',
        '01.08.2023',
        '01.09.2023',
        '01.10.2023',
        '01.11.2023',
        '01.12.2023',
      ],
      datasets:
        currentMetricSettings.value.CompareWithPrevious.currentVal === '1'
          ? [
              {
                name: 'текущий',
                data: [73, 37, 65, 68, 103, 98],
              },
              {
                name: 'предыдущий',
                data: [52, 55, 62, 52, 36, 48],
              },
            ]
          : [
              {
                name: 'текущий',
                data: [73, 37, 65, 68, 103, 98],
              },
            ],
    },
    Name: widgetData.value.Name.currentVal || 'Название',
    CurrentValue: {
      Value: '100 ₽',
      SystemColor:
        currentMetricSettings.value.ValueBorderCheck.currentVal === '1'
          ? currentMetricSettings.value.ValueBorderMax.currentVal &&
            currentMetricSettings.value.ValueBorderMax.currentVal < 100
            ? 2
            : currentMetricSettings.value.ValueBorderMin.currentVal > 100
              ? 1
              : 5
          : undefined,
    },
    PreviousValue:
      currentMetricSettings.value.CompareWithPrevious.currentVal === '1'
        ? {
            Value:
              currentMetricSettings.value.CompareDiffViewType.currentVal === '1'
                ? '110 ₽'
                : currentMetricSettings.value.CompareDiffViewType.currentVal === '2'
                  ? '+10 ₽'
                  : '+10%',
            SystemColor:
              currentMetricSettings.value.CompareGoodOrBad.currentVal === '2'
                ? 2
                : currentMetricSettings.value.CompareGoodOrBad.currentVal === '-1'
                  ? 1
                  : 0,
          }
        : undefined,
    GroupDetails: currentMetricSettings.value.Grouping.currentVal
      ? [
          { Title: 'Проценты по договору', Value: '123' },
          { Title: 'Пени по договору', Value: '123' },
          { Title: 'Клиентский счет', Value: '123' },
          { Title: 'Предоплата по договору', Value: '123' },
          { Title: 'Курьер', Value: '123' },
        ]
      : undefined,
  }
})

watch(
  () => currentMetricSettings?.value?.Grouping?.currentVal,
  (value) => {
    if (
      !value &&
      [WidgetTypes.PieChart, WidgetTypes.DonutChart, WidgetTypes.TableView].includes(
        +widgetData.value.WidgetType.currentVal,
      )
    ) {
      widgetData.value.WidgetType.currentVal = widgetData.value.WidgetType.defaultVal
    }
  },
)
</script>

<style scoped lang="scss">
.widget-edit {
  $this: &;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__content {
    height: 100%;
    display: grid;
    grid-template-columns: auto 300px;
    overflow: hidden;
  }

  &__section {
    overflow: auto;
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &-block {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &-title {
        padding: 7.5px 0;
        font-family: Inter;
        font-weight: 600;
        font-size: 16px;
        line-height: 130%;
        letter-spacing: 0;
        vertical-align: middle;
        color: #23282f;
      }

      &-content {
        display: grid;
        align-items: start;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        width: 100%;
      }

      > * {
        overflow: hidden;
      }
    }
  }

  &__access-section {
    background: #f0f5f9;
    border-left: 1px solid #d5dde3;

    #{$this}__section-block-content {
      grid-template-columns: 1fr;
    }
  }

  &__footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    padding: 8px 30px;
    background-color: #f0f5f9;
    border-top: 1px solid #d5dde3;
    gap: 8px;

    &-actions-right {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
  }
}
</style>
