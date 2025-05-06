<template>
  <div class="input-group">
    <template v-for="(value, index) in values" :key="index">
      <input
        :ref="
          (el) => {
            if (el) inputs[index + 1] = el
          }
        "
        class="input-group__input"
        :class="{
          'input-group__input--filled': value,
          'input-group__input--error': error?.length > 0,
        }"
        type="text"
        pattern="[0-9]"
        :data-id="index"
        :value="value"
        :required="required"
        :disabled="disabled"
        maxlength="1"
        inputmode="numeric"
        placeholder="."
        @input="onValueChange"
        @focus="onFocus"
        @keydown="onKeyDown"
      />
    </template>
    <div v-if="error" class="input-group__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { toRefs } from 'vue'
import { defineExpose } from 'vue'
const props = withDefaults(
  defineProps<{
    fields?: number
    disabled?: boolean
    required?: boolean
    error?: string
  }>(),
  {
    fields: 4,
    disabled: false,
    required: true,
    error: '',
  },
)

const emit = defineEmits(['change', 'complete'])

const KEY_CODE = {
  backspace: 8,
  delete: 46,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
}

const values = ref([])
const iRefs = ref([])
const inputs = ref([])
const { fields, error, disabled, required } = toRefs(props)
const autoFocusIndex = ref(0)
const autoFocus = true
const inputValue = ref('')

const initVals = () => {
  let vals
  if (values.value && values.value.length) {
    vals = []
    for (let i = 0; i < fields.value; i++) {
      vals.push(values.value[i] || '')
    }
    autoFocusIndex.value = values.value.length >= fields.value ? 0 : values.value.length
  } else {
    vals = Array(fields.value).fill('')
  }
  iRefs.value = []
  for (let i = 0; i < fields.value; i++) {
    iRefs.value.push(i + 1)
  }
  values.value = vals
}

const onFocus = (e) => {
  e.target.select(e)
}
const clearValue = () => {
  values.value = ['', '', '', '']
}
const onValueChange = (e) => {
  const index = parseInt(e.target.dataset.id)
  e.target.value = e.target.value.replace(/[^\d]/gi, '')
  // this.handleKeys[index] = false;
  if (e.target.value === '' || !e.target.validity.valid) {
    return
  }
  let next
  const value = e.target.value
  values.value = Object.assign([], values.value)
  if (value.length > 1) {
    let nextIndex = value.length + index - 1
    if (nextIndex >= fields.value) {
      nextIndex = fields.value - 1
    }
    next = iRefs.value[nextIndex]
    const split = value.split('')
    split.forEach((item, i) => {
      const cursor = index + i
      if (cursor < fields.value) {
        values.value[cursor] = item
      }
    })
  } else {
    next = iRefs.value[index + 1]
    values.value[index] = value
  }
  if (next) {
    const element = inputs.value[next]
    element.focus()
    element.select()
  }
  triggerChange(values.value)
}
const setAutoFocus = () => {
  if (autoFocus) {
    inputs.value[autoFocusIndex.value + 1].focus()
  }
}
`defineExpose({ setAutoFocus, clearValue })`

const onKeyDown = (e) => {
  const index = parseInt(e.target.dataset.id)
  const prevIndex = index - 1
  const nextIndex = index + 1
  const prev = iRefs.value[prevIndex]
  const next = iRefs.value[nextIndex]
  switch (e.keyCode) {
    case KEY_CODE.backspace: {
      e.preventDefault()
      const vals = [...values.value]
      if (values.value[index]) {
        vals[index] = ''
        values.value = vals
        triggerChange(vals)
      } else if (prev) {
        vals[prevIndex] = ''
        inputs.value[prev].focus()
        values.value = vals
        triggerChange(vals)
      }
      break
    }
    case KEY_CODE.delete: {
      e.preventDefault()
      const vals = [...values.value]
      if (values.value[index]) {
        vals[index] = ''
        values.value = vals
        triggerChange(vals)
      } else if (next) {
        vals[nextIndex] = ''
        inputs.value[next].focus()
        values.value = vals
        triggerChange(vals)
      }
      break
    }
    case KEY_CODE.left:
      e.preventDefault()
      if (prev) {
        inputs.value[prev].focus()
      }
      break
    case KEY_CODE.right:
      e.preventDefault()
      if (next) {
        inputs.value[next].focus()
      }
      break
    case KEY_CODE.up:
    case KEY_CODE.down:
      e.preventDefault()
      break
    default:
      // this.handleKeys[index] = true;
      break
  }
}

const triggerChange = () => {
  const val = values.value.join('')

  if (inputValue.value !== val) {
    emit('change', val)
    if (val.length >= fields.value) {
      emit('complete', val)
    }
  }
  inputValue.value = val
}

initVals()

onBeforeUpdate(() => {
  inputs.value = []
})

onMounted(() => {
  if (autoFocus) {
    inputs.value[autoFocusIndex.value + 1].focus()
  }
})
</script>

<style scoped lang="scss">
.input-group {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  &__input {
    height: 4rem;
    width: 3rem;
    border-radius: 1rem;
    border: 1px solid;
    text-align: center;
    font-size: 1.5rem;
    color: black;
    border-color: var(--color-border);

    outline: none;
    transition: all 0.3s;
    background-color: var(--component-primary-background);
    &::placeholder {
      color: #717377;
      font-weight: bold;
      line-height: 12px;
      position: relative;
      top: -5px;
    }
    &:focus,
    &:focus-visible {
      &::placeholder {
        color: transparent;
      }
    }
    &--filled {
      background-color: white;
      border-color: var(--color-border);
    }
    &:focus {
      background-color: white;
      border-color: var(--color-bg-active);
    }
    &--error {
      border-color: var(--color-red);
      &:focus {
        border-color: var(--color-red);
      }
    }
  }

  &__error {
    position: absolute;
    top: 4rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-red);
  }
}
</style>
