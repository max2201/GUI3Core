/// <summary>
/// Базовая цветовая схема, соответсвущая статусу или состоянию элемента
/// </summary>
export enum SystemColorsValue {
  /// <summary>
  /// Неизвестный статус отображения
  /// </summary>
  Unknown = -1,
  /// <summary>
  /// Стандартный, дефолтный вид элемента
  /// </summary>
  Normal = 0,
  /// <summary>
  /// Опасность, красный
  /// </summary>
  Danger = 1,
  /// <summary>
  /// Завершенный результат, зеленый
  /// </summary>
  Result = 2,
  /// <summary>
  /// Предупреждение, желтый
  /// </summary>
  Warning = 3,
  /// <summary>
  /// Элемент недоступен, серый
  /// </summary>
  Disabled = 4,
  /// <summary>
  /// Синий
  /// </summary>
  Blue = 5,
  /// <summary>
  /// Бирюзовый
  /// </summary>
  Teal = 6,
  /// <summary>
  /// Фиолетовый
  /// </summary>
  Violet = 7,
}

export type SystemColor = {
  primary: string
  secondary: string
}

export const systemColorsMap: {
  [key in SystemColorsValue]: SystemColor
} = {
  // Не уверен
  [SystemColorsValue.Unknown]: {
    primary: '',
    secondary: '',
  },
  // Не уверен
  [SystemColorsValue.Normal]: {
    primary: '#23282F',
    secondary: '',
  },
  [SystemColorsValue.Danger]: {
    primary: '#F8393A',
    secondary: '#FFF4EF',
  },
  [SystemColorsValue.Result]: {
    primary: '#66AA61',
    secondary: '#EBFAE5',
  },
  [SystemColorsValue.Warning]: {
    primary: '#FBA600',
    secondary: '#FFFDE3',
  },
  [SystemColorsValue.Disabled]: {
    primary: '#8990A2',
    secondary: '#F0F5F9',
  },
  [SystemColorsValue.Blue]: {
    primary: '#1A8FF2',
    secondary: '#E6F4FF',
  },
  [SystemColorsValue.Teal]: {
    primary: '#30D5C8',
    secondary: '#BAF9F9',
  },
  [SystemColorsValue.Violet]: {
    primary: '#B86FE4',
    secondary: '#F9D3F8',
  },
}

// function getCssVariableValue(variableName: string): string {
//   return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
// }
//
// export const systemColorsMap: {
//   [key in SystemColorsValue]: SystemColor;
// } = {
//   [SystemColorsValue.Unknown]: {
//     primary: getCssVariableValue('--color-unknown-primary'),
//     secondary: getCssVariableValue('--color-unknown-secondary'),
//   },
//   [SystemColorsValue.Normal]: {
//     primary: getCssVariableValue('--color-normal-primary'),
//     secondary: '',
//   },
//   [SystemColorsValue.Danger]: {
//     primary: getCssVariableValue('--color-danger-primary'),
//     secondary: getCssVariableValue('--color-danger-secondary'),
//   },
//   [SystemColorsValue.Result]: {
//     primary: getCssVariableValue('--color-result-primary'),
//     secondary: getCssVariableValue('--color-result-secondary'),
//   },
//   [SystemColorsValue.Warning]: {
//     primary: getCssVariableValue('--color-warning-primary'),
//     secondary: getCssVariableValue('--color-warning-secondary'),
//   },
//   [SystemColorsValue.Disabled]: {
//     primary: getCssVariableValue('--color-disabled-primary'),
//     secondary: getCssVariableValue('--color-disabled-secondary'),
//   },
//   [SystemColorsValue.Blue]: {
//     primary: getCssVariableValue('--color-blue-primary'),
//     secondary: getCssVariableValue('--color-blue-secondary'),
//   },
//   [SystemColorsValue.Teal]: {
//     primary: getCssVariableValue('--color-teal-primary'),
//     secondary: '',
//   },
//   [SystemColorsValue.Violet]: {
//     primary: getCssVariableValue('--color-violet-primary'),
//     secondary: getCssVariableValue('--color-violet-secondary'),
//   }
// }
