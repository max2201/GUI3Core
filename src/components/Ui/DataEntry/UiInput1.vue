<template>
  <div class="ui-input" :class="[...modifiers, ...additionalClass]">
    <label v-if="label" class="ui-input__label" :for="id">
      <span>{{ label }}<span v-if="isRequired" class="ui-input__label-sup-star">*</span></span>
      <div
        v-if="error"
        class="ui-input__label-error-icon"
        :title="typeof error === 'string' ? error : ''"
      >
        <SvgIcon
          :width="size === 'large' ? 14 : 12"
          :height="size === 'large' ? 14 : 12"
          name="info"
        />
      </div>
      <div
        v-if="warning"
        class="ui-input__label-warning-icon"
        :title="typeof warning === 'boolean' ? '' : warning"
      >
        <SvgIcon
          :width="size === 'large' ? 16 : 14"
          :height="size === 'large' ? 16 : 14"
          class="c-yellow"
          name="alertRounded"
        />
      </div>
    </label>
    <div class="ui-input__wrapper" @click="inputRef?.focus()">
      <slot name="prepend" :iconClick="iconClick">
        <SvgIcon
          class="ui-input__icon"
          v-if="icon && iconPosition === 'left'"
          :name="icon"
          :width="20"
          :height="20"
          @click.stop="iconClick"
        ></SvgIcon>
      </slot>
      <template v-if="isTextarea">
        <textarea
          :id="id"
          ref="inputRef"
          class="ui-input__input ui-input__input--textarea"
          v-model="localValue"
          :disabled="disabled"
          :style="textareaStyle"
          v-bind="$attrs"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        ></textarea>
        <div
          v-if="withResize"
          @mousedown.stop="initTextareaResize"
          class="ui-input__textarea-custom-resize"
        ></div>
      </template>
      <input
        v-else
        :id="id"
        ref="inputRef"
        class="ui-input__input"
        v-model="localValue"
        :type="currentInputType"
        :disabled="disabled"
        v-bind="$attrs"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleUpEnter"
        v-maska="mask"
      />

      <div class="ui-input__icons">
        <i v-if="loading" class="ui-input__icon--loading">
          <SvgIcon :width="24" :height="24" name="loading" />
        </i>
        <template v-else>
          <i
            v-if="showError && localValue && !disabled"
            class="ui-input__icon ui-input__icon--error"
            @click="clearInput"
          >
            <SvgIcon :width="24" :height="24" name="close" />
          </i>
          <i
            v-else-if="isClearable && !disabled"
            class="ui-input__icon ui-input__icon--clear"
            @click="clearInput"
          >
            <SvgIcon :width="24" :height="24" name="close" />
          </i>
          <div
            v-if="isPassword"
            class="ui-input__icon ui-input__icon--eye"
            @click="togglePasswordVisibility"
          >
            <SvgIcon :width="24" :height="24" :name="isPasswordVisible ? 'eye-disabled' : 'eye'" />
          </div>
          <span
            v-if="changeable && !disabled"
            class="ui-input__change-button"
            @click.stop="emit('onChangeable')"
          >
            <span v-if="typeof changeable === 'string'">{{ changeable }}</span>
            <span v-else>Изменить</span>
          </span>
          <slot name="append" :iconClick="iconClick">
            <SvgIcon
              class="ui-input__icon"
              :width="24"
              :height="24"
              v-if="icon && iconPosition === 'right'"
              :name="icon"
              @click.stop="iconClick"
            ></SvgIcon>
          </slot>
        </template>
      </div>
    </div>

    <div v-if="helper" class="ui-input__helper">{{ helper }}</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { vMaska } from 'maska/vue'
import type { MaskInputOptions } from 'maska'
import type { PropType } from 'vue'
import { isString } from 'lodash'

