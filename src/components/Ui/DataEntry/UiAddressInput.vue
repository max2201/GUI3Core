<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-address-input">
      <UiInput1
        v-model="inputValue"
        :additionalClass="['ui-address-input__input']"
        :disabled="disabled || isLoadingVerifyResult"
        @on-change="onChangeInputValue"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-address-input__button-check']"
        :disabled="disabled || isLoadingVerifyResult"
        name="checkmark"
        padding="6px"
        outlined
        @click.stop="onClickVerify"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-address-input__button-details']"
        :disabled="isLoadingVerifyResult"
        :success-outlined="recognationResult === RecognitionResult.Success"
        :warning-outlined="
          [RecognitionResult.Fail, RecognitionResult.Warning].includes(recognationResult)
        "
        :unexpected-outlined="recognationResult === RecognitionResult.Manual"
        name="search"
        padding="6px"
        outlined
        @click.stop="onClickShowDetails"
      />

      <UiFieldDetialsModal
        compact
        :anchor-id="dialogAnchorId"
        :title="label || ''"
        :is-open="isOpenDetails"
        @close="onCloseDetails"
      >
        <div
          v-for="field in detailsFields"
          :key="field.type"
          class="ui-address-input-details__field"
        >
          <div class="ui-address-input-details__field__title">{{ field.title }}:</div>
          <div
            :class="[
              'ui-address-input-details__field__value',
              {
                'ui-address-input-details__field__value_success':
                  field.type === DetailsFields.ValidationStatusString &&
                  value?.ValidationStatus === RecognitionResult.Success,
                'ui-address-input-details__field__value_warning':
                  field.type === DetailsFields.ValidationStatusString &&
                  value?.ValidationStatus === RecognitionResult.Warning,
              },
            ]"
          >
            <span>
              {{ detailsFieldValues[field.type] }}
            </span>
            <IconButton
              v-if="field.type === DetailsFields.Geo && detailsFieldValues[field.type]"
              :width="20"
              :height="20"
              :disabled="!value?.GeoLink"
              name="search"
              @click.stop="openGeo"
            />
          </div>
        </div>
      </UiFieldDetialsModal>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { toRaw, unref } from 'vue'
import { getAddressRecognition } from '@/core/api/object.api'
import { RecognitionResult } from '@/core/constants/RecognitionResult'
import { FieldType } from '@/core/constants/FieldType'
import type { IAddressValue } from '@/core/interface/Object'
import { useFieldInputEvents } from '@/composables/use-object-field-dialog'

const props = defineProps<{
  name: string
  dialogAnchorId: string
  label?: string
  value?: IAddressValue
  disabled?: boolean
  isRequired?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

enum DetailsFields {
  ValidationStatusString = 'ValidationStatusString',
  ObjectType = 'ObjectType',
  flat_area = 'flat_area',
  flat_price = 'flat_price',
  Geo = 'Geo',
}

const recognationResult = ref(RecognitionResult.None)

const inputValue = ref('')
const detailsFieldValues = ref({
  [DetailsFields.ValidationStatusString]: '',
  [DetailsFields.ObjectType]: '',
  [DetailsFields.flat_area]: '',
  [DetailsFields.flat_price]: '',
  [DetailsFields.Geo]: '',
})

const updateDetailsFieldsValues = (data: IAddressValue = {} as any) => {
  detailsFieldValues.value[DetailsFields.ValidationStatusString] =
    data[DetailsFields.ValidationStatusString] || ''
  detailsFieldValues.value[DetailsFields.ObjectType] = data[DetailsFields.ObjectType] || ''
  detailsFieldValues.value[DetailsFields.flat_area] = data[DetailsFields.flat_area] || ''
  detailsFieldValues.value[DetailsFields.flat_price] = data[DetailsFields.flat_price] || ''
  detailsFieldValues.value[DetailsFields.Geo] = data[DetailsFields.Geo] || ''
}

watch(
  () => props.value,
  (newValue) => {
    if (!newValue) return

    recognationResult.value = newValue.ValidationStatus || RecognitionResult.None
    inputValue.value = props.value?.DisplayAddress || ''

    updateDetailsFieldsValues(newValue)
  },
  {
    immediate: true,
  },
)

const onChangeInputValue = (value: string) => {
  if (value === props.value?.result) return

  emits('change', {
    ...cloneDeep(toRaw(props.value)),
    ValidationStatus: RecognitionResult.Manual,
    DisplayAddress: value,
  })
}

const detailsFields = [
  {
    type: DetailsFields.ValidationStatusString,
    title: 'Статус распознования',
  },
  {
    type: DetailsFields.ObjectType,
    title: 'Тип объекта',
  },
  {
    type: DetailsFields.flat_area,
    title: 'Площадь',
  },
  {
    type: DetailsFields.flat_price,
    title: 'Примерная стоимость',
  },
  {
    type: DetailsFields.Geo,
    title: 'Геолокация',
  },
]

const isLoadingVerifyResult = ref(false)

const onClickVerify = () => {
  if (!inputValue.value) return

  isLoadingVerifyResult.value = true

  getAddressRecognition({
    StringParamValue: inputValue.value,
  })
    .then(({ data, error }) => {
      if (!data || error) {
        console.error('getAddressRecognition, error', error)
        return
      }

      emits('change', toRaw(data))
    })
    .finally(() => {
      isLoadingVerifyResult.value = false
    })
}

const isOpenDetails = ref(false)

const onClickShowDetails = () => {
  isOpenDetails.value = !isOpenDetails.value
  emits('open-dialog', {
    ...toRaw(unref(detailsFieldValues)),
  })
}

const onCloseDetails = () => {
  isOpenDetails.value = false
  updateDetailsFieldsValues(props.value)
  emits('close-dialog')
}

const openGeo = () => {
  if (!props.value?.GeoLink) return

  window.open(props.value.GeoLink, '_blank')
}

const showSavedDetails = (data: any) => {
  onClickShowDetails()
  updateDetailsFieldsValues(data)
}

useFieldInputEvents(props.name, FieldType.Address, showSavedDetails)
</script>

<style lang="scss" scoped>
.ui-address-input {
  display: inline-flex;
  align-items: center;
  width: 100%;

  &__input {
    width: 100%;
    :deep(.ui-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__button-check {
    border-radius: 0;
    background-color: var(--color-background);
  }
  &__button-details {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--color-background);
  }
}

.ui-address-input-details__wrapper {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-input-modal);
}

.ui-address-input-details {
  &__field {
    display: grid;
    align-items: center;
    grid-template-columns: 160px auto;
    height: 32px;
    border-bottom: 1px solid var(--color-border);

    &__title {
      display: flex;
      align-items: center;
      color: var(--color-gray);
      height: 32px;
    }

    &__value {
      height: 32px;
      padding-left: 14px;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }
}

.ui-address-input-details__field__value_success {
  background-color: var(--component-green-background);
}
.ui-address-input-details__field__value_warning {
  background-color: var(--component-warning);
}
</style>
