import {
  validSTSNumber,
  clearDataForSTSNumber,
  validPTSNumber,
  clearDataForPTSNumber,
  validDriverLicenseNumber,
  clearDataForDriverLicense,
  validVINNumber,
} from './Validation'

function isLetter(char) {
  // Check if the character is a letter (including Cyrillic)
  return /^[a-zA-Z\u0400-\u04FF]$/.test(char)
}

type FormatterService = (value?: any) => any

export const formatSTSNumber = (value: string) => {
  let result = ''
  const clearedValue = clearDataForSTSNumber(value)

  if (validSTSNumber(clearedValue)) {
    let firstLetterChar = -1

    for (let i = 0; i < clearedValue.length; i++) {
      if (isLetter(clearedValue[i])) {
        firstLetterChar = i
        break
      }
    }

    if (firstLetterChar === -1) firstLetterChar = 2

    if (firstLetterChar === 2 || firstLetterChar === 3) {
      for (let i = 0; i < clearedValue.length; i++) {
        if (i === firstLetterChar) result += ' ' + clearedValue[i]
        else if (i === firstLetterChar + 1) result += clearedValue[i] + ' № '
        else result += clearedValue[i]
      }
    }

    return result
  }

  return value
}

export const formatPTSNumber = (value: string) => {
  let result = ''
  const clearedValue = clearDataForPTSNumber(value)

  if (validPTSNumber(clearedValue)) {
    let countLetters = 0

    for (const ch of clearedValue) {
      if (isLetter(ch)) {
        countLetters++
        if (countLetters === 1) result += ' ' + ch
        else if (countLetters === 2) result += ch + ' '
      } else {
        result += ch
      }
    }
    return result
  }
  return value
}
export const clearVINNumber = (number) => {
  let result = ''
  if (number && typeof number === 'string') {
    result = number.toUpperCase().trim().replace(/\s/g, '')
  }
  return result
}
export const formatVINNumber = (value: string) => {
  const clearedValue = clearVINNumber(value)
  if (validVINNumber(clearedValue)) {
    return clearedValue
  }
  return value
}
export const formatDriverLicenseNumber = (value: string) => {
  let result = ''
  const clearedValue = clearDataForDriverLicense(value)

  if (validDriverLicenseNumber(clearedValue)) {
    let firstLetterChar = -1

    for (let i = 0; i < clearedValue.length; i++) {
      if (isNaN(Number(clearedValue[i]))) {
        firstLetterChar = i
        break
      }
    }
    if (firstLetterChar === -1) firstLetterChar = 2

    if (firstLetterChar === 2 || firstLetterChar === 3) {
      for (let i = 0; i < clearedValue.length; i++) {
        if (i === firstLetterChar) result += ' ' + clearedValue[i]
        else if (i === firstLetterChar + 1) result += clearedValue[i] + ' № '
        else result += clearedValue[i]
      }
    }

    return result
  } else {
    return value
  }
}

// ---------- Formatter getter

export const getFormatService = (formatter?: string): FormatterService => {
  switch (formatter) {
    case 'STS': {
      return formatSTSNumber
    }
    case 'PTS': {
      return formatPTSNumber
    }
    case 'DriverLicence': {
      return formatDriverLicenseNumber
    }
    case 'VIN': {
      return formatVINNumber
    }
    default: {
      return (value: any) => value
    }
  }
}

export const formatPhoneNumber = (phoneNumber) => {
  // Удаляем все, кроме цифр
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Проверяем, что номер имеет 11 цифр (для формата +7)
  if (cleaned.length !== 11) {
    return phoneNumber
  }

  // Форматируем номер
  const countryCode = cleaned[0] // 7
  const cityCode = cleaned.slice(1, 4) // 495
  const firstPart = cleaned.slice(4, 7) // 933
  const secondPart = cleaned.slice(7, 9) // 13
  const thirdPart = cleaned.slice(9, 11) // 33

  return `+${countryCode} (${cityCode}) ${firstPart}-${secondPart}-${thirdPart}`
}
