import { markRaw, toRaw, unref } from 'vue'
import type { ComputedRef } from 'vue'
import type { IUiObjectStepField } from '@/core/interface/Object'
import { FieldType } from '@/core/constants/FieldType'

export type ObjectStepsForm = Record<string, any>

export const useObjectFieldServices = (fields: ComputedRef<IUiObjectStepField[]>) => {
  const configurationStore = useConfigurationStore()
  const { Dictionaries } = storeToRefs(configurationStore)

  const getFieldOptions = (field: IUiObjectStepField) => {
    if (field.AviableValues) {
      return field.AviableValues.split(',')
    }

    if (field.FieldType.slice(0, 4) === 'dict') {
      const foundDictionaries = Dictionaries.value.find(
        (dict) => dict.Code === field.FieldType.slice(5),
      )
      return foundDictionaries?.Values || []
    }

    if (field.FieldType.slice(0, 8) === 'editdict') {
      const foundDictionaries = Dictionaries.value.find(
        (dict) => dict.Code === field.FieldType.slice(9),
      )
      return foundDictionaries?.Values || []
    }

    return []
  }

  const form = ref<ObjectStepsForm>({})

  const modifiedFields = computed<Record<string, boolean | Record<string, boolean>>>(() => {
    return (toRaw(unref(fields)) || []).reduce(
      (acc, field) => {
        if (field.SubFields) {
          if (!form.value[field.Code]) {
            acc[field.Code] = false
            return acc
          }

          acc[field.Code] = field.SubFields.some(
            (subField) => form.value[field.Code][subField.Code] !== subField.Value,
          )
          return acc
        }

        acc[field.Code] = form.value[field.Code] !== field.Value
        return acc
      },
      {} as Record<string, boolean | Record<string, boolean>>,
    )
  })

  const hasModifiedField = computed(() => {
    return Object.values(modifiedFields.value).some((value) => value)
  })

  const updateFormFieldsFromSteps = (newFields: IUiObjectStepField[] | undefined) => {
    const newRawFields = markRaw(toRaw(unref(newFields || [])))
    if (!newRawFields.length) {
      form.value = {}
      return
    }
    form.value = newRawFields.reduce((acc, field) => {
      if (field.SubFields) {
        if (field.SubFields.length === 0) {
          acc[field.Code] = field.Value
        } else {
          acc[field.Code] = field.SubFields.reduce((accSubs, subfield) => {
            accSubs[subfield.Code] = subfield.Value
            return accSubs
          }, {})
        }

        return acc
      }
      if (field.FieldType?.startsWith(FieldType.Complex)) {
        acc[field.Code] = field.ComplexValue
        return acc
      }

      acc[field.Code] = field.Value
      return acc
    }, {})
  }

  const changeFieldValue = (fieldType: string, value: any) => {
    if (form.value[fieldType] === undefined) return
    form.value[fieldType] = value
  }

  const cancelChangesInForm = () => {
    if (fields.value === '') return
    updateFormFieldsFromSteps(fields.value)
  }

  const focusNextField = (index: number) => {
    const rawFields = unref(fields) || []
    if (rawFields.length - 1 === index) {
      return
    }

    const nextIndex = index + 1
    const field = rawFields[nextIndex]

    if (!field?.Code) return

    EventBus.emit(GlobalEvents.FocusElement, field.UiId)
  }

  return {
    form,
    modifiedFields,
    hasModifiedField,
    updateFormFieldsFromSteps,
    changeFieldValue,
    getFieldOptions,
    cancelChangesInForm,
    focusNextField,
  }
}
