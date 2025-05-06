<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired" :warning="warningMessage">
    <div class="ui-okato-input">
      <UiInput1
        :title="recognitionAddress"
        v-model="inputValue"
        :additionalClass="['ui-okato-input__input']"
        :disabled="disabled || isLoadingVerifyResult"
      />
      <IconButton
        v-if="birthplace"
        title="Получить код ОКАТО по месту рождения"
        :width="32"
        :height="32"
        :disabled="disabled || isLoadingVerifyResult"
        name="checkmark"
        padding="6px"
        outlined
        @click.stop="onClickVerify"
      />
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { getAddressRecognition } from '@/core/api/object.api'
import { RecognitionResult } from '@/core/constants/RecognitionResult'

const props = defineProps<{
  id: string
  name: string
  label?: string
  disabled?: boolean
  value?: string
  isRequired?: boolean
  birthplace?: string
}>()

const emits = defineEmits(['change'])

const inputValue = computed({
  get() {
    return props.value || ''
  },
  set(newVal) {
    emits('change', newVal)
  },
})

const isLoadingVerifyResult = ref(false)
const recognitionAddress = ref('')
const warningMessage = ref('')

const onClickVerify = () => {
  if (!props.birthplace) return

  isLoadingVerifyResult.value = true

  warningMessage.value = ''
  inputValue.value = ''
  recognitionAddress.value = ''

  getAddressRecognition({
    StringParamValue: props.birthplace,
  })
    .then(({ data, error }) => {
      if (!data || error) {
        console.error('getAddressRecognition, error', error)
        return
      }
      const { okato, DisplayAddress, ValidationStatus, ValidationStatusString } = data
      if (
        ValidationStatus &&
        (ValidationStatus === RecognitionResult.Warning ||
          ValidationStatus === RecognitionResult.Fail)
      ) {
        warningMessage.value = ValidationStatusString || 'Ошибка распознавания'
        recognitionAddress.value = DisplayAddress || ''
        if (okato) {
          inputValue.value = okato
        }
        return
      }
      if (okato) {
        inputValue.value = okato
      } else {
        warningMessage.value = 'код ОКАТО для данного адреса не найден'
      }
      if (DisplayAddress) {
        recognitionAddress.value = DisplayAddress
      }
    })
    .finally(() => {
      isLoadingVerifyResult.value = false
    })
}
</script>

<style lang="scss" scoped>
.ui-okato-input {
  background-color: var(--color-background);
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

  .svg-icon-wrapper {
    border-radius: 0 5px 5px 0;
  }
}
</style>
