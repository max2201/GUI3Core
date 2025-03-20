<template>
  <UiInput1
    v-if="field.type === FilterFieldTypes.Text"
    :label="(!parentField && fieldLabel) || undefined"
    :disabled="parentField ? parentField?.disabled : field.disabled"
    :has-modified="valueHasModified"
    :placeholder="field.title"
    highlight-not-empty
    :model-value="fieldValue"
    @update:model-value="handleFieldChange($event, field)"
  />

  <UiDatepicker
    v-else-if="!field.subItems && field.type === FilterFieldTypes.Date"
    :label="(!parentField && fieldLabel) || undefined"
    :model-value="fieldValue"
    :placeholder="field.title"
    :has-modified="valueHasModified"
    clearable
    :disabled="parentField ? parentField?.disabled : field.disabled"
    @update:model-value="handleFieldChange($event, field)"
    :max-date="
      (parentField?.subItems?.length === 2 &&
        indexOfSubfield === 0 &&
        parentField.subItems[1].currentVal) ||
      null
    "
    :min-date="
      (parentField?.subItems?.length === 2 &&
        indexOfSubfield === 1 &&
        parentField.subItems[0].currentVal) ||
      null
    "
  />

  <UiCheckbox1
    v-else-if="field.type === FilterFieldTypes.CheckBox"
    :model-value="fieldValue"
    @update:model-value="handleFieldChange(fieldValue, field)"
    :disabled="parentField ? parentField?.disabled : field.disabled"
  >
    {{ field.title }}
  </UiCheckbox1>

  <UiSelect1
    v-else-if="isSelectLike"
    :select-label="(!parentField && fieldLabel) || undefined"
    :disabled="parentField ? parentField?.disabled : field.disabled"
    :model-value="fieldValue"
    :options="fieldOptions"
    :multiple="isMultipleSelect"
    :hasModified="valueHasModified"
    @update:model-value="handleFieldChange($event, field)"
  />
  <UiFormField
    :has-modified="valueHasModified"
    separate-label
    :label="fieldLabel"
    v-else-if="field.subItems"
  >
    <div class="row flex-align-center filter-field">
      <div
        v-for="(subfield, index) in field.subItems || []"
        :key="`subfield-${index}`"
        :style="{ order: index, flex: subfield.type === FilterFieldTypes.CheckBox ? 0 : 1 }"
      >
        <FilterField
          @on-change="onChangeFilterSubValue(field.id, index, isPrimaryField, $event)"
          :field="subfield"
          :parentField="field"
          :indexOfSubfield="index"
          :is-primary-field="isPrimaryField"
          :is-secondary-field="isSecondaryField"
        />
      </div>

      <div class="filter-field__divider-wrapper" :style="{ order: field.subItems.length - 2 }">
        <div class="filter-field__divider" />
      </div>
    </div>
  </UiFormField>

  <template v-else>
    <span class="text-xs">{{ field }}</span>
  </template>
</template>

<script setup lang="ts">
import _, { cloneDeep, isNull } from 'lodash'
import { toRaw } from 'vue'
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
}>()
const emit = defineEmits(['on-change'])

const isSelectLike = computed(() => {
  return isSelectLikeType(props.field.type)
})

const isMultipleSelect = computed(() => {
  return isMultipleSelectType(props.field.type)
})

const fieldOptions = computed(() => {
  return apiSelectValuesToInterface(props.field.values)
})

const fieldLabel = computed(() => {
  if (props.field.type === FilterFieldTypes.FilialsList) {
    return 'Филиалы'
  }

  if (props.parentField) {
    if (props.field.type === FilterFieldTypes.Date) {
      return props.indexOfSubfield === 0 ? props.parentField.title : ' '
    }

    return `${props.parentField.title} ${props.field.title}`
  }

  return `${props.field.title}`
})

const fieldValue = ref<any>()
const setFieldValue = (value: any) => {
  fieldValue.value = toRaw(value)
}

watch(
  () => props.field,
  (fieldData) => {
    if (fieldData.type === FilterFieldTypes.CompanyList) {
      if (_.isString(fieldData.currentVal) || _.isNumber(fieldData.currentVal)) {
        setFieldValue(fieldOptions.value.filter((option) => option.value === fieldData.currentVal))
        return
      }

      setFieldValue(fieldData.currentVal)
      return
    }

    if (isSelectLike.value) {
      const valueArray = fieldData.currentVal.split(',')
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
  if (props.field.subItems?.length) {
    return props.field.subItems
      .map((subitem) => {
        return subitem.currentVal === subitem.defaultVal
      })
      .includes(false)
  }
  return props.field.currentVal !== props.field.defaultVal
})

const handleFieldChange = (value: any, field: IModuleFilterField) => {
  if (
    field.type === FilterFieldTypes.CheckedList ||
    field.type === FilterFieldTypes.Flags ||
    field.type === FilterFieldTypes.FilialsCheckedList
  ) {
    let localValue = cloneDeep(toRaw(value).map((item) => item.value))

    const previousValue = cloneDeep(toRaw(fieldValue.value).map((value) => toRaw(value)))
    const indexOfMinusValue = localValue.findIndex((v) => v === '-1')

    if (!previousValue.find((v) => v.value === '-1') && indexOfMinusValue !== -1) {
      // Если юзер поставил -1, то надо оставить только его
      localValue = [toRaw(fieldOptions.value[0].value)]
      emit('on-change', localValue.join(','))
      return
    }

    if (indexOfMinusValue !== -1 && localValue.length > 1) {
      // Так как мы проверили что ранее был -1, то теперь его надо убрать ибо юзер выбрал какой другой вариант
      localValue.splice(indexOfMinusValue, 1)
    } else if (indexOfMinusValue === -1 && !localValue.length) {
      // Если юзер все убрал, то надо поставить неважно
      localValue = [toRaw(fieldOptions.value[0].value)]
    }

    emit('on-change', localValue.join(','))
    return
  }

  if (field.type === FilterFieldTypes.CompanyList || field.type === FilterFieldTypes.FilialsList) {
    emit('on-change', value.value)
    return
  }

  if (field.type === FilterFieldTypes.Combobox) {
    emit('on-change', value.value)
    return
  }

  if (field.type === FilterFieldTypes.Date) {
    emit('on-change', isNull(value) ? '' : value)
    return
  }

  if (field.type === FilterFieldTypes.CheckBox) {
    emit('on-change', props.field.currentVal === '1' ? '0' : '1')
    return
  }

  emit('on-change', value)
}

const moduleStore = useModuleStore()
const { moduleFilter } = storeToRefs(moduleStore)

const onChangeFilterSubValue = (
  filterKey: string,
  subitemKey: number,
  isPrimary: boolean,
  value: any,
) => {
  moduleFilter.value[isPrimary ? 'PrimaryFields' : 'SecondaryFields'][
    moduleFilter.value[isPrimary ? 'PrimaryFields' : 'SecondaryFields'].findIndex(
      (item) => item.id === filterKey,
    )
  ].subItems[subitemKey].currentVal = value
}
</script>
<style lang="scss" scoped>
.filter-field {
  flex-wrap: nowrap;
  gap: 6px;
  padding: 0 16px;
  flex: 1;

  &__divider {
    height: 1px;
    width: 12px;
    background-color: #8990a2;

    &-wrapper {
      height: 32px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
