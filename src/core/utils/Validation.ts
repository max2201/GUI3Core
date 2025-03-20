/* eslint-disable no-useless-escape */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import moment, { type Moment } from 'moment'

dayjs.extend(customParseFormat)

type ValidatorService = (value?: any, ...args: any[]) => any

export const clearString = (v: string, removeSpaces?: boolean) => {
  let value = ''
  if (typeof v === 'string') {
    value = v.trim()
  } else if (typeof v === 'number') {
    value = `${v}`
  }

  if (removeSpaces) {
    value = value.replaceAll(' ', '').replaceAll('-', '')
  }

  return value
}

export const isValidNumber = (v: any) => {
  return Number.isFinite(+v)
}

export const clearPhone = (str: string) => {
  let num = str.replace(/\+7 \(/, '')
  num = num.replace(/\) /, '')
  num = num.replace(/-/, '')
  num = num.replace(/-/, '')

  return num
}

export const validPhone: ValidatorService = (value: string) => {
  value = value || ''
  let valid = true
  const arr: string[] = []
  const num = clearPhone(value)

  if (num.length !== 10) {
    valid = false
    arr.push('Номер телефона должен состоять из 10 цифр.')
  }

  if (![3, 4, 5, 6, 8, 9].includes(+num[0])) {
    valid = false
    arr.push('Проверьте код оператора или региона.')
  }

  return {
    valid,
    phone_error_text: arr.join(' '),
  }
}

export const validEmail: ValidatorService = (v: string) => {
  const value = clearString(v)

  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return reg.test(value)
}

export const validAdress = (v: string) => {
  const value = clearString(v)

  return value.split(' ').length >= 2 && /\d+/.test(value)
}

export function validDate(value = '', dateNow?: string) {
  const djsObj = dayjs(value) // 'DD/MM/YYYY', true - usemask

  if (!djsObj.isValid()) return false
  if (djsObj.year() < 1920) return false
  if (djsObj.isAfter(dayjs(dateNow))) return false

  return djsObj
}

export const dateMask = {
  mask: 'D#/M#/Y###',
  tokens: {
    D: { pattern: /[0-3]/ },
    M: { pattern: /[0-1]/ },
    Y: { pattern: /[1-2]/ },
  },
}

export const clearDataForSTSNumber = (stsNUmber: string) => {
  let result = ''
  if (stsNUmber) {
    result = stsNUmber.trim().toUpperCase().replaceAll(' ', '').replaceAll('№', '')
  }

  return result
}

export const validSTSNumber: ValidatorService = (stsNUmber: string) => {
  let result = false
  stsNUmber = clearDataForSTSNumber(stsNUmber)

  if ((stsNUmber.length === 10 || stsNUmber.length === 11) && /^[А-ЯЁ0-9]+$/.test(stsNUmber)) {
    const chars = stsNUmber.split('')
    let firstLetter = -1
    let secondLetter = -1
    let countLetter = 0
    let afterNumbersCount = 0

    for (let i = 0; i < chars.length; i++) {
      if (isNaN(Number(chars[i]))) {
        countLetter++
        if (firstLetter === -1) firstLetter = i
        else secondLetter = i
      } else if (!isNaN(Number(chars[i])) && secondLetter > -1) {
        afterNumbersCount++
      }
    }

    if (
      countLetter === 0 ||
      (countLetter === 1 && (firstLetter === 2 || firstLetter === 3)) ||
      (countLetter === 2 &&
        (firstLetter === 2 || firstLetter === 3) &&
        secondLetter - firstLetter === 1)
    )
      result = true
  }

  return result
}

export const clearDataForPTSNumber = (number) => {
  let result = ''
  if (number && typeof number === 'string') {
    result = number.toUpperCase().trim().replace(/\s/g, '')
  }
  return result
}

export const validPTSNumber = (number) => {
  let result = false
  number = clearDataForPTSNumber(number)
  if ((number.length === 10 || number.length === 11) && /^[А-ЯЁ0-9]+$/.test(number)) {
    const chars = number.split('')
    let firstLetter = -1
    let secondLetter = -1
    let countLetter = 0
    let afterNumbersCount = 0

    for (let i = 0; i < chars.length; i++) {
      if (/[А-ЯЁ]/.test(chars[i])) {
        countLetter++
        if (firstLetter === -1) {
          firstLetter = i
        } else {
          secondLetter = i
        }
      } else if (/\d/.test(chars[i]) && secondLetter > -1) {
        afterNumbersCount++
      }
    }

    if (
      countLetter === 2 &&
      (firstLetter === 2 || firstLetter === 3) &&
      secondLetter - firstLetter === 1 &&
      afterNumbersCount === 6
    ) {
      result = true
    }
  } else if (number.length === 15 && /^\d+$/.test(number)) {
    // проверяем на электронный ПТС - пример - 164301000021488
    result = true
  }
  return result
}

const LicenseNumberRegex = new RegExp('^[А-ЯЁ0-9]+$')
const LetterRegex = new RegExp('[A-ZА-ЯЁ]')
const MAndYDateRegex = new RegExp('[0-9][0-9].[0-9][0-9][0-9][0-9]')

export const clearDataForDriverLicense = (value: string) => {
  let result = ''
  if (value) result = value.trim().toUpperCase().replaceAll(' ', '').replaceAll('№', '')
  return result
}