const id = 'id_' + nanoid(10)
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits([
  'onChange',
  'onChangeable',
  'onEnter',
  'onCtrlAltEnter',
  'onCtrlEnter',
  'update:model-value',
  'clear-input',
  'icon-click',
])

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
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
  helper: {
    type: String,
    default: '',
  },
  // presentation
  theme: {
    type: String,
    default: 'primary',
    validator: (theme: string) =>
      ['primary', 'secondary', 'warning', 'success', 'error'].includes(theme),
  },
  additionalClass: {
    type: Array,
    default: () => [],
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
  warning: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  withResize: {
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
  mask: {
    type: [String, Object as PropType<MaskInputOptions>],
    default: '',
  },
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

const localValue = defineModel<string>('modelValue', { default: '' })

const modifiers = computed(() => [
  (props.highlightNotEmpty ? isFocusedOrNotBlank.value : isFocused.value) && 'ui-input--focused',
  showError.value && 'ui-input--error',
  props.disabled && 'ui-input--disabled',
  `ui-input--theme-${props.theme}`,
  `ui-input--size-${props.size}`,
  props.hasModified ? 'ui-input--modified' : undefined,
  props.readableDisableMode ? 'ui-input--readable-disable-mode' : undefined,
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
  if (isString(localValue.value) && localValue.value?.trim().length > 0) {
    return true
  }
  return isFocused.value
})

const iconClick = () => {
  emit('icon-click')
}
const handleFocus = (e) => {
  isFocused.value = true
}
const handleBlur = () => {
  isFocused.value = false
}

const handleAutocomplete = (e: any) => {
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

// password
const isPasswordVisible = ref(false)
const currentInputType = computed(() => {
  if (isPassword.value) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

// clear
const isClearable = computed(() => {
  if (props.clearable) {
    return localValue.value?.replace(/^\s+|\s+$/g, '').length > 0
  } else {
    return false
  }
})

const clearInput = () => {
  localValue.value = ''
  emit('clear-input', localValue.value)
  resizeTextarea()
}

// textarea resize
const height = ref('')
const initTextareaResize = () => {
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  const lineHeight = parseInt(window.getComputedStyle(inputRef.value as Element).lineHeight)
  const newHeight = e.clientY - e.target.getBoundingClientRect().top
  if (newHeight > lineHeight) {
    // Минимальная высота
    height.value = `${newHeight}px`
  }
}

const stopResize = () => {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResize)
}

// textarea autosize
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

  document.addEventListener('onautocomplete', handleAutocomplete)

  // для срабатывания события maska и получение значения completed в маске при монтировании
  if (inputRef.value && props.mask && localValue.value) {
    const event = new Event('input', { bubbles: true })
    inputRef.value.dispatchEvent(event)
  }
})

watch(
  () => localValue.value,
  () => {
    if (isTextarea.value) {
      resizeTextarea()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('onautocomplete', handleAutocomplete)
})

const onEventGlobalFocus = (id: string) => {
  if (id !== props.id) return

  inputRef.value?.focus()
}
EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
</script>

<style lang="scss" scoped>
.ui-input {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;

  &__label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: Inter;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    line-height: 15.6px;

    &-sup-star {
      color: var(--color-red);
      font-size: var(--font-size-24);
      line-height: 8px;
    }

    &-error-icon {
      display: flex;
      color: var(--component-danger-color);

      &:hover {
        cursor: pointer;
      }
    }
    &-warning-icon {
      display: flex;
      color: var(--component-danger-color);

      &:hover {
        cursor: pointer;
      }
    }
  }

  &__wrapper {
    cursor: text;
    border: 1px solid var(--color-border);
    background: var(--input-background-color);
    border-radius: var(--input-border-radius);
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    transition-property: border, color, background, outline;
    transition-duration: 0.25s;
    transition-timing-function: $ease;

    textarea {
      overflow: auto;
    }

    &:hover {
      border: 1px solid var(--input-hover-background-color);
    }
  }

  &__input {
    border: none;
    position: relative;
    z-index: 2;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    font-family: Inter;
    font-weight: var(--font-weight-400);
    color: var(--color-font);
    resize: vertical;
    overflow: hidden;
    box-shadow: none;
    transition-property: border, color, background, outline;
    transition-duration: 0.25s;
    transition-timing-function: $ease;
    background-color: transparent !important;
    padding: 0;

    &::placeholder {
      color: var(--color-gray);
    }

    &[readonly],
    &[disabled] {
      color: #8990a2;
    }

    &--textarea {
      width: 100%;
      resize: none;
    }
  }

  &__textarea-custom-resize {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-image: url(@/assets/icons/resize-right.svg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 10;
    cursor: ns-resize;
  }

  // compontents
  &__icons {
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  &__icon {
    display: flex;
    color: var(--color-disabled);
    font-size: 20px;
    transition:
      color 0.25s $ease,
      opacity 0.25s $ease;

    &--error {
      color: var(--color-red);
      cursor: pointer;

      &:hover {
        color: var(--color-font);
      }
    }

    &--loading {
      color: var(--color-gray);
      animation: rotateLoader 1s linear infinite;
    }

    &--clear {
      color: var(--color-gray);
      cursor: pointer;

      &:hover {
        color: var(--color-red);
      }
    }

    &--eye {
      color: var(--color-gray);
      cursor: pointer;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &__change-button {
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

  //// SIZE modifiers
  &--size {
    &-normal {
      .ui-input__wrapper {
        padding: 3px 5px 3px 11px;
      }

      .ui-input__input {
        font-size: var(--font-size-14);
        line-height: 24px;
      }
    }

    &-large {
      gap: 8px;

      .ui-input__wrapper {
        padding: 11px 11px 11px 19px;
      }

      .ui-input__input {
        font-size: var(--font-size-16);
        line-height: 24px;
      }

      .ui-input__label {
        font-size: var(--font-size-14);
        line-height: 18.2px;
      }
    }
  }

  &--focused {
    .ui-input__wrapper {
      border-color: var(--input-hover-background-color);
    }
  }

  &--error {
    .ui-input__wrapper {
      border-color: var(--color-red);
    }

    .ui-input__input {
      color: var(--color-red) !important;
    }
  }

  &--modified {
    .ui-input__label {
      color: var(--color-primary) !important;
    }
  }

  &--theme {
    &-success {
      .ui-input__wrapper {
        background-color: var(--component-green-background-light);
      }
    }

    &-error {
      .ui-input__wrapper {
        background-color: var(--component-danger-background);
      }
    }

    &-warning {
      .ui-input__wrapper {
        background-color: var(--component-warning-background-light);
      }
    }

    &-secondary {
      .ui-input__wrapper {
        background-color: var(--component-blue-background);
      }
    }
  }

  &--disabled {
    .ui-input__wrapper {
      background: var(--color-background);
      border-color: var(--color-border);
    }

    &.ui-input--readable-disable-mode {
      .ui-input__input {
        color: var(--color-font);
      }
    }
  }

  &__helper {
    color: var(--color-gray);
    font-size: var(--font-size-14);
    line-height: 1.3;
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
</style>
