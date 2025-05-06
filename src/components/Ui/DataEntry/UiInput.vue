<template>
  <div class="input" :class="[...modifiers, ...(additionalClass || [])]">
    <label v-if="label" class="input__label text-s c-gray no-user-select" :for="id">
      {{ label }}
      <sup v-if="isRequired" class="input__label__sup-star">*</sup>
      <div v-if="error" ref="errorIcon" class="input__error-icon">
        <SvgIcon name="info" />
      </div>
    </label>

    <div class="input__wrapper">
      <textarea
        v-if="isTextarea"
        :id="id"
        ref="inputRef"
        class="input__input"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="textareaStyle"
        v-bind="$attrs"
        @input="setValue"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <input
        v-else
        :id="id"
        ref="inputRef"
        class="input__input"
        :name="name"
        :value="value"
        :type="currentInputType"
        :placeholder="placeholder"
        :disabled="disabled"
        v-bind="$attrs"
        @input="setValue"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleUpEnter"
      />

      <div ref="iconsRef" class="input__icons">
        <i v-if="loading" class="input__icon _loading">
          <SvgIcon name="loading" />
        </i>
        <i v-else-if="isClearable" class="input__icon _clear" @click="clearInput">
          <SvgIcon name="close" />
        </i>
        <i v-else-if="showError" class="input__icon _error" @click="clearInput">
          <SvgIcon name="close" />
        </i>
        <i v-else-if="icon" class="input__icon">
          <SvgIcon :name="icon" />
        </i>
        <i v-else-if="isPassword" class="input__icon _eye" @click="togglePasswordVisiblility">
          <SvgIcon :name="isPasswordVisible ? 'eye-disabled' : 'eye'" />
        </i>
        <span v-if="changeable" class="input__changeable" @click="emit('onChangeable')">
          <span v-if="typeof changeable === 'string'">{{ changeable }}</span>
          <span v-else>Изменить</span>
        </span>
      </div>
    </div>

    <div v-if="helper" class="input__helper text-s c-gray">{{ helper }}</div>

    <div v-if="error" class="input__error-tooltip" ref="errorTooltip">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { createPopper } from '@popperjs/core'

const id = 'id_' + nanoid(10)
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits([
  'input',
  'onInput',
  'onChange',
  'onChangeable',
  'onEnter',
  'onCtrlAltEnter',
  'onCtrlEnter',
])

defineExpose({ inputRef })

