<template>
  <UiInput1
    v-if="field.type === FilterFieldTypes.Text"
    :label="fieldLabel"
    :disabled="field.disabled"
    :has-modified="valueHasModified"
    highlight-not-empty
    :type="field.id === 'txtComment' ? 'textarea' : 'text'"
    :model-value="fieldValue"
    :error="field.error?.reason"
    @update:model-value="handleFieldChange($event, field)"
  />

  <UiDatepicker
    v-else-if="field.type === FilterFieldTypes.Date"
    :label="fieldLabel"
    :model-value="fieldValue"
    :placeholder="field.title"
    :disabled="field.disabled"
    :has-modified="valueHasModified"
    clearable
    @update:model-value="(v) => handleFieldChange(v, field)"
  />

  <UiCheckbox1
    v-else-if="field.type === FilterFieldTypes.CheckBox"
    :label="fieldLabel"
    :model-value="fieldValue"
    @update:model-value="handleFieldChange(fieldValue, field)"
    :disabled="field.disabled"
  >
    {{ field.title }}
  </UiCheckbox1>

  <UiSelect1
    v-else-if="isSelectLike"
    :select-label="fieldLabel"
    :disabled="field.disabled || !fieldOptions.length"
    :model-value="fieldValue"
    :options="fieldOptions"
    :multiple="isMultipleSelect"
    :error="field.error?.reason"
    @update:model-value="handleFieldChange($event, field)"
    :searchable="taggable || searchable"
    :taggable="taggable"
    :create-option="(val) => ({ label: val, value: val })"
  />

  <template v-else>
    <span class="text-xs">{{ field }}</span>
  </template>
</template>

<script setup lang="ts">
import _, { clone, cloneDeep } from 'lodash'
import { toRaw, unref, watch } from 'vue'
import type { IModuleFilterField } from '@/core/interface/Auth'
import { FilterFieldTypes } from '@/core/interface/Auth'
import {
  isSelectLikeType,
  isMultipleSelectType,
  apiSelectValuesToInterface,
} from '@/core/api/mapping'

const props = defineProps<{
  field: IModuleFilterField
  parentField?: IModuleFilterField
  indexOfSubfield?: number
  isPrimaryField?: boolean
  isSecondaryField?: boolean
  error?: boolean
  searchable?: boolean
  taggable?: boolean
}>()
const emit = defineEmits(['on-change'])

interface OptionValue {
  Title: string
  Value: string
  Key: string
}

interface ExtendedISelectItem {
  label: string
  value: string
  subitemKey: string
}

function createOptionsFromValues(values: OptionValue[] = []): ExtendedISelectItem[] {
  return values.map((value) => ({
    label: value.Title || ' ',
    value: value.Value,
    subitemKey: value.Key,
  }))
}

function createOptionsFromSubItems(
  subItems: Array<{
    id: string
    values: Array<{ Title: string; Value: string; Key: string }>
  }> = [],
  subItemId?: string,
) {
  if (!subItemId) return []
  const found = subItems.find((s) => s.id === subItemId)
  if (!found) return []

  return createOptionsFromValues(found.values)
}

const localValue = defineModel<string>('modelValue', { default: '' })

/**
 * Функция для создания опций из подэлементов (subItems).
 * @param subItems - массив объектов, где каждый объект имеет поле id и массив values.
 * @param subItemId - идентификатор подэлемента, для которого нужно сформировать опции.
 * @returns массив объектов типа ExtendedISelectItem.
 */

const isSelectLike = computed(() => {
  return isSelectLikeType(props.field.type)
})

const isMultipleSelect = computed(() => {
  return isMultipleSelectType(props.field.type)
})
const parentOptions = computed(() => {
  return createOptionsFromValues(props.parentField.values)
})

const fieldOptions = computed(() => {
  if (props.parentField?.currentVal && props.parentField?.values) {
    const value = parentOptions.value.filter(
      (option) => option.value === props.parentField.currentVal,
    )
    const options = createOptionsFromSubItems(props.field.subItems || [], value[0]?.subitemKey)
    setFieldValue(options[0])
    return options
  } else {
    return createOptionsFromValues(props.field.values)
  }
})
const fieldLabel = computed(() => {
  return `${props.field.title}`
})

const fieldValue = ref<any>()
const setFieldValue = (value: any) => {
  fieldValue.value = toRaw(value)
}

watch(
  () => props.field,
  (fieldData) => {
    if (
      fieldData.type === FilterFieldTypes.FilialsCheckedList ||
      fieldData.type === FilterFieldTypes.CompanyList ||
      fieldData.type === FilterFieldTypes.FilialsList ||
      fieldData.id === 'ddlRequestType' ||
      fieldData.id === 'ddlWorkingState' ||
      fieldData.id === 'ddlCanceledText'
    ) {
      if (_.isString(fieldData.currentVal) || _.isNumber(fieldData.currentVal)) {
        const value = fieldOptions.value.filter((option) => option.value === fieldData.currentVal)

        if (value.length) {
          setFieldValue(value)
          return
        } else {
          setFieldValue(
            fieldOptions.value.filter((option) => option.value === fieldData.defaultVal),
          )
        }
        return
      }

      setFieldValue(fieldData.currentVal)
      return
    }

    if (isSelectLike.value && false) {
      // const valueArray = fieldData.currentVal.split(',')
      setFieldValue(fieldOptions.value.filter((option) => valueArray.includes(option.value)))
      return
    }

    if (fieldData.type === FilterFieldTypes.CheckBox) {
      setFieldValue(fieldData.currentVal === '1')
      return
    }

    setFieldValue(fieldData.currentVal as any)
  },
  {
    deep: true,
    immediate: true,
  },
)

const valueHasModified = computed(() => {
  return props.field.currentVal !== props.field.defaultVal
})

const handleFieldChange = (value: any, field: IModuleFilterField) => {
  field.error = undefined
  if (field.type === FilterFieldTypes.CheckedList || field.type === FilterFieldTypes.Flags) {
    let localValue = cloneDeep(toRaw(value).map((item) => item.value))

    const previousValue = cloneDeep(toRaw(fieldValue.value).map((value) => toRaw(value)))
    const indexOfMinusValue = localValue.findIndex((v) => v === '-1')

    if (!previousValue.find((v) => v.value === '-1') && indexOfMinusValue !== -1) {
      // Если юзер поставил -1, то надо оставить только его
      localValue = [toRaw(fieldOptions.value[0].value)]

      return
    }

    if (indexOfMinusValue !== -1 && localValue.length > 1) {
      // Так как мы проверили что ранее был -1, то теперь его надо убрать ибо юзер выбрал какой другой вариант
      localValue.splice(indexOfMinusValue, 1)
    } else if (indexOfMinusValue === -1 && !localValue.length) {
      // Если юзер все убрал, то надо поставить неважно
      localValue = [toRaw(fieldOptions.value[0].value)]
    }
    localValue.value = localValue.join(',')

    return
  }

  if (field.type === FilterFieldTypes.CompanyList || field.type === FilterFieldTypes.FilialsList) {
    localValue.value = value.value

    return
  }

  if (field.type === FilterFieldTypes.Combobox) {
    localValue.value = value.value

    return
  }

  if (field.type === FilterFieldTypes.Date) {
    localValue.value = value.value

    return
  }

  if (field.type === FilterFieldTypes.CheckBox) {
    localValue.value = props.field.currentVal === '1' ? '0' : '1'

    return
  }
  localValue.value = value
}
</script>
