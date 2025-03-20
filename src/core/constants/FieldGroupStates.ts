export enum FieldGroupStates {
  /// <summary>
  /// Поля группы не редактировались
  /// </summary>
  New = 0,
  /// <summary>
  /// Поля группы находятся в процессе редактирования
  /// </summary>
  EditValues = 1,
  /// <summary>
  /// Поля заполнены успешно
  /// </summary>
  EditSuccess = 2,
  /// <summary>
  /// Поля заполнены неуспешно
  /// </summary>
  EditFail = 3,
  /// <summary>
  /// Для заполнения полей требуется дополнительная информация
  /// </summary>
  NeedAddInfo = 4,
}

export const FieldGroupStatesTranslation = {
  [FieldGroupStates.New]: 'Поля группы не редактировались',
  [FieldGroupStates.EditValues]: 'Поля группы находятся в процессе редактирования',
  [FieldGroupStates.EditSuccess]: 'Поля заполнены успешно',
  [FieldGroupStates.EditFail]: 'Ошибка редактирования',
  [FieldGroupStates.NeedAddInfo]: 'Для заполнения полей требуется дополнительная информация',
}
