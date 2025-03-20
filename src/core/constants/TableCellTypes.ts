export enum TableCellTypes {
  Untyped     =   -1,
  /// <summary>
  /// Текстовое или строковое поле
  /// </summary>
  Text        =   0,
  /// <summary>
  /// Код объекта
  /// </summary>
  Id          =   1,
  /// <summary>
  /// Базовый объект, в строке сериализованный объект
  /// </summary>
  BaseObject  =   2,
  /// <summary>
  /// Флаги
  /// </summary>
  Flags       =   3,
  /// <summary>
  /// Телефон
  /// </summary>
  Phone       =   5,
  /// <summary>
  /// Почта
  /// </summary>
  Email       =   6,
  /// <summary>
  /// Паспортные данные
  /// </summary>
  Passport    =   7,
  /// <summary>
  /// Имя иконки
  /// </summary>
  Icon = 8,
}