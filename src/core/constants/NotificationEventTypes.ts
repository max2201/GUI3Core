export enum NotificationEventTypes {
  Unknown         = -1,
  /// <summary>
  /// Пропущеный звонок
  /// </summary>
  MissedCall      = 0,
  NewItem         = 1,
  ItemChange      = 2,
  ClientRecall    = 3,
  TaskStarted     = 4,
  TaskFinished    = 5,
  FeedBack        = 6,
  System          = 7,
  TpsEvent        = 8,
  /// <summary>
  /// Нетепизированное уведомление
  /// </summary>
  Common          = 9
}