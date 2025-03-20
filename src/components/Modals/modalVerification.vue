<template>
  <UiModal
    :name="CodeConfirmModal"
    size="normal"
    is-form
    @opened="generateNewCode"
    :class="[
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.objectEventsList,
      StopClickOutsideClasses.tableTr,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.windowManager,
    ]"
  >
    <div class="modal-code-confirm">
      <h3 class="mb-6">Подтверждение операции</h3>
      <p class="modal-code-confirm__description">
        Для подтверждения операции введите указанные цифры
      </p>
      <p class="modal-code-confirm__generated-code">
        {{ generatedCode }}
      </p>
      <div class="modal-code-confirm__input">
        <UICodeInput ref="codeInputRef" :error="error" @complete="checkCode" @change="clearError" />
      </div>
    </div>

    <template #buttons>
      <div class="modal-code-confirm__buttons">
        <UiButton
          class="mr-2"
          theme="primary"
          @click="handleConfirmButton"
          :disabled="!isCodeValid"
        >
          Подтвердить
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CodeConfirmModal } from '@/core/constants/ModalsNames'
import UICodeInput from '@c/Ui/DataEntry/UICodeInput.vue'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
const sharedModals = useSharedModalsStore()

const { modalParams } = storeToRefs(sharedModals)

const codeInputRef = ref<InstanceType<typeof UICodeInput> | null>(null)
const generatedCode = ref('')
const isCodeValid = ref(false)
const error = ref<string | null>(null)

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const generateNewCode = () => {
  codeInputRef.value?.clearValue()

  generatedCode.value = generateCode()
  isCodeValid.value = false
  error.value = null
  codeInputRef.value?.setAutoFocus()
}

const checkCode = (value: string) => {
  if (value === generatedCode.value) {
    isCodeValid.value = true
    error.value = null
  } else {
    isCodeValid.value = false
    error.value = 'Неверный код'
  }
}
const handleConfirmButton = () => {
  modalParams.value?.onCodeVerified?.()
}

const clearError = () => {
  isCodeValid.value = false
  error.value = null
}
</script>

<style scoped lang="scss">
.modal-code-confirm {
  &__description {
    font-size: 1rem;
  }
  &__generated-code {
    font-size: var(--font-size-32);
    text-align: center;
    font-weight: 600;
  }
  &__input {
    margin-top: 32px;
  }
  &__buttons {
    display: flex;
    justify-content: end;
    gap: 10px;
  }
}
</style>
