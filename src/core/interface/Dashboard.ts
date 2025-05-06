import { WidgetTypes } from '@/core/constants/DashboardWidgetTypes'
import type { IObjectTable } from '@/core/interface/Object'

export interface DashboardFavoritiesModuleItem {
  id: string
  groupId: string
  viewId: string
  title: string
  subtitle: string
  backgroundColor: string
  icon: string
  iconColor: string
  hasTableWidget: boolean
  hasTableData: boolean
}

export interface MetricWidgetDto {
  DataLoaded?: boolean
  /// <summary>
  /// Код виджета из списка виджетов группы
  /// </summary>
  WidgetGuid: string
  /// <summary>
  /// Название виджета из списка виджетов группы
  /// </summary>
  Name: string
  /// <summary>
  /// Код параметров метрики виджета
  /// </summary>
  MetricId: number
  /// <summary>
  /// Основной показатель - текущее значение
  /// </summary>
  CurrentValue: any
  /// <summary>
  /// Основной показатель - предудущее значение
  /// </summary>
  PreviousValue: any
  /// <summary>
  /// Детализация значений (группировка)
  /// </summary>
  GroupDetails: any
  /// <summary>
  /// Текущий тип представления сравнения
  /// </summary>
  DiffViewType: any
  /// <summary>
  /// Текущий тип детализации значений
  /// </summary>
  GroupField: string
  /// <summary>
  /// Доступные типы представления сравнения значений основного показателя
  /// </summary>
  AppliableDiffViewType: any
  /// <summary>
  /// Доступные типы для детализации значений
  /// </summary>
  AppliableGrouping: any
  /// <summary>
  /// тип виджета
  /// </summary>
  WidgetType: WidgetTypes
  /// <summary>
  /// Нужно для win-версий, чтобы открывать настройки
  /// </summary>
  WidgetInfoFull: any
  PieValues?: number[]
  PieLabels?: string[]
  LineChart?: {
    categories: string[]
    categoriesPrev?: string[]
    datasets: {
      name: string
      data: number[]
    }[]
  }
  TableData: IObjectTable
}
export interface MetricGroupDto {
  Id: number
  Name: string
  Widgets: MetricWidgetDto[]
  AllowEdit: boolean
}

export interface MetricEditDto {
  WidgetGroupId: string
  WidgetGuid: string
  tbWidgetName: string
  ddlMetricType: string
  WidgetType: WidgetTypes
  infoWorker: string
  ddlExecutorType: string
  lstUsers: string
  ctrlDictsRoles: string
  ddlPeriodType: string
  ddlPeriodDirectionType: string
  ctrlPeriodShiftSize: string
  ddlAggType: string
  ddlAggColumn?: string
  ddlGroupings?: string
  ddlDateTimeParam: string
  txtSqlFunction?: string
  chbCompareWithPreviousPeriod: string
  ddlCompareSettings: string
  chbBorders: string
  ctrlMinMediumValue: string
  ctrlMaxMediumValue: string
  Filter?: string
}
