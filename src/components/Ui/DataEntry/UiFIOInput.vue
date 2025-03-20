<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-fio-input">
      <UiInput1
        v-model="inputValue"
        :additionalClass="['ui-fio-input__input']"
        :disabled="disabled || isLoadingVerifyResult"
        @on-change="onChangeInputValue"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-fio-input__button-check']"
        :disabled="disabled || isLoadingVerifyResult"
        name="checkmark"
        padding="6px"
        outlined
        @click.stop="onClickVerify"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-fio-input__button-details']"
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
        :anchor-id="dialogAnchorId"
        :is-open="isOpenDetails"
        title="Дополнительная информация"
        @close="onCloseDetails"
      >
        <div v-for="field in detailsFields" :key="field.type" class="ui-fio-input-details__field">
          <div class="ui-fio-input-details__field-title">{{ field.title }}:</div>
          <div class="ui-fio-input-details__field-value d-flex flex-align-center">
            <UiInput1
              :additional-class="['ui-fio-input-details__field-input']"
              v-if="isEnableDetailsField === field.type"
              :model-value="detailsFieldValues[field.type]"
              :disabled="disabled"
              @click.stop
              @update:model-value="onChangeDetailsField(field.type, $event)"
            />
            <span v-else :title="detailsFieldValues[field.type]">
              {{ detailsFieldValues[field.type] }}
            </span>
            <UiButton1
              variant="text"
              theme="transparent"
              icon-left="pencil"
              :icon-size="20"
              v-if="!disabled"
              @click.stop="enableDetailsField(field.type)"
            />
          </div>
        </div>

        <template #actions>
          <UiButton1 variant="outline" v-if="!disabled" @click="onClickFillAll">
            Заполнить автоматически
          </UiButton1>
          <UiButton1 v-if="!disabled" @click="onClickSaveDetails"> Сохранить</UiButton1>
        </template>
      </UiFieldDetialsModal>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { toRaw, unref } from 'vue'
import { getFioRecognition } from '@/core/api/object.api'
import { RecognitionResult } from '@/core/constants/RecognitionResult'
import { FieldType } from '@/core/constants/FieldType'
import type { IFIOValue } from '@/core/interface/Object'
import { useFieldInputEvents } from '@/composables/use-object-field-dialog'

const props = defineProps<{
  name: string
  dialogAnchorId: string
  label?: string
  value?: IFIOValue
  disabled?: boolean
  isRequired?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

enum DetailsFields {
  Result = 'Result',
  ResultGenitive = 'ResultGenitive',
  ResultDative = 'ResultDative',
  ResultAblative = 'ResultAblative',
}

const recognationResult = ref(RecognitionResult.None)

const inputValue = ref('')
const detailsFieldValues = ref({
  [DetailsFields.Result]: '',
  [DetailsFields.ResultGenitive]: '',
  [DetailsFields.ResultDative]: '',
  [DetailsFields.ResultAblative]: '',
})

const updateDetailsFieldsValues = (data?: IFIOValue) => {
  if (!data) return

  detailsFieldValues.value[DetailsFields.Result] = data[DetailsFields.Result] || ''
  detailsFieldValues.value[DetailsFields.ResultGenitive] = data[DetailsFields.ResultGenitive] || ''
  detailsFieldValues.value[DetailsFields.ResultDative] = data[DetailsFields.ResultDative] || ''
  detailsFieldValues.value[DetailsFields.ResultAblative] = data[DetailsFields.ResultAblative] || ''
}

watch(
  () => props.value,
  (newValue) => {
    if (!newValue) return

    recognationResult.value = newValue.RecognitionResult || RecognitionResult.None
    inputValue.value = props.value?.Result || ''

    updateDetailsFieldsValues(newValue)
  },
  {
    immediate: true,
  },
)

const onChangeInputValue = (value: string) => {
  if (value === props.value?.Result) return

  emits('change', {
    ...cloneDeep(toRaw(props.value)),
    RecognitionResult: RecognitionResult.Manual,
    Source: value,
    Result: value,
  })
}

const detailsFields = [
  {
    type: DetailsFields.Result,
    title: 'Именительный',
  },
  {
    type: DetailsFields.ResultGenitive,
    title: 'Родительный',
  },
  {
    type: DetailsFields.ResultDative,
    title: 'Дательный',
  },
  {
    type: DetailsFields.ResultAblative,
    title: 'Творительный',
  },
]

const onChangeDetailsField = (type: DetailsFields, value: string) => {
  detailsFieldValues.value[type] = value
  emits('open-dialog', {
    ...toRaw(unref(detailsFieldValues)),
  })
}

const isLoadingVerifyResult = ref(false)

const onClickVerify = () => {
  if (!inputValue.value) return

  isLoadingVerifyResult.value = true

  getFioRecognition({
    StringParamValue: inputValue.value,
  })
    .then(({ data, error }) => {
      if (!data || error) {
        console.error('getFioRecognition, error', error)
        return
      }

      emits('change', toRaw(data))
    })
    .finally(() => {
      isLoadingVerifyResult.value = false
    })
}

const isOpenDetails = ref(false)
const isEnableDetailsField = ref()

const onClickShowDetails = () => {
  console.log('onClickShowDetails', !isOpenDetails.value)
  isOpenDetails.value = !isOpenDetails.value
  emits('open-dialog', {
    ...toRaw(unref(detailsFieldValues)),
  })
}

const onClickDetailsModal = () => {
  isEnableDetailsField.value = undefined
}

const enableDetailsField = (field: DetailsFields) => {
  isEnableDetailsField.value = field
}

const onCloseDetails = () => {
  isOpenDetails.value = false
  isEnableDetailsField.value = undefined
  updateDetailsFieldsValues(props.value)
  emits('close-dialog')
}

const onClickFillAll = () => {
  if (!detailsFieldValues.value[DetailsFields.Result]) return
  const baseValue = detailsFieldValues.value[DetailsFields.Result]

  if (!detailsFieldValues.value[DetailsFields.ResultAblative]) {
    detailsFieldValues.value[DetailsFields.ResultAblative] = baseValue
  }

  if (!detailsFieldValues.value[DetailsFields.ResultDative]) {
    detailsFieldValues.value[DetailsFields.ResultDative] = baseValue
  }

  if (!detailsFieldValues.value[DetailsFields.ResultGenitive]) {
    detailsFieldValues.value[DetailsFields.ResultGenitive] = baseValue
  }
}

const onClickSaveDetails = () => {
  emits('change', {
    ...cloneDeep(toRaw(props.value)),
    ...cloneDeep(toRaw(detailsFieldValues.value)),
    RecognitionResult: RecognitionResult.Manual,
  } as IFIOValue),
    emits('close-dialog')
  isOpenDetails.value = false
  isEnableDetailsField.value = undefined
}

const showSavedDetails = (data: any) => {
  onClickShowDetails()
  updateDetailsFieldsValues(data)
}

useFieldInputEvents(props.name, FieldType.ClientFIO, showSavedDetails)
</script>

<style lang="scss" scoped>
.ui-fio-input {
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

.ui-fio-input-details {
  &__field {
    display: grid;
    align-items: center;
    grid-template-columns: 120px auto;
    height: 32px;

    &-input {
      width: 100%;
    }

    &-title {
      color: var(--color-gray);
    }

    &-value {
      justify-content: space-between;

      overflow: hidden;

      & > span {
        text-overflow: ellipsis;
        margin-right: 4px;
        padding-left: 14px;
        overflow: hidden;
      }
    }
  }
}
</style>