const props = defineProps({
  value: {
    type: String,
    default: '',
    required: true,
  },
  id: {
    type: String,
  },
  type: {
    type: String,
    default: 'text', // textarea for :is="getElement"
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  // presentation
  theme: {
    type: String,
    default: 'primary',
    validator: (theme: string) => ['primary', 'secondary', 'success', 'error'].includes(theme),
  },
  additionalClass: {
    type: Array,
    defualt: () => [],
  },
  size: {
    type: String,
    default: 'normal',
    validator: (size: string) => ['large', 'normal'].includes(size),
  },
  icon: {
    type: String,
    required: false,
  },
  iconPosition: {
    type: String,
    default: 'right',
    validator: (size: string) => ['left', 'right'].includes(size),
  },
  changeable: {
    type: [Boolean, String],
    default: false,
  },
  // modifiers
  error: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  // functional
  focusOnMount: {
    type: Boolean,
    default: false,
  },
  // https://github.com/beholdr/maska
  // mask: {
  //   type: String,
  //   default: '',
  // },
  // textarea
  maxRows: {
    type: Number,
    default: 5,
  },
  hasModified: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  highlightNotEmpty: {
    type: Boolean,
    default: false,
  },
  readableDisableMode: {
    type: Boolean,
    default: false,
  },
})

const modifiers = computed(() => [
  props.highlightNotEmpty && isFocusedOrNotBlank.value && '_focused',
  showError.value && '_error',
  props.disabled && '_disabled',
  `_ipos-${props.iconPosition}`,
  `_${props.theme}`,
  `_${props.size}`,
  props.hasModified ? '_modified' : undefined,
  props.readableDisableMode ? '_readable-disable-mode' : undefined,
])

// general logic
const isTextarea = computed(() => {
  return props.type === 'textarea'
})

const isPassword = computed(() => {
  return props.type === 'password'
})

const showError = computed(() => {
  return props.error && !isFocused.value
})

const setValue = (e) => {
  const value = e.target.value

  emit('onInput', value)

  if (isTextarea.value) {
    resizeTextarea()
  }
}

const handleChange = (e) => {
  const value = e.target.value

  emit('onChange', value)

  if (isTextarea.value) {
    resizeTextarea()
  }
}

// focus handle
const isFocused = ref(false)

const isFocusedOrNotBlank = computed(() => {
  if (props.value && props.value.trim().length > 0) {
    return true
  }
  return isFocused.value
})

const handleFocus = (e) => {
  isFocused.value = true
}
const handleBlur = () => {
  isFocused.value = false
}

const handleAutocompleate = (e: any) => {
  const target = e.target as HTMLElement
  const dataId = target.getAttribute('id')
  if (parseInt(dataId || '') === +id) {
    if (target.hasAttribute('autocompleted')) {
      isFocused.value = true
    }
  }
}

const handleUpEnter = (e: any) => {
  const value = e?.target?.value

  if (e.ctrlKey) {
    if (e.altKey) {
      emit('onCtrlAltEnter', value)
      return
    }

    emit('onCtrlEnter', value)
    return
  }

  emit('onEnter', value)
}

// inputs width watcher
const iconsRef = ref<HTMLElement | null>(null)

const setInputOffsets = () => {
  // if (props.iconPosition === 'left') return
  if (!iconsRef.value || !inputRef.value) return

  try {
    const iconsWidth = iconsRef.value?.offsetWidth + 15 + 10
    const styleKey = `padding${capitalizeFirstLetter(props.iconPosition)}`
    inputRef.value.style[styleKey] = `${iconsWidth}px`
  } catch {
    console.info('warn')
  }
}

watch(
  () => [props.value, props.error],
  () => {
    nextTick(setInputOffsets)
  },
)

// error
const showErrorText = computed(() => {
  if (isFocused.value) return false
  return typeof props.error === 'string'
})

// password
const isPasswordVisible = ref(false)
const currentInputType = computed(() => {
  if (isPassword.value) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisiblility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

// clear
const isClearable = computed(() => {
  if (props.clearable) {
    return props.value && props.value.replace(/^\s+|\s+$/g, '').length > 0
  } else {
    return false
  }
})

const clearInput = () => {
  emit('onInput', '')
  emit('onChange', '')
}

// textarea autosize
const height = ref('')
const resizeTextarea = () => {
  height.value = 'auto !important'
  nextTick(() => {
    const style = window.getComputedStyle(inputRef.value as Element)
    const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = lineHeight * props.maxRows + padding + 2

    let newHeight = (inputRef.value?.scrollHeight || 0) + 2
    if (newHeight >= maxHeight) newHeight = maxHeight

    height.value = `${newHeight}px`
  })
}

const textareaStyle = computed(() => {
  if (isTextarea.value) {
    return { height: height.value }
  } else {
    return {}
  }
})

// hooks
onMounted(() => {
  if (props.focusOnMount) {
    inputRef.value?.focus()
  }
  if (isTextarea.value) resizeTextarea()

  document.addEventListener('onautocomplete', handleAutocompleate)
})

const errorIcon = ref<HTMLElement>()
const errorTooltip = ref<HTMLElement>()
const popperInstance = ref<any>()
const showEvents = ['mouseenter', 'focus']
const hideEvents = ['mouseleave', 'blur']

watch(
  () => props.error,
  (error) => {
    if (!error) {
      popperInstance.value?.destroy()
      return
    }

    nextTick(() => {
      if (props.error && errorIcon.value && errorTooltip.value) {
        popperInstance.value = createPopper(errorIcon.value, errorTooltip.value, {
          placement: 'right',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-8, 8],
              },
            },
          ],
        })

        showEvents.forEach((event) => {
          errorIcon.value?.addEventListener(event, showTooltip)
        })

        hideEvents.forEach((event) => {
          errorIcon.value?.addEventListener(event, hideTooltip)
        })
      }
    })
  },
)

const showTooltip = () => {
  errorTooltip.value?.setAttribute('data-show', '')
  popperInstance.value?.update()
}

const hideTooltip = () => {
  errorTooltip.value?.removeAttribute('data-show')
}

onBeforeUnmount(() => {
  document.removeEventListener('onautocomplete', handleAutocompleate)

  showEvents.forEach((event) => {
    errorIcon.value?.removeEventListener(event, showTooltip)
  })

  hideEvents.forEach((event) => {
    errorIcon.value?.removeEventListener(event, hideTooltip)
  })

  popperInstance.value?.destroy()
})

