<template>
  <div class="input" :class="modifiers">
    <label v-if="label" :for="id" class="input__label text-s c-gray">
      {{ label }}
      <div v-if="error" ref="errorIcon" class="input__error-icon">
        <SvgIcon name="info" />
      </div>
    </label>

    <div v-if="isShowTemplates" ref="templatesRef" class="input__templates-wrapper">
      <div
        v-for="(template, index) in templates"
        :key="template.BaseObjectId"
        :class="[
          'input__template',
          {
            input__template_active: activeTemplateIndex === index,
          },
        ]"
        @mouseover="handleHoverTemplate(template)"
        @mouseleave="handleBlurTemplate(template)"
        @click.stop.prevent="() => onClickTemplate(template)"
      >
        {{ template.BaseObjectName }}
      </div>
    </div>

    <div class="input__wrapper">
      <textarea
        v-if="isShowTextarea"
        ref="textareaRef"
        v-bind="$attrs"
        :id="id"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        class="input__input input__textarea"
        rows="5"
        @input="setValue"
        @change="handleChange"
        @blur="handleBlur"
        @keyup.enter="handleUpEnter"
        @keydown="handleKeydown"
      />

      <input
        v-else
        ref="inputRef"
        v-bind="$attrs"
        :id="id"
        :value="value"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input__input"
        type="text"
        @focus="handleFocus"
      />

      <div ref="iconsRef" class="input__icons">
        <i v-if="loading" class="input__icon _loading">
          <SvgIcon name="loading" />
        </i>
        <i
          v-if="isClearable"
          class="input__icon _clear"
          @mouseenter="stopTextareaBlur = true"
          @mouseleave="stopTextareaBlur = false"
          @click="clearInput"
        >
          <SvgIcon name="close" />
        </i>
        <i v-if="showError" class="input__icon _error" @click="clearInput">
          <SvgIcon name="close" />
        </i>
        <i v-if="icon" class="input__icon">
          <SvgIcon :name="icon" />
        </i>
        <i
          v-if="imageInputIcon"
          class="input__icon"
          @mouseenter="stopTextareaBlur = true"
          @mouseleave="stopTextareaBlur = false"
          @click="onClickSelectImage"
        >
          <SvgIcon name="image-plus" />
          <span v-if="filesCount > 0" class="input__icon-images-counter">{{ filesCount }}</span>
        </i>
        <span v-if="changeable" class="input__changeable" @click="emit('onChangeable')">
          <span v-if="typeof changeable === 'string'">{{ changeable }}</span>
          <span v-else>Изменить</span>
        </span>
      </div>
    </div>

    <div v-if="helper" class="input__helper text-s c-gray">{{ helper }}</div>

    <div v-if="showErrorText" class="input__error-tooltip" ref="errorTooltip">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { createPopper } from '@popperjs/core'

const id = 'id_' + nanoid(10)
const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const emit = defineEmits([
  'input',
  'onInput',
  'onChange',
  'onClear',
  'onChangeable',
  'onEnter',
  'onCtrlAltEnter',
  'onCtrlEnter',
  'selectTemplate',
  'selectFiles',
])

defineExpose({ inputRef })

