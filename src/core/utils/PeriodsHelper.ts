import {
  addHours,
  addDays,
  addMonths,
  addYears,
  startOfWeek,
  format,
  subDays,
  isBefore,
} from 'date-fns'

export enum TimeSpanPeriodType {
  Day = 10,
  Week = 20,
  ExactlyWeek = 25,
  Month = 30,
  ExactlyMonth = 35,
  Quarter = 40,
  HalfYear = 45,
  Year = 50,
  AllTime = 100,
  TillNow = 80,
}

// Получить период времени
export const getTimePeriod = (
  periodType: TimeSpanPeriodType,
  shiftSize: number,
): [Date, number] => {
  const now = new Date()
  console.log(now)
  const shiftedDate = doShift(periodType, now, shiftSize)
  console.log(shiftedDate)
  const startDate = getStartPeriod(periodType, shiftedDate)
  const span = getPeriodTimeSpan(periodType, startDate)

  return [startDate, span]
}

// Подсчитать сдвиг для заданного периода
const doShift = (periodType: TimeSpanPeriodType, fixedDate: Date, shiftSize: number): Date => {
  switch (periodType) {
    case TimeSpanPeriodType.Day:
      return addDays(fixedDate, shiftSize)
    case TimeSpanPeriodType.Week:
      return addDays(fixedDate, 7 * shiftSize)
    case TimeSpanPeriodType.Month:
      return addMonths(fixedDate, shiftSize)
    case TimeSpanPeriodType.Quarter:
      return addMonths(fixedDate, 3 * shiftSize)
    case TimeSpanPeriodType.HalfYear:
      return addMonths(fixedDate, 6 * shiftSize)
    case TimeSpanPeriodType.Year:
      return addYears(fixedDate, shiftSize)
    case TimeSpanPeriodType.TillNow:
    case TimeSpanPeriodType.AllTime:
      return fixedDate // В данном случае нет смещения
  }

  return new Date() // Вернуть текущее время, если не попали в условия
}

// Получить начало периода
const getStartPeriod = (periodType: TimeSpanPeriodType, fixedDate: Date): Date => {
  switch (periodType) {
    case TimeSpanPeriodType.Day:
      return new Date(fixedDate.setHours(0, 0, 0, 0))
    case TimeSpanPeriodType.Week:
      return startOfWeek(fixedDate, { weekStartsOn: 1 }) // Начало недели с понедельника
    case TimeSpanPeriodType.Month:
      return new Date(fixedDate.getFullYear(), fixedDate.getMonth(), 1)
    case TimeSpanPeriodType.Quarter:
      const quarterStartMonth = Math.floor(fixedDate.getMonth() / 3) * 3
      return new Date(fixedDate.getFullYear(), quarterStartMonth, 1)
    case TimeSpanPeriodType.HalfYear:
      const halfYearStartMonth = fixedDate.getMonth() < 6 ? 0 : 6
      return new Date(fixedDate.getFullYear(), halfYearStartMonth, 1)
    case TimeSpanPeriodType.Year:
      return new Date(fixedDate.getFullYear(), 0, 1)
    case TimeSpanPeriodType.AllTime:
    case TimeSpanPeriodType.TillNow:
      return new Date(0) // Эпоха Unix
  }

  return new Date() // Вернуть текущее время, если не попали в условия
}

// Получить длину периода в миллисекундах
const getPeriodTimeSpan = (periodType: TimeSpanPeriodType, startDate: Date): number => {
  switch (periodType) {
    case TimeSpanPeriodType.Day:
      return 24 * 60 * 60 * 1000 // 1 день в миллисекундах
    case TimeSpanPeriodType.Week:
      return 7 * 24 * 60 * 60 * 1000 // 1 неделя в миллисекундах
    case TimeSpanPeriodType.Month:
      return (
        new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate() *
        24 *
        60 *
        60 *
        1000
      ) // Количество дней в месяце
    case TimeSpanPeriodType.Quarter:
      return 3 * 30 * 24 * 60 * 60 * 1000 // Оценочно 3 месяца
    case TimeSpanPeriodType.HalfYear:
      return 6 * 30 * 24 * 60 * 60 * 1000 // Оценочно 6 месяцев
    case TimeSpanPeriodType.Year:
      return 365 * 24 * 60 * 60 * 1000 // 1 год в миллисекундах (без учета високосных)
    case TimeSpanPeriodType.AllTime:
      return Number.MAX_SAFE_INTEGER // Представление бесконечного времени
    case TimeSpanPeriodType.TillNow:
      return Date.now() - new Date(0).getTime() // С начала Unix эпохи до текущего момента
    default:
      return 0 // По умолчанию
  }
}