const onEventGlobalFocus = (id: string) => {
  if (id !== props.id) return

  inputRef.value?.focus()
}
EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;

  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    textarea {
      overflow: auto;
    }
  }
  &__label {
    display: block;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    margin-bottom: 6px;
  }

  &__input {
    position: relative;
    z-index: 2;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    border: 1px solid var(--color-border);
    background: var(--input-background-color);
    border-radius: var(--input-border-radius);
    font-style: normal;
    font-weight: var(--font-weight-400);
    line-height: 1.5;
    color: var(--color-font);
    resize: vertical;
    overflow: hidden;
    box-shadow: none;
    transition-property: border, color, background, outline;
    transition-duration: 0.25s;
    transition-timing-function: $ease;
    &::placeholder {
      color: var(--color-disabled);
    }
    &:focus,
    &:active {
      border: 1px solid var(--color-bg-active);
    }
    &:hover {
      border: 1px solid var(--color-primary-hover);
    }
    &[readonly],
    &[disabled] {
      color: #c0cdda;
      background-color: var(--color-bg);
      border-color: #e3e9ef;
      &:hover,
      &:focus,
      &:active {
        color: #c0cdda;
        background-color: var(--color-bg);
        border-color: #e3e9ef;
        outline: none;
      }
    }
  }

  // compontents
  &__icons {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    top: 50%;
    font-size: 0;
    transform: translateY(-50%);
    > * {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__icon {
    color: var(--color-disabled);
    font-size: 20px;
    transition:
      color 0.25s $ease,
      opacity 0.25s $ease;
    &._error {
      color: var(--color-red);
      cursor: pointer;
      &:hover {
        color: var(--color-font);
      }
    }
    &._loading {
      color: var(--color-gray);
      animation: rotateLoader 1s linear infinite;
    }
    &._clear {
      color: var(--color-gray);
      cursor: pointer;
      &:hover {
        color: var(--color-red);
      }
    }
    &._eye {
      color: var(--color-gray);
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &__changeable {
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    line-height: calc(22 / 14);
    color: var(--color-primary);
    cursor: pointer;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-font);
    }
  }

  &__error {
    // position: absolute;
    // top: 100%;
    margin-top: 4px;
    font-size: var(--font-size-standart);
    line-height: 1.5;
    color: var(--color-red);
  }

  &__error-icon {
    display: inline-block;
    color: var(--component-danger-color);

    &:hover {
      cursor: pointer;
    }
  }

  &__error-tooltip {
    display: none;
    padding: 8px 12px;
    background-color: var(--component-background);
    border-radius: var(--input-border-radius);
    box-shadow: 0 4px 20px rgba(6, 28, 40, 0.22);
    z-index: var(--z-index-input);

    &[data-show] {
      display: block;
    }
  }

  &__helper {
    margin-top: 12px;
  }

  // SIZE modifiers
  &._normal {
    .input {
      &__input {
        font-size: var(--font-size-14);
        padding: 4px 12px 5px;
      }
    }
    &._focused {
      .input__input {
        border: 1px solid var(--color-bg-active);
      }
    }
    &._ipos-left {
      .input {
        &__icons {
          left: 8px;
        }
        &__input {
          padding-left: 32px;
        }
      }
    }
    &._ipos-right {
      .input {
        &__icons {
          right: 8px;
        }
        &__input {
          padding-right: 32px;
        }
      }
    }
    &._error {
    }
  }

  &._large {
    .input {
      &__label {
        font-size: var(--font-size-14);
        margin-bottom: 8px;
      }
      &__input {
        font-size: var(--font-size-16);
        padding: 11px 20px 11px;
      }
      &__icon {
        font-size: var(--font-size-24);
      }
    }
    &._ipos-left {
      .input {
        &__icons {
          left: 12px;
        }
        &__input {
          padding-left: 42px;
        }
      }
    }
    &._ipos-right {
      .input {
        &__icons {
          right: 12px;
        }
        &__input {
          padding-right: 42px;
        }
      }
    }
  }

  &._focused {
    z-index: 4;
    .input {
      &__input {
        border-color: var(--color-primary-hover);
      }
    }
  }

  &._error {
    .input {
      &__input {
        border-color: var(--color-red);
        color: var(--color-red);
      }
    }
  }
  &._disabled:not(._readable-disable-mode) {
    .input {
      &__label {
        color: var(--color-disabled);
      }
    }
  }

  &._disabled._readable-disable-mode .input__input {
    color: var(--color-font);
  }

  &._modified {
    .input__label {
      color: var(--color-primary) !important;
    }
  }

  &._success {
    .input {
      &__input {
        background-color: var(--component-green-background-light);
        border-color: var(--component-green-border);
      }
    }
  }
}

@keyframes rotateLoader {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

.input .input__label__sup-star {
  color: var(--color-red);
  font-size: var(--font-size-24);
  top: 7px;
  margin-right: 6px;
}
</style>
