<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-phone-input">
      <UiInput1
        v-model="inputValue"
        :additionalClass="['ui-phone-input__input']"
        :disabled="disabled"
        :mask="phoneMask"
        :placeholder="placeholder || (format === 'short' ? '(___) ___-____' : '+7 (___) ___-____')"
        :error="error"
        :warning="warning"
        :theme="
          (isCurrentValueValid === true && 'success') ||
          (isCurrentValueValid === false && 'error') ||
          'primary'
        "
        @update:model-value="onChangeInputValue"
        @on-enter="onEnter"
        @maska="maskCompletedCheck($event)"
      />
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  getPhoneMask,
  getShortPhoneMask,
  getOriginalPhone,
  formatPhoneNumber,
  formatShortPhoneNumber,
} from '@/core/utils/phoneFormat'

const props = defineProps<{
  modelValue?: string
  label?: string
  disabled?: boolean
  isRequired?: boolean
  placeholder?: string
  error?: string | boolean
  warning?: string | boolean
  validator?: string
  format?: 'full' | 'short'
  isInternational?: boolean
}>()

const emits = defineEmits([
  'update:modelValue',
  'change',
  'enter',
  'valid-state',
  'invalid-state',
  'ready-to-focus-next',
])

// Отслеживаем завершенность ввода маски
const maskCompleted = ref(false)
const maskCompletedCheck = ({ detail: { completed } }) => {
  maskCompleted.value = completed
  validateValue()
}

// Определяем текущий формат с учетом пропсов
const format = computed((): 'full' | 'short' => {
  if (props.format) {
    return props.format
  }
  return props.isInternational ? 'short' : 'full'
})

// Маска для телефона, зависит от выбранного формата
const phoneMask = computed(() => {
  return format.value === 'short' ? getShortPhoneMask() : getPhoneMask()
})

// Локальное значение для контроля ввода
const inputValue = ref('')

// Проверка валидности номера
const isCurrentValueValid = computed(() => {
  if (!inputValue.value) {
    return props.isRequired ? false : undefined
  }

  // Проверяем длину оригинального номера
  const originalPhone = getOriginalPhone(inputValue.value)

  // Если включен validator maska, используем результат маски
  if (props.validator === 'maska') {
    return maskCompleted.value
  }

  // Для короткого формата (10 цифр) и полного формата (11 цифр с кодом страны)
  const requiredLength = format.value === 'short' ? 10 : 11
  return originalPhone.length === requiredLength
})

// Метод для валидации и отправки соответствующих событий
const validateValue = () => {
  if (isCurrentValueValid.value === true) {
    emits('valid-state')
  } else if (isCurrentValueValid.value === false) {
    emits('invalid-state')
  }
}

// Метод для отправки сформированного значения наверх
const onChangeInputValue = (value: string) => {
  // Получаем оригинальный номер телефона (только цифры)
  const originalPhone = getOriginalPhone(value)
  emits('update:modelValue', originalPhone)
  emits('change', originalPhone)

  // Валидация после изменения
  validateValue()

  // Если поле обязательное и пустое - отправляем событие невалидности
  if (props.isRequired && !originalPhone) {
    emits('invalid-state')
    return
  }

  // Если номер полный, позволяем перейти к следующему полю
  const requiredLength = format.value === 'short' ? 10 : 11
  if (originalPhone.length === requiredLength) {
    emits('ready-to-focus-next')
  }
}

// Обработка нажатия Enter
const onEnter = (value: string) => {
  const originalPhone = getOriginalPhone(value)
  emits('enter', originalPhone)
  emits('ready-to-focus-next')
}

// Отслеживание изменений modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // Если значение снаружи отличается от текущего (очищенного) значения
      const originalCurrent = getOriginalPhone(inputValue.value)
      const originalNew = getOriginalPhone(newValue)

      if (originalNew !== originalCurrent) {
        // Форматируем номер в зависимости от выбранного формата
        inputValue.value =
          format.value === 'short'
            ? formatShortPhoneNumber(originalNew)
            : formatPhoneNumber(originalNew)

        // Проверяем валидность после установки нового значения
        validateValue()
      }
    } else {
      // Если значение сброшено снаружи
      inputValue.value = ''

      // Проверяем валидность после сброса значения
      validateValue()
    }
  },
  { immediate: true },
)

// Отслеживаем изменения формата для обновления отображения
watch(format, (newFormat) => {
  if (inputValue.value) {
    const originalPhone = getOriginalPhone(inputValue.value)
    inputValue.value =
      newFormat === 'short'
        ? formatShortPhoneNumber(originalPhone)
        : formatPhoneNumber(originalPhone)

    validateValue()
  }
})
</script>

<style lang="scss" scoped>
.ui-phone-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  position: relative;

  &__input {
    width: 100%;
  }

  &__format-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--color-background);
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    user-select: none;
    z-index: 10;

    &:hover {
      background-color: var(--color-primary);
      color: var(--color-white);
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        background-color: var(--color-background);
        color: var(--color-primary);
      }
    }
  }
}
</style>
