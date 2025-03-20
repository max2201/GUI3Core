<template>
  <UiFieldInputWrapper :label="label" :has-modified="hasModifiedField" :is-required="isRequired">
    <div class="ui-pts-input">
      <span>{{ valueString }}</span>
      <div class="ui-pts-input__buttons">
        <IconButton
          v-if="!disabled && currentForm?.[FieldType.PTSNumber]"
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
        <div class="ui-pts-input__form">
          <UiFieldInput
            v-for="(subField, index) in subFields"
            :id="subField.UiId"
            :key="subField.Code"
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

const props = defineProps<{
  name: string
  dialogAnchorId: string
  subFields: IUiObjectStepField[]
  label?: string
  disabled?: boolean
  value?: object
  isRequired?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

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

watch(
  () => props.subFields,
  () => {
    updateFormFieldsFromSteps(props.subFields)
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
  if (!currentForm.value[FieldType.PTSNumber]) {
    return 'Не задано'
  }

  if (!currentForm.value[FieldType.PTSIssueDate]) {
    return currentForm.value[FieldType.PTSNumber]
  }

  return `${currentForm.value[FieldType.PTSNumber]} от ${currentForm.value[FieldType.PTSIssueDate]}`
})

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
}

const closeDetailsModal = () => {
  isOpenForm.value = false
  emits('close-dialog')
}

const onCloseDetails = () => {
  closeDetailsModal()
  updateFormFieldsFromSteps(props.subFields)
}

const onClickCancel = () => {
  updateFormFieldsFromSteps(props.subFields)
}

const showSavedDetails = (data: any) => {
  onClickShowDetails()
}

const onClickSave = () => {
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
useFieldInputEvents(props.name, FieldType.PTS, showSavedDetails)
</script>

<style lang="scss" scoped>
.ui-pts-input {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: var(--color-background);
  border-radius: var(--input-border-radius);
  border: 1px solid var(--color-border);
  padding-left: 10px;
}
.ui-pts-input__buttons {
  display: flex;
}
.ui-pts-input__buttons .svg-icon-wrapper:last-child {
  border-radius: 0 5px 5px 0;
}

.ui-pts-input__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ui-pts-input__exp :deep(.input__input:disabled) {
  color: var(--color-font);
  background-color: var(--component-background);
}
</style>
