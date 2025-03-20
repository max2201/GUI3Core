export interface DashboardFavoritiesModuleItem {
  id: string
  groupId: string
  viewId: string
  title: string
  subtitle: string
  backgroundColor: string
  icon: string
  iconColor: string
}

export interface MetricWidgetDto {
  DataLoaded: boolean
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
  /// Нужно для win-версии, чтобы открывать настройки
  /// </summary>
  WidgetInfoFull: any
}
export interface MetricGroupDto {
  Id: number
  Name: string
  Widgets: MetricWidgetDto[]
  AllowEdit: boolean
}
