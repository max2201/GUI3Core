<template>
  <div class="ui-field-input">
    <UiInput1
      v-if="[FieldType.Input, FieldType.ClientFIO, FieldType.Number].includes(type as FieldType)"
      :id="id"
      :model-value="preparedValue"
      :label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :error="error"
      :theme="
        (isCurrentValueValid === true && 'success') ||
        (isCurrentValueValid === false && 'error') ||
        'primary'
      "
      :is-required="isRequired"
      readable-disable-mode
      @update:model-value="onInput"
      @on-enter="onEnter"
      :mask="
        mask
          ? mask
          : type === FieldType.Number
            ? {
                mask: 'D',
                tokens: {
                  D: { pattern: /[0-9,.-]/, multiple: true },
                },
              }
            : ''
      "
      @maska="maskCompletedCheck($event)"
    />
    <UiInput1
      v-else-if="type === FieldType.Text"
      :id="id"
      :model-value="preparedValue"
      :label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :validator="validator"
      :is-required="isRequired"
      :error="error"
      type="textarea"
      readable-disable-mode
      @update:model-value="onInput"
      @on-enter="onEnter"
      :mask="mask"
    />
    <UiSelect1
      v-else-if="type === FieldType.Dropdown"
      :id="id"
      :model-value="preparedValue"
      :options="preparedOptions"
      :select-label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :error="error"
      :warning="warningMessage"
      :tab-index="tabIndex"
      :is-required="isRequired"
      @update:model-value="onChange"
    />
    <UiSelect1
      v-else-if="type.slice(0, 5) === FieldType.Dict"
      :id="id"
      :model-value="preparedValue"
      :options="preparedOptions"
      :select-label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      :error="error"
      :warning="warningMessage"
      label="Title"
      searchable
      @update:model-value="onChange"
    />
    <UiSelect1
      v-else-if="type.slice(0, 9) === FieldType.EditDict"
      :id="id"
      :model-value="preparedValue"
      :options="preparedOptions"
      :select-label="label"
      :has-modified="hasModified"
      :create-option="createOption"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      :error="error"
      :warning="warningMessage"
      label="Title"
      searchable
      @update:model-value="onChange"
    />
    <UiMultiChecklistInput
      v-else-if="type.slice(0, 10) === FieldType.MultiDict"
      :id="id"
      :value="preparedValue"
      :options="preparedOptions"
      :label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      @change="onChange"
      :error="error"
    />
    <UiSelect1
      v-else-if="type === FieldType.Checklist"
      :id="id"
      :model-value="preparedValue"
      :options="preparedOptions"
      :select-label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      :error="error"
      :warning="warningMessage"
      multiple
      @update:model-value="onChange"
    />
    <UiCheckbox1
      v-else-if="type === FieldType.Checkbox"
      :id="id"
      :model-value="preparedValue"
      :disabled="disabled"
      :tab-index="tabIndex"
      @update:model-value="onChange"
    >
      {{ label }}
    </UiCheckbox1>
    <UiFIOInput
      v-else-if="type.startsWith(FieldType.ComplexFIO)"
      :id="id"
      :name="name"
      :label="label"
      :value="value"
      :dialog-anchor-id="dialogAnchorId || ''"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiDateSimpleInput
      v-else-if="[FieldType.ClientBirthday, FieldType.DateString].includes(type as FieldType)"
      :id="id"
      :value="preparedValue"
      :label="label"
      :has-modified="hasModified"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      readable-disable-mode
      @on-change="onChange"
      @on-enter="onEnter"
      @on-valid="onEnter"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiDatepicker
      v-else-if="type === FieldType.DatetimeList"
      :id="id"
      clearable
      :model-value="preparedValue"
      :disabled="disabled"
      :label="label"
      :tab-index="tabIndex"
      :is-required="isRequired"
      mode="dateTime"
      @update:model-value="onChange"
    />
    <UiAddressInput
      v-else-if="type.startsWith(FieldType.Address)"
      :id="id"
      :name="name"
      :label="label"
      :value="preparedValue"
      :dialog-anchor-id="dialogAnchorId || ''"
      :disabled="disabled"
      :tab-index="tabIndex"
      :is-required="isRequired"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiDriverLicenseInput
      v-else-if="type.startsWith(FieldType.DriverLicence)"
      :id="id"
      :name="name"
      :value="preparedValue"
      :label="label"
      :dialog-anchor-id="dialogAnchorId || ''"
      :tab-index="tabIndex"
      :disabled="disabled"
      :is-required="isRequired"
      :sub-fields="subFields"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiSTSInput
      v-else-if="type.startsWith(FieldType.STS)"
      :id="id"
      :name="name"
      :value="preparedValue"
      :label="label"
      :dialog-anchor-id="dialogAnchorId || ''"
      :tab-index="tabIndex"
      :disabled="disabled"
      :sub-fields="subFields"
      :is-required="isRequired"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiPTSInput
      v-else-if="type.startsWith(FieldType.PTS)"
      :id="id"
      :name="name"
      :value="preparedValue"
      :label="label"
      :dialog-anchor-id="dialogAnchorId || ''"
      :tab-index="tabIndex"
      :disabled="disabled"
      :sub-fields="subFields"
      :is-required="isRequired"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
    />
    <UiPassportInput
      v-else-if="type.startsWith(FieldType.PassportBase)"
      :id="id"
      :name="name"
      :value="preparedValue"
      :label="label"
      :dialog-anchor-id="dialogAnchorId || ''"
      :tab-index="tabIndex"
      :disabled="disabled"
      :sub-fields="subFields"
      :is-required="isRequired"
      @change="onChange"
      @open-dialog="openDialog"
      @close-dialog="closeDialog"
      @valid-state="onValidState"
      @invalid-state="onInvalidState"
      :is-full="type === FieldType.PassportFull"
    />

    <template v-else>
      <span :id="id">{{ label }}</span>
      <hr />
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import moment from 'moment'
import { FieldType } from '@/core/constants/FieldType'
import type { IUiObjectStepField } from '@/core/interface/Object'
import { getValidationService } from '@/core/utils/Validation'
import { getFormatService } from '@/core/utils/Formaters'
import { DefaultDateFormat, DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'
import type { MaskInputOptions } from 'maska'

const props = defineProps<{
  id: string
  type: string
  name: string
  value: any
  subFields?: IUiObjectStepField[]
  disabled?: boolean
  options?: any[]
  label?: string
  hasModified?: boolean
  isRequired?: boolean
  dialogAnchorId?: string
  tabIndex?: number
  validator?: string
  error?: boolean
  damageValue?: string
  mask?: string | MaskInputOptions
}>()

const emits = defineEmits([
  'input',
  'change',
  'open-dialog',
  'close-dialog',
  'ready-to-focus-next',
  'valid-state',
  'invalid-state',
  'required-check',
  'set-reason-cancel',
])

const maskCompleted = ref('')
const maskCompletedCheck = ({ detail: { completed } }) => {
  maskCompleted.value = completed
}

const preparedValue = computed(() => {
  if (props.type.slice(0, 5) === 'dict:' && Array.isArray(props.options)) {
    return (props.options || []).find((option) => option.Title === props.value) || props.value
  }

  if (props.type.slice(0, 10) === 'multidict:') {
    return (props.value || '').split(',')
  }

  switch (props.type) {
    case 'checklist': {
      return props.value && _.isString(props.value) ? props.value.split(',') : []
    }
    case 'checkbox': {
      return props.value === 'True'
    }
    case 'date-list': {
      return moment(props.value, DefaultDateFormat).toString()
    }
    case 'dateTime-list': {
      return moment(props.value, DefaultDatetimeFormat).toString()
    }
    default: {
      return props.value
    }
  }
})

const preparedOptions = computed(() => {
  if (!props.options) return []
  if (props.type.slice(0, 9) === 'editdict:') {
    return props.options.map((option) => {
      return option.Title
    })
  }
  return props.options
})

const onValidState = () => emits('valid-state')
const onInvalidState = () => emits('invalid-state')
const warningMessage = ref('')

const onInput = (value: any) => {
  emits('valid-state')

  switch (props.type) {
    case FieldType.Text:
    case FieldType.Number:
    case FieldType.ClientFIO:
    case FieldType.Input: {
      onChange(value)

      if (!value) return props.isRequired ? emits('invalid-state') : emits('valid-state')

      if (props.validator) {
        const validatorService =
          props.validator === 'maska'
            ? () => maskCompleted.value
            : getValidationService(props.validator)
        if (validatorService(value)) {
          emits('ready-to-focus-next')
          emits('valid-state')
        } else {
          emits('invalid-state')
        }
      }
      return
    }
    default: {
      return checkRequired(value)
    }
  }
}

const onChange = (value: any) => {
  emits('valid-state')
  if (props.type.slice(0, 5) === 'dict:') {
    emits('change', value.Title)
    return
  }
  if (props.type.slice(0, 10) === 'multidict:') {
    emits('change', value.join(','))
    return
  }
  if (value === props.damageValue) {
    warningMessage.value = 'Текущее значение подразумевает "Отказ компании"'
    emits('set-reason-cancel', props.id)
  } else {
    warningMessage.value = undefined
  }
  switch (props.type) {
    case 'input': {
      const formatterService = getFormatService(props.validator)
      emits('change', formatterService(value))
      return
    }
    case 'checklist': {
      emits('change', value.join(','))
      return
    }
    case 'checkbox': {
      emits('change', preparedValue.value ? 'False' : 'True')
      return
    }
    case 'date-list': {
      emits('change', moment(value).format(DefaultDateFormat))
      return
    }
    case 'dateTime-list': {
      emits('change', moment(value).format(DefaultDatetimeFormat))
      return
    }
    default: {
      emits('change', value)
    }
  }
}

const createOption = (value) => {
  emits('change', value)
}

const isCurrentValueValid = computed(() => {
  if (![FieldType.Input, FieldType.Number].includes(props.type as FieldType)) {
    return undefined
  }
  if (preparedValue.value) {
    return props.validator === 'maska'
      ? maskCompleted.value
      : getValidationService(props.validator!)(preparedValue.value)
  } else {
    // if (props.isRequired) {
    //   return false
    // }
    return undefined
  }
})

const openDialog = (value) => {
  emits('open-dialog', value)
}
const closeDialog = () => {
  emits('close-dialog')
}

const onEnter = () => {
  emits('ready-to-focus-next')
}

const checkRequired = (value: string) => {
  if (props.isRequired) {
    let isEmpty = false
    isEmpty = value.length === 0
    // Отправляем в родитель информацию о том, что поле обязательно и его статус
    emits('required-check', { id: props.id, isEmpty })
  }
}
</script>

<style lang="scss" scoped>
.ui-field-input :deep(.select__label) {
  white-space: nowrap;
  overflow: hidden;
}
</style>
