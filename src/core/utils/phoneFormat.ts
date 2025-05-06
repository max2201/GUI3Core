/**
 * Утилиты для работы с форматированием телефонных номеров
 */

/**
 * Форматирует телефонный номер в формат +7 (XXX) XXX-XXXX
 * @param value Телефонный номер в любом формате
 * @returns Отформатированный телефонный номер
 */
export const formatPhoneNumber = (value: string | null | undefined): string => {
  if (!value) return ''

  // Очищаем телефон от всех нецифровых символов
  let cleanNumber = value.toString().replace(/\D/g, '')

  // Если начинается с 8, меняем на 7 (для российских номеров)
  if (cleanNumber.startsWith('8') && cleanNumber.length > 1) {
    cleanNumber = '7' + cleanNumber.substring(1)
  }

  // Если пользователь ввел номер без кода страны, добавляем 7
  if (cleanNumber.length > 0 && !cleanNumber.startsWith('7')) {
    cleanNumber = '7' + cleanNumber
  }

  // Форматируем номер в виде +7 (XXX) XXX-XXXX
  if (cleanNumber.length >= 1) {
    let formatted = '+'

    if (cleanNumber.length >= 1) {
      formatted += cleanNumber.substring(0, 1)
    }

    if (cleanNumber.length >= 4) {
      formatted += ' (' + cleanNumber.substring(1, 4) + ')'
    } else if (cleanNumber.length > 1) {
      formatted += ' (' + cleanNumber.substring(1) + '_'.repeat(Math.max(0, 3 - (cleanNumber.length - 1))) + ')'
    } else {
      formatted += ' (___)'
    }

    if (cleanNumber.length >= 7) {
      formatted += ' ' + cleanNumber.substring(4, 7)
    } else if (cleanNumber.length > 4) {
      formatted += ' ' + cleanNumber.substring(4) + '_'.repeat(Math.max(0, 3 - (cleanNumber.length - 4)))
    } else {
      formatted += ' ___'
    }

    // Изменяем формат последней группы цифр с XX-XX на XXXX
    if (cleanNumber.length >= 11) {
      formatted += '-' + cleanNumber.substring(7, 11)
    } else if (cleanNumber.length > 7) {
      let remaining = cleanNumber.substring(7)
      formatted += '-' + remaining + '_'.repeat(Math.max(0, 4 - remaining.length))
    } else {
      formatted += '-____'
    }

    return formatted
  }

  return ''
}

/**
 * Форматирует телефонный номер в формат (XXX) XXX-XXXX без кода страны
 * @param value Телефонный номер в любом формате
 * @returns Отформатированный телефонный номер
 */
export const formatShortPhoneNumber = (value: string | null | undefined): string => {
  if (!value) return ''

  // Очищаем телефон от всех нецифровых символов
  let cleanNumber = value.toString().replace(/\D/g, '')

  // Если начинается с кода страны (7 или 8), удаляем его
  if ((cleanNumber.startsWith('7') || cleanNumber.startsWith('8')) && cleanNumber.length > 1) {
    cleanNumber = cleanNumber.substring(1)
  }

  // Форматируем номер в виде (XXX) XXX-XXXX
  if (cleanNumber.length > 0) {
    let formatted = ''

    if (cleanNumber.length >= 3) {
      formatted += '(' + cleanNumber.substring(0, 3) + ')'
    } else {
      formatted += '(' + cleanNumber + '_'.repeat(Math.max(0, 3 - cleanNumber.length)) + ')'
    }

    if (cleanNumber.length >= 6) {
      formatted += ' ' + cleanNumber.substring(3, 6)
    } else if (cleanNumber.length > 3) {
      formatted += ' ' + cleanNumber.substring(3) + '_'.repeat(Math.max(0, 3 - (cleanNumber.length - 3)))
    } else {
      formatted += ' ___'
    }

    if (cleanNumber.length >= 10) {
      formatted += '-' + cleanNumber.substring(6, 10)
    } else if (cleanNumber.length > 6) {
      let remaining = cleanNumber.substring(6)
      formatted += '-' + remaining + '_'.repeat(Math.max(0, 4 - remaining.length))
    } else {
      formatted += '-____'
    }

    return formatted
  }

  return ''
}

/**
 * Получает оригинальный номер телефона (только цифры) из отформатированного номера
 * @param value Отформатированный телефонный номер
 * @returns Телефонный номер, содержащий только цифры
 */
export const getOriginalPhone = (value: string | null | undefined): string => {
  if (!value) return ''
  return value.toString().replace(/\D/g, '')
}

/**
 * Создает объект маски для телефонного номера для использования с библиотекой maska
 * @returns Объект конфигурации маски для телефонного номера
 */
export const getPhoneMask = () => {
  return {
    mask: '+7 (###) ###-####',
    eager: true,
    preProcess: (value: string) => {
      // Удаляем все не цифры
      let processed = value.replace(/\D/g, '')

      // Если начинается с 8, меняем на 7 (для российских номеров)
      if (processed.startsWith('8') && processed.length > 1) {
        processed = '7' + processed.substring(1)
      }

      // Если пользователь ввел номер без кода страны, добавляем 7
      if (processed.length > 0 && !processed.startsWith('7')) {
        processed = '7' + processed
      }

      return processed
    },
    postProcess: (value: string) => {
      return value
    }
  }
}

/**
 * Создает объект маски для короткого формата телефонного номера (без кода страны)
 * @returns Объект конфигурации маски для короткого формата телефона
 */
export const getShortPhoneMask = () => {
  return {
    mask: '(###) ###-####',
    eager: true,
    preProcess: (value: string) => {
      // Удаляем все не цифры
      let processed = value.replace(/\D/g, '')

      // Если начинается с кода страны (7 или 8), удаляем его
      if ((processed.startsWith('7') || processed.startsWith('8')) && processed.length > 1) {
        processed = processed.substring(1)
      }

      return processed
    },
    postProcess: (value: string) => {
      return value
    }
  }
} 