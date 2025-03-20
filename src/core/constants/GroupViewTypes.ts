export enum GroupViewTypes {
  /// <summary>
  /// классическая группа
  /// </summary>
  PanelList = 0,
  /// <summary>
  /// группа разделенная на две части
  /// </summary>
  DoublePanelList = 1,
  /// <summary>
  /// группа с открывающейся детализацией (либо просто текст или список панелей)
  /// </summary>
  LinkedPanels = 2,
  /// <summary>
  /// квадраты с общей информацией
  /// </summary>
  NumbersGroup = 3,
  /// <summary>
  /// Нужен для отображения сводки по объекту. Значения идут через слеш под названием панели
  /// </summary>
  SummaryInfo = 4,
}