// Получить интервалы дат
export const getDateTimeIntervals = (
  dateFrom: Date,
  dateTo: Date,
  periodType: TimeSpanPeriodType,
): Date[] => {
  const result: Date[] = []
  const startDate = getStartPeriod(periodType, dateFrom)
  dateTo = new Date(dateTo) // Привести dateTo к типу Date, если это не так
  while (isBefore(startDate, dateTo)) {
    result.push(startDate)
    startDate.setTime(startDate.getTime() + getPeriodTimeSpan(periodType, startDate)) // Увеличить дату на размер периода
  }
  return result
}

// Получить строковые представления интервалов
export const getStringIntervals = (intervals: Date[], periodType: TimeSpanPeriodType): string[] => {
  return intervals.map((date) => {
    switch (periodType) {
      case TimeSpanPeriodType.Hour:
        return format(date, 'HH:mm') // Формат для часов
      case TimeSpanPeriodType.Week:
      case TimeSpanPeriodType.Day:
      case TimeSpanPeriodType.Quarter:
      case TimeSpanPeriodType.Month:
      case TimeSpanPeriodType.HalfYear:
      case TimeSpanPeriodType.Year:
      case TimeSpanPeriodType.AllTime:
      case TimeSpanPeriodType.TillNow:
        return format(date, 'yyyy-MM-dd') // Формат даты по умолчанию
      default:
        return format(date, 'yyyy-MM-dd') // На всякий случай
    }
  })
}