const props = defineProps({
  value: {
    type: String,
    default: '',
    required: true,
  },
  templates: {
    type: Array,
    default: () => [],
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
    validator: (theme: string) => ['primary', 'secondary'].includes(theme),
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
  imageInputIcon: {
    type: Boolean,
    default: false,
  },
  filesCount: {
    type: Number,
    default: 0,
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
  clearable: {
    type: Boolean,
    default: false,
  },
  // functional
  focusOnMount: {
    type: Boolean,
    default: false,
  },
  hasModified: {
    type: Boolean,
    default: false,
  },
  flexTextarea: {
    type: Boolean,
    default: false,
  },
  filesAccept: {
    type: String,
    default: 'image/*',
  },
  filesMultiple: {
    type: Boolean,
    default: false,
  },
})

const isShowTextarea = ref(false)
const isShowTemplates = ref(false)
const activeTemplateIndex = ref(0)
let stopChangeEvent = false
let stopTextareaBlur = ref(false)

const handleHoverTemplate = () => {
  stopTextareaBlur.value = true
}
const handleBlurTemplate = () => {
  stopTextareaBlur.value = false
}

const showTemplates = () => {
  isShowTemplates.value = true
  activeTemplateIndex.value = props.templates.length - 1
  stopTextareaBlur.value = false
}

const hideTemplates = () => {
  isShowTemplates.value = false
  stopTextareaBlur.value = false
}

const modifiers = computed(() => [
  isFocusedOrNotBlank.value && '_focused',
  showError.value && '_error',
  props.disabled && '_disabled',
  `_ipos-${props.iconPosition}`,
  `_${props.theme}`,
  `_${props.size}`,
  props.hasModified ? '_modified' : undefined,
])

const showError = computed(() => {
  return props.error && !isFocused.value
})

const setValue = (e) => {
  const value = e.target.value

  if (value === '/\n') return // Is "select template" action. Skip and wait handleUpEnter

  if (value === '/') {
    showTemplates()
  } else {
    hideTemplates()
  }

  emit('onInput', value)
}

const handleChange = (e) => {
  if (stopChangeEvent) {
    stopChangeEvent = false
    return
  }

  const value = e.target.value

  emit('onChange', value)
}

// focus handle
const isFocused = ref(false)

const isFocusedOrNotBlank = computed(() => {
  if (props.value && props.value.trim().length > 0) {
    return true
  }
  return isFocused.value
})

const inputHeight = computed(() => {
  return props.flexTextarea && isShowTextarea.value ? 'auto' : '34px'
})
const handleFocus = () => {
  isShowTextarea.value = true
  isFocused.value = true

  nextTick(() => {
    textareaRef.value?.focus()
    stopChangeEvent = false
  })
}

const closeTextarea = () => {
  hideTemplates()
  isShowTextarea.value = false
  isFocused.value = false
  stopChangeEvent = false
}

const handleBlur = () => {
  if (stopTextareaBlur.value) return

  if (textareaRef.value?.value === '/') {
    emit('onInput', '')
  }

  closeTextarea()
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
  if (isShowTemplates.value) {
    emit('selectTemplate', props.templates[activeTemplateIndex.value])
    emit('onChange', '')
    hideTemplates()
    stopChangeEvent = true
    return
  }

  const value = e?.target?.value

  if (e.shiftKey) {
    // перенос строки, просто отправляем изменения
    emit('onChange', value)
    return
  }

  if (e.ctrlKey) {
    if (e.altKey) {
      emit('onCtrlAltEnter', value)
      return
    }

    emit('onCtrlEnter', value)
    return
  }

  stopChangeEvent = true
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

// clear
const isClearable = computed(() => {
  if (props.clearable) {
    return (props.value && props.value.replace(/^\s+|\s+$/g, '').length > 1) || props.filesCount > 0
  }

  return false
})

const clearInput = () => {
  if (isShowTextarea.value) {
    stopTextareaBlur.value = false
    textareaRef.value?.focus()
  }
  emit('onChange', '')
  emit('onClear')
}

const loading = ref(false)

// hooks
onMounted(() => {
  if (props.focusOnMount) {
    inputRef.value?.focus()
  }

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

const setActiveTemplate = (isMoveUp: boolean) => {
  if (isMoveUp && activeTemplateIndex.value !== 0) {
    activeTemplateIndex.value = activeTemplateIndex.value - 1
    return
  }

  if (!isMoveUp && props.templates.length !== activeTemplateIndex.value + 1) {
    activeTemplateIndex.value = activeTemplateIndex.value + 1
  }
}

const handleKeydown = (e) => {
  if (isShowTemplates.value && ['ArrowDown', 'ArrowUp'].includes(e.code)) {
    const isArrowUp = e.code === 'ArrowUp'
    e.preventDefault()
    e.stopPropagation()

    setActiveTemplate(isArrowUp)
  }

  return e
}

const onClickTemplate = (template) => {
  emit('selectTemplate', template)
  emit('onChange', '')
  closeTextarea()
}

const onClickSelectImage = () => {
  const input = document.createElement('input')
  let files

  input.type = 'file'
  input.accept = props.filesAccept
  input.multiple = props.filesMultiple

  input.onchange = () => {
    files = Array.from((input as HTMLInputElement).files as FileList)
    emit('selectFiles', files)
    input.remove()
  }
  if (isShowTextarea.value) {
    textareaRef.value?.focus()
  }
  input.click()
}
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: v-bind(inputHeight);
  z-index: 1;

  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: v-bind(inputHeight);
    width: 100%;
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
    height: 120px;
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

  &__textarea {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    resize: none;
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

  &__icon-images-counter {
    position: absolute;
    font-style: normal;
    color: var(--color-font-invert);
    font-size: 10px;
    bottom: -1px;
    right: -5px;
    width: 14px;
    height: 14px;
    background-color: var(--badge-blue-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
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

  &__templates-wrapper {
    position: absolute;
    bottom: 122px;
    left: 0;
  }

  &__template {
    padding: 8px 20px;
    border-radius: var(--input-border-radius);
    background: var(--component-background);
    box-shadow: var(--box-shadow-small);
    margin-bottom: 4%;
    cursor: pointer;

    &:hover {
      background: var(--color-primary-hover);
      color: var(--color-font);
    }

    &_active {
      background: var(--color-primary-hover);
      color: var(--component-background);
    }
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
  &._disabled {
    .input {
      &__label {
        color: var(--color-disabled);
      }
    }
  }

  &._modified {
    .input__label {
      color: var(--color-red) !important;
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
</style>
