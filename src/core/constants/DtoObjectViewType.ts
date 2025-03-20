export enum DtoObjectViewType {
  Unknown = -1,
  ContexView = 0,
  LiteView = 1,
  PrimaryView = 2,
  Tooltip = 3,
  KanbanCard = 4,
  PrimaryEdit = 5,
  /// <summary>
  /// Данный тип служит для отображения вспомогательных форм в контексте базового объекта
  /// (например, форма лицевого счета клиента)
  /// </summary>
  CustomView = 6,
}
