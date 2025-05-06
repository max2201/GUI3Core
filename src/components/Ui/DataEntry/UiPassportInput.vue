<template>
  <UiFieldInputWrapper :label="label" :has-modified="hasModifiedField" :is-required="isRequired">
    <div class="ui-passport-input">
      <span class="ui-passport-input__value" :title="valueString">{{
        valueString || 'Нет значения'
      }}</span>
      <div class="ui-passport-input__buttons">
        <IconButton
          v-if="!disabled && valueString"
          :width="32"
          :height="32"
          :additionalClass="['ui-passport-input__button-clear']"
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
          :additionalClass="['ui-passport-input__button-check']"
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
          :additionalClass="['ui-passport-input__button-check']"
          name="search"
          padding="6px"
          outlined
          @click.stop="onClickShowDetails"
        />
      </div>

      <UiFieldDetialsModal
        :compact="!isFull"
        :anchor-id="dialogAnchorId"
        :title="label || ''"
        :is-open="isOpenForm"
        @close="onCloseDetails"
      >
        <UiPassportForm
          ref="passportFormRef"
          :disabled="disabled"
          :is-full="isFull"
          v-model:document-type="passportData.DocumentType"
          v-model:document-value="passportData[PassportTypes[passportData.DocumentType]]"
        ></UiPassportForm>
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
import { computed, ref, watch } from 'vue'
import { PassportTypes } from '@/core/constants/PassportTypes'
import type { IPassportData } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  name: string
  dialogAnchorId: string
  label?: string
  disabled?: boolean
  value?: IPassportData | null
  isRequired?: boolean
  isFull?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

const passportFormRef = ref(null)

// Initialize default passport data structure
const defaultPassportData = {
  DocumentType: PassportTypes.PassportRf,
  PassportRf: {
    IssuedPlaceNo: '',
    Series: '',
    IssuedDate: '',
    IsFullData: false,
    IssuedPlace: '',
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    RegisterAddress: null,
    Number: '',
  },
  PassportForegin: {
    IsFullData: false,
    Number: '',
    RegistryDate: '',
    ExpirationDate: '',
    Citizenship: '',
    RegisterAddress: null,
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    IssuedPlace: '',
  },
  PassportResidence: {
    IsFullData: false,
    Number: '',
    RegistryDate: '',
    ExpirationDate: '',
    Citizenship: '',
    RegisterAddress: null,
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    IssuedPlace: '',
  },
}

const valueString = computed(() => {
  if (props.value) {
    const type = props.value?.DocumentType

    if (type === PassportTypes.PassportRf && props.value.PassportRf) {
      const { Series, Number, IssuedDate } = props.value.PassportRf
      if (!Series && !Number) return ''

      const formattedDate = IssuedDate ? new Date(IssuedDate).toLocaleDateString('ru-RU') : ''
      return `${Series || ''} ${Number || ''}${formattedDate ? `, ${formattedDate}` : ''}`
    } else if (type === PassportTypes.PassportForegin && props.value.PassportForegin) {
      const { Number, Citizenship } = props.value.PassportForegin
      if (!Number) return ''

      return `${Number}${Citizenship ? `, ${Citizenship}` : ''}`
    } else if (type === PassportTypes.PassportResidence && props.value.PassportResidence) {
      const { Number, Citizenship } = props.value.PassportResidence
      if (!Number) return ''

      return `${Number}${Citizenship ? `, ${Citizenship}` : ''}`
    }
  }
  return ''
})

const passportData = ref<IPassportData>({
  ...defaultPassportData,
  ...cloneDeep(props.value),
})

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      passportData.value = {
        ...defaultPassportData,
        ...cloneDeep(props.value),
      }
    }
  },
)

// Dialog state
const isOpenForm = ref(false)

// Check if the form can be saved
const canSave = computed(() => {
  return passportFormRef.value?.isFormValid ?? false
})

// // Track if field has been modified
const hasModifiedField = ref(false)

// Handle opening the details dialog
const onClickShowDetails = () => {
  isOpenForm.value = true
  emits('open-dialog')
}

// Handle closing the details dialog
const onCloseDetails = () => {
  isOpenForm.value = false
  passportData.value = {
    ...defaultPassportData,
    ...cloneDeep(props.value),
  }
  emits('close-dialog')
}

// Handle saving the form
const onClickSave = () => {
  // Mark the appropriate passport type as having full data
  if (props.isFull) {
    if (passportData.value.DocumentType === PassportTypes.PassportRf) {
      passportData.value.PassportRf!.IsFullData = true
      passportData.value.PassportForegin!.IsFullData = false
      passportData.value.PassportResidence!.IsFullData = false
    } else if (passportData.value.DocumentType === PassportTypes.PassportForegin) {
      passportData.value.PassportRf!.IsFullData = false
      passportData.value.PassportForegin!.IsFullData = true
      passportData.value.PassportResidence!.IsFullData = false
    } else if (passportData.value.DocumentType === PassportTypes.PassportResidence) {
      passportData.value.PassportRf!.IsFullData = false
      passportData.value.PassportForegin!.IsFullData = false
      passportData.value.PassportResidence!.IsFullData = true
    }
  } else {
    passportData.value.PassportRf!.IsFullData = false
    passportData.value.PassportForegin!.IsFullData = false
    passportData.value.PassportResidence!.IsFullData = false
  }

  const resultValue = {
    ...props.value,
    ...{
      DocumentType: passportData.value.DocumentType,
      [PassportTypes[passportData.value.DocumentType]]:
        passportData.value[PassportTypes[passportData.value.DocumentType]],
    },
  }
  emits('change', resultValue)
  hasModifiedField.value = true
  isOpenForm.value = false
}

// Handle clearing the form
const onClickClear = () => {
  emits('change', {
    ...cloneDeep(props.value),
    ...defaultPassportData,
  })
  hasModifiedField.value = true
}
</script>

<style lang="scss" scoped>
.ui-passport-input {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: var(--color-background);
  border-radius: var(--input-border-radius);
  border: 1px solid var(--color-border);
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;

  &__value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.ui-passport-input__buttons {
  display: flex;
}

.ui-passport-input__buttons .svg-icon-wrapper:last-child {
  border-radius: 0 5px 5px 0;
}
</style>
