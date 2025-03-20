<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired" :has-modified="hasModifiedField">
    <div class="ui-driver-license-input">
      <span class="no-user-select">{{ valueString }}</span>
      <div class="ui-driver-license-input__buttons">
        <IconButton
          v-if="currentForm?.[FieldType.DLNumber] && !disabled"
          :width="32"
          :height="32"
          :additionalClass="['ui-pts-input__button-clear']"
          :disabled="disabled"
          name="close"
          padding="6px"
          outlined
          @click.stop="onClickClear"
        />
        <IconButton
          v-if="!disabled"
          :width="32"
          :height="32"
          :additionalClass="['ui-pts-input__button-check']"
          :disabled="disabled"
          name="pencil"
          padding="6px"
          outlined
          @click.stop="onClickShowDetails"
        />
        <IconButton
          v-else
          :width="32"
          :height="32"
          :additionalClass="['ui-pts-input__button-check']"
          name="search"
          padding="6px"
          outlined
          @click.stop="onClickShowDetails"
        />
      </div>

      <UiFieldDetialsModal
        :anchor-id="dialogAnchorId"
        :title="label || ''"
        :is-open="isOpenForm"
        compact
        @close="onCloseDetails"
      >
        <div class="ui-driver-license-input__form">
          <template v-for="(subField, index) in subFields" :key="subField.Code">
            <UiInput1
              v-if="subField.Code === FieldType.DLExperienceBeginDate"
              :id="subField.UiId"
              :model-value="editableDate"
              :theme="isDriverLicenseExperienceValid === null ? 'success' : undefined"
              :error="
                isDriverLicenseExperienceValid !== null ? isDriverLicenseExperienceValid : false
              "
              :disabled="disabled"
              readable-disable-mode
              @click="onFocusFieldExperience"
              label="Стаж с"
              @update:model-value="onChangeExperienceField(subField.Code, $event)"
            />
            <UiInput1
              v-else-if="subField.Code === FieldType.DLExperience"
              :model-value="experienceResult"
              class="ui-driver-license-input__exp"
              label="Стаж"
              disabled
              readable-disable-mode
            />
            <UiFieldInput
              v-else
              :class="subField.FieldType === 'checkbox' ? 'span-2' : ''"
              :id="subField.UiId"
              :type="subField.FieldType"
              :name="subField.Code"
              :value="currentForm[subField.Code]"
              :label="subField.Title"
              :options="getFieldOptions(subField)"
              :has-modified="modifiedFields[subField.Code]"
              :is-required="subField.IsRequired"
              :validator="subField.Validator"
              :disabled="disabled"
              @change="changeFieldValue(subField.Code, $event)"
              @ready-to-focus-next="onFocusNextField(index)"
              @valid-state="validState(subField)"
              @invalid-state="invalidState(subField)"
              @required-check="onRequiredCheck"
            />
          </template>
        </div>

        <template #actions>
          <UiButton1 v-if="!disabled" :disabled="!canSave" @click="onClickSave">
            Сохранить
          </UiButton1>
        </template>
      </UiFieldDetialsModal>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, unref, watch } from 'vue'
import { FieldType } from '@/core/constants/FieldType'
import { useFieldInputEvents } from '@/composables/use-object-field-dialog'
import { useObjectFieldServices } from '@/composables/use-object-field-services'
import type { IUiObjectStepField } from '@/core/interface/Object'
import moment from 'moment/moment'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'

const props = defineProps<{
  name: string
  dialogAnchorId: string
  subFields: IUiObjectStepField[]
  label?: string
  value?: object
  disabled?: boolean
  isRequired?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])
const experienceResult = computed(() => {
  return getExperienceString()
})
const {
  form: currentForm,
  changeFieldValue,
  getFieldOptions,
  modifiedFields,
  hasModifiedField,
  cancelChangesInForm,
  activeEditMode,
  editModeActive,
  updateFormFieldsFromSteps,
  focusNextField,
} = useObjectFieldServices(props.subFields)

const editableDate = ref<string>('')

