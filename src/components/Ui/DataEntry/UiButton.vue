<template>
  <component
    ref="buttonRef"
    :is="getElement"
    :class="[
      'button',
      theme,
      size,
      customColor && '_custom-colored',
      disabled && '_disabled',
      isEmpty && '_iconOnly',
      showLoader && '_loading',
      ...additonalClasses,
    ]"
    :href="href"
    :to="to"
    v-bind="$attrs"
  >
    <div class="button__content">
      <slot name="iconLeft">
        <i v-if="iconLeft" class="button__icon _left">
          <SvgIcon :name="iconLeft" />
        </i>
      </slot>
      <slot />
      <slot name="iconRight">
        <i v-if="iconRight" class="button__icon _right">
          <SvgIcon :name="iconRight" />
        </i>
      </slot>
    </div>

    <span v-if="showLoader" class="button__loader">
      <SvgIcon name="loading" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { hexToRgb } from '@/core/utils/Color'

const buttonRef = ref()

const props = defineProps({
  id: {
    type: String,
  },
  theme: {
    type: String,
    default: 'primary',
    validator: (v: string) =>
      [
        'primary',
        'secondary',
        'gray',
        'outline',
        'link',
        'link-underline',
        'danger-outline',
        'gray-outline',
      ].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['large', 'medium', 'medium-small', 'small'].includes(v),
  },
  href: String,
  iconRight: String,
  iconLeft: String,
  to: String,
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customColor: {
    type: String,
    default: null,
  },
  additonalClasses: {
    type: Array,
    default: () => [],
  },
})

const getElement = computed(() => {
  if (props.href) {
    return 'a'
  } else if (props.to) {
    return RouterLink
  }

  return 'button'
})

const slots = useSlots()
const isEmpty = computed(() => {
  return !slots.default
})

const showLoader = ref(false)
let timer = null as any

watch(
  () => props.loading,
  (newVal) => {
    if (newVal === true) {
      timer = setTimeout(() => {
        showLoader.value = true
      }, 200)
    } else if (newVal === false) {
      showLoader.value = false
      clearTimeout(timer)
    }
  },
)
const customColorBackgroundHoverRGBA = computed(() => {
  if (!props.customColor) return ''

  const backgroundRGB = hexToRgb(props.customColor)
  if (backgroundRGB) {
    return `rgba(${backgroundRGB.r}, ${backgroundRGB.g}, ${backgroundRGB.b}, .9)`
  } else return props.customColor
})

const onEventGlobalFocus = (id: string) => {
  if (id !== props.id) return

  buttonRef.value?.focus()
}
EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
</script>

<style lang="scss" scoped>
.button {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  padding: 0;
  display: inline-flex;
  justify-content: center;
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: var(--button-border-radius);
  text-align: center;
  overflow: hidden;
  font-weight: var(--font-weight-500);
  cursor: pointer;
  user-select: none;
  box-shadow: none;

  &__content {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  &__icon {
    flex: 0 0 auto;
    font-size: 0;
    .svg-icon {
      font-size: var(--font-size-24);
    }

    &._left {
      margin-right: 0.45em;
    }
    &._right {
      margin-left: 0.45em;
    }
  }

  &._iconOnly {
    .button__icon {
      margin-left: 0;
      margin-right: 0;
    }
  }

  &__loader {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-24);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s $ease;

    .svg-icon {
      animation: rotateLoader 1s linear infinite;
    }
  }

  // themes
  &.primary {
    background: var(--color-primary);
    color: var(--color-font-invert);

    &:active,
    &:focus,
    &:hover,
    &.active {
      background-color: var(--component-primary-hover);
    }

    &[disabled='true'] {
      background: #e3e9ef;
      color: var(--color-disabled);
      pointer-events: none;
      user-select: none;
    }
  }

  &.secondary {
    background: rgba(var(--color-primary-rgb), 0.12);
    color: var(--color-primary);
    &:focus {
      outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
    }
    &:hover {
      border-color: var(--color-primary);
    }
    &:active,
    &.active {
      color: darken(#1a8ff2, 10%);
    }
  }

  &.gray {
    background-color: var(--component-gray);
    color: var(--component-gray-font);

    &:focus {
      background-color: var(--component-gray-hover);
      outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
    }
    &:hover {
      background-color: var(--component-gray-hover);
    }
    &:active,
    &.active {
      background-color: var(--component-gray-hover);
    }
  }

  &.outline {
    background: transparent;
    font-weight: var(--font-weight-600);
    border-color: var(--color-primary);
    color: var(--color-primary);
    &:focus {
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      background: var(--color-primary);
      color: white;
    }
    &:active,
    &.active {
      background: darken(#1a8ff2, 10%);
      box-shadow: none;
      outline: none;
    }
  }
  &.gray-outline {
    background: transparent;
    font-weight: var(--font-weight-600);
    border-color: var(--color-gray);
    color: var(--color-font-2);

    &:focus {
      outline: 1px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      background: rgba(111, 111, 111, 0.1);
    }
    &:active,
    &.active {
      box-shadow: none;
      outline: none;
    }
  }
  &.danger-outline {
    background: transparent;
    font-weight: var(--font-weight-600);
    border-color: var(--component-danger);
    color: var(--component-danger);

    &:focus,
    &:active,
    &:hover,
    &.active {
      border-color: var(--component-danger-hover);
      color: var(--component-danger-hover);
    }
  }

  &.link {
    background: transparent;
    color: var(--color-disabled);
    &:focus {
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      color: var(--color-primary);
    }
    &:active,
    &.active {
      color: #005192;
    }
    .button__content {
      padding: 4px 0;
    }
  }
  &.link-underline {
    display: block;
    border-radius: 0;
    border: none;
    width: min-content;
    white-space: nowrap;
    border-bottom: 1px dashed currentColor;
    background: transparent;
    color: currentColor;

    &:focus {
      outline: none;
    }
    &:hover {
      border-color: var(--color-primary);
    }
    &:active,
    &.active {
      color: #005192;
    }

    .button__content {
      padding: 0 !important;
    }
  }

  &._disabled {
    background: #e3e9ef;
    color: var(--color-disabled);
    pointer-events: none;
    user-select: none;

    > * {
      pointer-events: none;
      user-select: none;
    }
  }

  // sizes
  &.large {
    .button__content {
      padding: 12px 24px;
      font-size: var(--font-size-16);
      line-height: calc(24 / 18);
    }
  }

  &.medium {
    .button__content {
      padding: 10px 20px;
      font-size: var(--font-size-14);
      line-height: calc(17 / 14);
    }
  }

  &.medium-small {
    .button__content {
      padding: 7px 16px;
      font-size: var(--font-size-14);
      line-height: calc(20 / 14);
      height: 32px;
    }
  }

  &.small {
    .button__content {
      padding: 3px 12px;
      font-size: var(--font-size-standart);
      line-height: calc(17 / 14);
    }

    &._iconOnly {
      .button__content {
        padding-left: 3px;
        padding-right: 3px;
      }
    }
  }
  &.link {
    background: transparent;
    color: var(--color-disabled);
    &:focus {
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      color: var(--color-primary);
    }
    &:active,
    &.active {
      color: #005192;
    }
    .button__content {
      padding: 4px 0;
    }
  }
  &[block] {
    display: block;
    width: 100%;
  }

  &._loading {
    .button {
      &__content {
        opacity: 0;
      }
      &__loader {
        opacity: 1;
      }
    }
  }

  &._custom-colored {
    background-color: v-bind(customColor);
    &:active,
    &:focus,
    &:hover,
    &.active {
      background-color: v-bind(customColorBackgroundHoverRGBA);
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
</style>