//
// // Enum for TimeSpanShiftDirection
// export enum TimeSpanShiftDirection {
//   Last = 'Last',
//   Future = 'Future',
//   Present = 'Present',
// }
//
// // Function to get the start of the period and the time span
// export const getTimePeriod = (
//   periodType: TimeSpanPeriodType,
//   shiftSize: number,
// ): [Date, number] => {
//   const now = new Date()
//   const shiftedDate = doShift(periodType, now, shiftSize)
//   let startDate = getStartPeriod(periodType, shiftedDate)
//   let span = getPeriodTimeSpan(periodType, startDate)
//
//   // Fix span and start date if span is negative
//   if (span < 0) {
//     span = -span
//     startDate = new Date(startDate.getTime() - span)
//   }
//
//   return [startDate, span]
// }
//
// // Function overload for getTimePeriod with direction
// export const getTimePeriodWithDirection = (
//   periodType: TimeSpanPeriodType,
//   directionType: TimeSpanShiftDirection,
//   shiftSize: number,
// ): [Date, number] => {
//   shiftSize = getActualShiftSize(directionType, shiftSize)
//   return getTimePeriod(periodType, shiftSize)
// }
//
// // Actual shift size calculation
// const getActualShiftSize = (directionType: TimeSpanShiftDirection, shiftSize: number): number => {
//   switch (directionType) {
//     case TimeSpanShiftDirection.Last:
//       return -shiftSize - 1 // Adjusting to last
//     case TimeSpanShiftDirection.Future:
//       return shiftSize + 1 // Adjusting to future
//     case TimeSpanShiftDirection.Present:
//       return 0 // Current period does not need adjustment
//   }
// }
//
// // TimeSpan calculation based on the period type
// const getPeriodTimeSpan = (periodType: TimeSpanPeriodType, startDate: Date): number => {
//   switch (periodType) {
//     case TimeSpanPeriodType.Day:
//       return 24 * 60 * 60 * 1000 // 1 day in milliseconds
//     case TimeSpanPeriodType.Week:
//       return 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
//     case TimeSpanPeriodType.Month:
//       return (
//         new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate() *
//         24 *
//         60 *
//         60 *
//         1000
//       ) // Month in milliseconds
//     case TimeSpanPeriodType.Quarter:
//       return (
//         new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0).getDate() *
//         24 *
//         60 *
//         60 *
//         1000
//       )
//     case TimeSpanPeriodType.HalfYear:
//       return (
//         new Date(startDate.getFullYear(), startDate.getMonth() + 6, 0).getDate() *
//         24 *
//         60 *
//         60 *
//         1000
//       )
//     case TimeSpanPeriodType.Year:
//       return new Date(startDate.getFullYear() + 1, 0, 0).getDate() * 24 * 60 * 60 * 1000 // Year in milliseconds
//     case TimeSpanPeriodType.AllTime:
//       return Number.MAX_SAFE_INTEGER // Simulating a very long period
//     case TimeSpanPeriodType.TillNow:
//       return Date.now() - new Date(1970, 0, 1).getTime() // From Unix epoch till now
//   }
//   return 0
// }
//
// // Shift the date based on the period type and shift size
// const doShift = (periodType: TimeSpanPeriodType, fixedDate: Date, shiftSize: number): Date => {
//   switch (periodType) {
//     case TimeSpanPeriodType.Day:
//       return addDays(fixedDate, shiftSize)
//     case TimeSpanPeriodType.Week:
//       return addDays(fixedDate, 7 * shiftSize)
//     case TimeSpanPeriodType.Month:
//       return addMonths(fixedDate, shiftSize)
//     case TimeSpanPeriodType.Quarter:
//       return addMonths(fixedDate, 3 * shiftSize)
//     case TimeSpanPeriodType.HalfYear:
//       return addMonths(fixedDate, 6 * shiftSize)
//     case TimeSpanPeriodType.Year:
//       return addYears(fixedDate, shiftSize)
//     case TimeSpanPeriodType.TillNow:
//     case TimeSpanPeriodType.AllTime:
//       return fixedDate
//   }
//   return new Date() // Fallback to now
// }
//
// // Get the start of the period based on the type
// const getStartPeriod = (periodType: TimeSpanPeriodType, fixedDate: Date): Date => {
//   switch (periodType) {
//     case TimeSpanPeriodType.Hour:
//       return new Date(fixedDate.setMinutes(0, 0, 0)) // Set to start of the hour
//     case TimeSpanPeriodType.Day:
//       return new Date(fixedDate.setHours(0, 0, 0, 0)) // Set to start of the day
//     case TimeSpanPeriodType.Week:
//       return startOfWeek(fixedDate, { weekStartsOn: 0 }) // Start of the week, assuming Sunday
//     case TimeSpanPeriodType.Month:
//       return new Date(fixedDate.getFullYear(), fixedDate.getMonth(), 1) // Start of the month
//     case TimeSpanPeriodType.Quarter:
//       const quarterStartMonth = Math.floor(fixedDate.getMonth() / 3) * 3
//       return new Date(fixedDate.getFullYear(), quarterStartMonth, 1) // Start of the quarter
//     case TimeSpanPeriodType.HalfYear:
//       const halfYearStartMonth = fixedDate.getMonth() < 6 ? 0 : 6
//       return new Date(fixedDate.getFullYear(), halfYearStartMonth, 1) // Start of the half year
//     case TimeSpanPeriodType.Year:
//       return new Date(fixedDate.getFullYear(), 0, 1) // Start of the year
//     case TimeSpanPeriodType.AllTime:
//     case TimeSpanPeriodType.TillNow:
//       return new Date(0) // Epoch time start
//   }
//   return new Date() // Fallback
// }
//
// // Get the available step period types based on the current period type
//
// // Generate string intervals based on DateTime array and TimeSpanPeriodType
// export const getStringIntervals = (intervals: Date[], periodType: TimeSpanPeriodType): string[] => {
//   switch (periodType) {
//     case TimeSpanPeriodType.Hour:
//       return intervals.map((i) => format(i, 'HH:mm')) // Custom format for hour
//     case TimeSpanPeriodType.Week:
//     case TimeSpanPeriodType.Day:
//     case TimeSpanPeriodType.Quarter:
//     case TimeSpanPeriodType.Month:
//     case TimeSpanPeriodType.HalfYear:
//     case TimeSpanPeriodType.Year:
//     case TimeSpanPeriodType.AllTime:
//     case TimeSpanPeriodType.TillNow:
//       return intervals.map((i) => format(i, 'MM/dd/yyyy')) // Default date format
//   }
//   return []
// }
//
// // Get DateTime intervals based on start and end dates and TimeSpanPeriodType
// export const getDateTimeIntervals = (
//   dateFrom: Date,
//   dateTo: Date,
//   periodType: TimeSpanPeriodType,
// ): Date[] => {
//   const result: Date[] = []
//   let startDate = getStartPeriod(periodType, dateFrom)
//
//   while (isBefore(startDate, dateTo)) {
//     result.push(startDate)
//     startDate = new Date(startDate.getTime() + getPeriodTimeSpan(periodType, startDate)) // Increment by period span
//   }
//   return result
// }