const SetExperienceBeginDate = (ExperienceBeginDate: string) => {
  if (ExperienceBeginDate) {
    const parts = ExperienceBeginDate.split('.')
    if (parts[1] && parts[2]) {
      const result = `${parts[1]}.${parts[2]}`
      editableDate.value = result
    } else return
  }
}
watch(
  () => props.subFields,
  () => {
    updateFormFieldsFromSteps(props.subFields)
    SetExperienceBeginDate(currentForm.value[FieldType.DLExperienceBeginDate])
  },
  {
    immediate: true,
    deep: true,
  },
)
watch(
  () => props.value,
  (value) => {
    if (value) {
      currentForm.value = value
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
const valueString = computed(() => {
  if (!currentForm.value[FieldType.DLNumber]) {
    return 'Не задано'
  } else {
    const licenseNumber = currentForm.value[FieldType.DLNumber]

    if (!licenseNumber) return 'Не указано'

    if (currentForm.value[FieldType.DLExperience]) {
      return `${licenseNumber}, ${getExperienceString()}`
    }

    return licenseNumber
  }
})
const validDriverExperience = getValidationService('DriverExperience')
const getExperienceString = () => {
  if (validDriverExperience(editableDate.value, currentForm.value[FieldType.DLDate]) !== null) {
    return ''
  }

  let date = moment(editableDate.value, 'MM.YYYY', true)

  if (!date.isValid()) {
    date = moment(editableDate.value, 'YYYY', true)

    if (!date.isValid()) {
      return 'Неверный формат даты. Ожидается MM.YYYY или YYYY.'
    }
    date = moment(`01.01.${editableDate.value}`, 'DD.MM.YYYY', true)
  }

  const diffInMonths = moment().diff(date, 'months')
  const months = diffInMonths % 12
  const diffInYears = Math.floor(diffInMonths / 12)

  let result = 'Стаж'

  if (diffInYears > 0) {
    result += ` ${diffInYears} ${Plurize(diffInYears, 'год', 'года', 'лет')}`
  }
  if (months > 0) {
    result += ` ${months} ${Plurize(months, 'месяц', 'месяца', 'месяцев')}`
  }

  return result
}

const isDriverLicenseExperienceValid = computed(() => {
  if (currentForm.value[FieldType.DLDate] && hasModifiedField.value) {
    return validDriverExperience(editableDate.value, currentForm.value[FieldType.DLDate])
  } else return null
})
const onFocusFieldExperience = () => {
  if (!editableDate.value) {
    const parts = currentForm.value[FieldType.DLDate].split('.')
    if (parts[1] && parts[2]) {
      const result = `${parts[1]}.${parts[2]}`
      onChangeExperienceField(FieldType.DLExperienceBeginDate, result)
    } else return
  }
}
watch(
  () => currentForm.value[FieldType.DLDate],
  (NewDlValue) => {
    onFocusFieldExperience()
  },
)

const onChangeExperienceField = (type: string, value: string) => {
  let formattedExperienceDate = value
  editableDate.value = value
  if (validDriverExperience(value, currentForm.value[FieldType.DLDate]) == null) {
    if (value.length === 4) {
      formattedExperienceDate = moment(editableDate.value, 'YYYY').format(DefaultDatetimeFormat)
    } else if (editableDate.value.length === 7) {
      formattedExperienceDate = moment(editableDate.value, 'MM.YYYY').format(DefaultDatetimeFormat)
    }
  }
  changeFieldValue(type, formattedExperienceDate)
}
const isOpenForm = ref(false)

const onClickShowDetails = () => {
  isOpenForm.value = !isOpenForm.value
  emits('open-dialog')
}

const onClickClear = () => {
  updateFormFieldsFromSteps(
    props.subFields.map((field) => ({
      ...toRaw(unref(field)),
      Value: '',
    })),
  )
  emits('change', {
    ...toRaw(unref(currentForm)),
  })
  editableDate.value = ''
}

const closeDetailsModal = () => {
  isOpenForm.value = false
  emits('close-dialog')
}

const onCloseDetails = () => {
  closeDetailsModal()
  editableDate.value = ''
  updateFormFieldsFromSteps(props.subFields)
  SetExperienceBeginDate(currentForm.value[FieldType.DLExperienceBeginDate])
}

const showSavedDetails = (data: any) => {
  onClickShowDetails()
}

const onClickSave = () => {
  onFocusFieldExperience()
  closeDetailsModal()
  emits('change', {
    ...toRaw(unref(currentForm)),
  })
}

const onFocusNextField = (index: number) => {
  focusNextField(index)
}

interface InvalidFieldInfo {
  code: string
  reason: string
}

const invalidFields = ref<InvalidFieldInfo[]>([])

const invalidState = (field: IUiObjectStepField) => {
  const sameFieldIndex = invalidFields.value.findIndex((item) => item.code === field.Code)

  if (sameFieldIndex === -1) {
    invalidFields.value.push({
      code: field.Code,
      reason: '',
    })
  }
}

const validState = (field: IUiObjectStepField) => {
  const sameFieldIndex = invalidFields.value.findIndex((item) => item.code === field.Code)

  if (sameFieldIndex !== -1) {
    invalidFields.value.splice(sameFieldIndex, 1)
  }
}
const unfilledRequiredFields = ref<{ id: string }[]>([])

const onRequiredCheck = ({ id, isEmpty }: { id: string; isEmpty: boolean }) => {
  const index = unfilledRequiredFields.value.findIndex((item) => item.id === id)

  if (isEmpty && index === -1) {
    unfilledRequiredFields.value.push({ id })
  } else if (!isEmpty && index !== -1) {
    unfilledRequiredFields.value.splice(index, 1)
  }
}

const canSave = computed(() => {
  return (
    invalidFields.value.length === 0 &&
    unfilledRequiredFields.value.length === 0 &&
    hasModifiedField.value === true
  )
})
useFieldInputEvents(props.name, FieldType.DriverLicence, showSavedDetails)
</script>

<style lang="scss" scoped>
.ui-driver-license-input {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: var(--color-background);
  border-radius: var(--input-border-radius);
  border: 1px solid var(--color-border);
  padding-left: 10px;
  user-select: none;
}

:deep(.checkbox) {
  width: max-content;
}

.ui-driver-license-input__buttons {
  display: flex;
}

.ui-driver-license-input__buttons .svg-icon-wrapper:last-child {
  border-radius: 0 5px 5px 0;
}

.ui-driver-license-input__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

:deep(._error) {
  z-index: 20;
}

:deep(.ui-driver-license-input__exp.input__input:disabled) {
  color: var(--color-font);
  background-color: var(--component-background);
}

.ui-driver-license-input__button-clear,
.ui-driver-license-input__button-check {
  border-radius: 0;
}
</style>