export const validDriverLicenseNumber = (value: string) => {
  let result = false
  const clearedValue = clearDataForDriverLicense(value)

  if (
    (clearedValue.length == 10 || clearedValue.length == 11) &&
    clearedValue.match(LicenseNumberRegex)
  ) {
    let firstLetter = -1
    let secondLetter = -1
    let countLetter = 0
    let afterNumbersCount = 0

    for (let i = 0; i < clearedValue.length; i++) {
      if (clearedValue.slice(i, i + 1).match(LetterRegex)) {
        countLetter++

        if (firstLetter == -1) {
          firstLetter = i
        } else {
          secondLetter = i
        }
      } else if (!isNaN(Number(clearedValue[i])) && secondLetter > -1) {
        afterNumbersCount++
      }
    }

    if (
      countLetter == 0 ||
      (countLetter == 1 && (firstLetter == 2 || firstLetter == 3)) ||
      (countLetter == 2 &&
        (firstLetter == 2 || firstLetter == 3) &&
        secondLetter - firstLetter == 1)
    )
      result = true
  }

  return result
}

const validateExpirienceValue = (value) => {
  const trimedValue = (value || '').trim()

  if (trimedValue.match(LetterRegex)) {
    return 'Значение не должно содержать буквы'
  }
  if (trimedValue.length === 4) {
    const numberValue = Number(trimedValue)

    if (!Number.isInteger(numberValue)) {
      return 'Год должен быть целым числом'
    }

    if (numberValue <= 1925) {
      return 'Кажется, это было очень давно...'
    }

    if (numberValue > Number(moment().format('YYYY'))) {
      return 'Год не может быть больше чем дата получения прав'
    }

    return null
  }

  if (trimedValue.length === 7) {
    if (trimedValue.indexOf('.') !== 2) {
      return 'Формат даты должен быть "MM.YYYY"'
    }
    if (!trimedValue.match(MAndYDateRegex)) {
      return 'Дата не соответствует формату "MM.YYYY"'
    }
    return null
  }
  return 'Формат даты должен быть "MM.YYYY"'
}

const validDriverExperience = (value: string, currentLicenseStart: string) => {
  const isValueValid = validateExpirienceValue(value)
  if (isValueValid !== null) return isValueValid
  const trimmedValue = value.trim()
  const expMoment = trimmedValue.includes('.')
    ? moment(trimmedValue, 'MM.YYYY', true) // Если содержит точку, значит MM.YYYY
    : moment(trimmedValue, 'YYYY', true) // Иначе только год
  if (!expMoment.isValid()) {
    return 'Некорректный формат даты. Ожидается MM.YYYY или YYYY.'
  }
  const licenseMoment = moment(currentLicenseStart, 'DD.MM.YYYY', true)
  if (!licenseMoment.isValid()) {
    return null
  }
  const expMomentAdjusted = trimmedValue.includes('.')
    ? expMoment.startOf('month')
    : expMoment.startOf('year')
  return licenseMoment.isSameOrAfter(expMomentAdjusted)
    ? null
    : 'Год не может быть больше чем дата получения прав'
}

export const validVINNumber = (vin: string) => {
  const normalizedVin = vin.toUpperCase()

  if (normalizedVin.length !== 17) {
    return false
  }
  const forbiddenChars = /[IOQ]/
  if (forbiddenChars.test(normalizedVin)) {
    return false
  }

  const validChars = /^[A-Z0-9]+$/
  if (!validChars.test(normalizedVin)) {
    return false
  }

  return true
}

export const validPassportRfNumber = (number: string) => {
  if (number.length === 6) {
    const numbersOnly = number.replace(/[^\d]/g, '')
    if (numbersOnly?.length === 6) {
      return true
    }
  }
  return false
}

export const validPassportRfSeria = (number: string) => {
  if (number.length === 4) {
    const numbersOnly = number.replace(/[^\d]/g, '')
    if (numbersOnly?.length === 4) {
      return true
    }
  }

  return false
}
export const validPassportRfIssuedPlaceNo = (placeNo: string) => {
  const trimmedValue = placeNo.trim()
  if (trimmedValue.length === 7) {
    const numbersOnly = trimmedValue.replace(/[^\d]/g, '')
    if (numbersOnly?.length === 6 && trimmedValue[3] === '-') {
      return true
    }
  }

  return false
}
export const validPassportResidenceNumber = (number: string) => {
  const val = number.trim()
  const regexp = /^\d{2}№\d{7}$/
  const regexp2 = /^\d{2} \d{7}$/
  const regexp3 = /^\d{9}$/

  return regexp.test(val) || regexp2.test(val) || regexp3.test(val)
}

// ---------- Validator getter

export const getValidationService = (validator?: string): ValidatorService => {
  switch (validator) {
    case 'STS': {
      return validSTSNumber
    }
    case 'PTS': {
      return validPTSNumber
    }
    case 'DriverLicence': {
      return validDriverLicenseNumber
    }
    case 'DriverExperience': {
      return validDriverExperience
    }
    case 'VIN': {
      return validVINNumber
    }
    case 'PassportRfSeria': {
      return validPassportRfSeria
    }
    case 'PassportRfNumber': {
      return validPassportRfNumber
    }
    case 'PassportRfIssuedPlaceNo': {
      return validPassportRfIssuedPlaceNo
    }
    case 'PassportResidenceNumber': {
      return validPassportResidenceNumber
    }
    default: {
      return () => undefined
    }
  }
}
