<template>
  <UiInput1
    :ref="inputRef"
    :model-value="localValue"
    :additional-class="['ui-date-simple-input']"
    :theme="inputTheme"
    :label="label"
    :error="isValid === false ? 'Формат даты указан не корректно' : false"
    :disabled="disabled"
    :readable-disable-mode="readableDisableMode"
    icon="calendar"
    :is-required="isRequired"
    @update:model-value="onInput"
    @on-change="onChange"
    @on-enter="onEnter"
    :mask="'##.##.####'"
  />
</template>

<script setup lang="ts">
import moment from 'moment'

const inputRef = ref(undefined)

const props = defineProps<{
  value?: string
  label?: string
  disabled?: boolean
  readableDisableMode?: boolean
  isRequired?: boolean
}>()
const emits = defineEmits(['on-change', 'on-enter', 'on-valid', 'valid-state', 'invalid-state'])
const localValue = ref(props.value || '')
const isValid = ref<boolean | undefined>()

const checkValid = (value: string) => {
  const momentValue = moment(value, 'DD.MM.YYYY', true)

  if (props.isRequired && !value.length) {
    isValid.value = undefined
    emits('valid-state', true)
  } else {
    isValid.value = momentValue.isValid() && momentValue.year() > 1925
    if (isValid.value) {
      emits('valid-state', value)
    } else {
      emits('invalid-state', value)
    }
  }

  return isValid.value
}

watch(
  () => props.value,
  (value) => {
    if (value?.length) {
      checkValid(value)
    }

    if (localValue.value !== value) {
      isValid.value = undefined
    }

    localValue.value = value || ''
  },
  {
    immediate: true,
  },
)

// watch(
//     () => props.value,
//     (value) => {
//       if (value?.length) {
//         checkValid(value)
//       }
//     },
// )

const onInput = (value: string) => {
  checkValid(value)
  let newValue = value

  if (newValue.length < 10) {
    localValue.value = newValue
    isValid.value = undefined
    return
  }

  localValue.value = newValue

  onChange()
}

const inputTheme = computed(() => {
  if (isValid.value === undefined) return 'primary'

  return isValid.value ? 'success' : 'error'
})



const onChange = () => {
  if (!isValid.value) return

  emits('on-change', localValue.value)
}

const onEnter = (value) => {
  emits('on-enter', value)
}

const onEventGlobalFocus = (id: string) => {
  if (id !== props.id) return

  inputRef.value?.focus()
}
EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
</script>

<style lang="scss" scoped></style>
