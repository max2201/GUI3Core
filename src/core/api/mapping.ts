import type { IModuleFilter, IModuleFilterFieldValue } from '@/core/interface/Auth'
import { FilterFieldTypes } from '@/core/interface/Auth'
import type { ISelect } from '@/core/interface/Ui'

// по значениям апи поляиндексов 0,1,3 возвращет массив селектов
export const apiSelectIndexToInterface = (v: string, options: ISelect[], type: number) => {
  let startingIndex = 0

  if ([FilterFieldTypes.CheckedList, FilterFieldTypes.Flags].includes(type)) {
    startingIndex = 1
  }

  const values = v.split(',')

  if (values.length >= 2) {
    return options?.filter((option) => values.includes(option.value))
  }

  return options?.find((option) => option.value === v) || null
}

// по значениям полей возвращает индексы
export const interfaceToApiIndex = (v: string, options: ISelect[], type: number) => {
  let startingIndex = 0
  if ([FilterFieldTypes.CheckedList, FilterFieldTypes.Flags].includes(type)) {
    startingIndex = 1
  }

  const valuesArr = v.split(',')
  const indexesFound = [] as number[]

  valuesArr.forEach((id) => {
    const index = options?.findIndex((x, idx) => x.value === id)
    if (index !== -1) indexesFound.push(index + startingIndex)
  })

  return indexesFound.join(',')
}

// создает опции для селекта
export const apiSelectValuesToInterface = (
  values?: IModuleFilterFieldValue[] | null
): ISelect[] => {
  return (
    values?.map((x) => ({
      value: x.Value,
      label: x.Title,
    })) || []
  )
}

// проверка по enum
export const isSelectLikeType = (type: number) => {
  return [
    FilterFieldTypes.Combobox,
    FilterFieldTypes.CheckedList,
    FilterFieldTypes.FilialsList,
    FilterFieldTypes.FilialsCheckedList,
    FilterFieldTypes.Flags,
    FilterFieldTypes.CompanyList,
    FilterFieldTypes.UserList,
  ].includes(type)
}

export const isMultipleSelectType = (type: number) => {
  return [
    FilterFieldTypes.CheckedList,
    FilterFieldTypes.FilialsCheckedList,
    FilterFieldTypes.Flags,
  ].includes(type)
}

// Используется при сохранении пользовательского модуля
// Преобразует фильтр пользователя в поля интерфейса
export const userFilterToInterface = (filter: IModuleFilter) => {
  const getFieldValue = (field) => {
    let updatedFieldValue: any = field.currentVal

    if (field.currentVal === field.defaultVal) return null

    if (isSelectLikeType(field.type)) {
      updatedFieldValue =
        apiSelectIndexToInterface(
          field.currentVal,
          apiSelectValuesToInterface(field.values),
          field.type
        ) || null
    } else if (field.type === FilterFieldTypes.Date) {
      updatedFieldValue = field.currentVal || null
    }

    if (updatedFieldValue) {
      return {
        id: field.id,
        value: updatedFieldValue,
      }
    }

    return null
  }

  const filterFields = [] as any
  const dataFields = [...filter.PrimaryFields, ...filter.SecondaryFields]

  dataFields.forEach((field) => {
    const updatedFieldValue = getFieldValue(field)
    if (updatedFieldValue) filterFields.push(updatedFieldValue)

    field.subItems?.forEach((subfield) => {
      const updatedFieldValue = getFieldValue(subfield)
      if (updatedFieldValue) filterFields.push(updatedFieldValue)
    })
  })

  const returnable = {
    fields: filterFields,
    txtSmartFilter: filter.SmartFilterValue || '',
  }

  return returnable
}
