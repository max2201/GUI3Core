<template>
  <component
    ref="buttonRef"
    :is="getElement"
    class="ui-button"
    :class="classes"
    :href="href"
    :target="href && '_blank'"
    :to="to"
    v-bind="$attrs"
  >
    <div class="ui-button__content">
      <slot name="prepend">
        <i v-if="iconLeft" class="ui-button__icon">
          <SvgIcon :width="iconSize" :height="iconSize" :name="iconLeft" />
        </i>
      </slot>
      <div class="ui-button__text" v-if="$slots.default">
        <slot />
      </div>
      <slot name="append">
        <i v-if="iconRight" class="ui-button__icon">
          <SvgIcon :width="iconSize" :height="iconSize" :name="iconRight" />
        </i>
      </slot>
    </div>

    <span v-if="showLoader" class="ui-button__loader">
      <SvgIcon :width="24" :height="24" name="loading" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { hexToRgb } from '@/core/utils/Color'

const buttonRef = ref()

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  id: {
    type: String,
  },
  theme: {
    type: String,
    default: 'primary',
    validator: (v: string) =>
      ['primary', 'secondary', 'danger', 'success', 'transparent'].includes(v),
  },
  variant: {
    type: String,
    default: 'fill',
    validator: (v: string) => ['fill', 'outline', 'text'].includes(v),
  },

  iconRight: String,
  iconLeft: String,
  iconSize: {
    type: Number,
    default: 18,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
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
  // TODO: доработать размеры и ссылочную кнопку с подчёркиванием
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) =>
      ['extra-large', 'large', 'medium', 'medium-small', 'small'].includes(v),
  },
  href: String,
  to: String,
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

const withIcon = computed(() => {
  return !!slots.prepend || !!slots.append || props.iconRight || props.iconLeft
})

const classes = computed(() => {
  return {
    [`ui-button--theme-${props.theme}`]: props.theme,
    [`ui-button--size-${props.size}`]: props.size,
    [`ui-button--variant-${props.variant}`]: props.variant,
    'ui-button--custom-colored': props.customColor,
    'ui-button--square': props.square,
    'ui-button--disabled': props.disabled,
    'ui-button--with-icon': withIcon.value,
    'ui-button--without-icon': !withIcon.value,
    'ui-button--loading': showLoader.value,
    'ui-button--centered': props.centered,
    'ui-button--full-width': props.fullWidth,
    ...props.additonalClasses,
  }
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

const isEmpty = computed(() => {
  return !slots.default
})

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
.ui-button {
  $this: &;

  height: fit-content;
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  display: inline-flex;
  border-radius: var(--button-border-radius);
  cursor: pointer;
  user-select: none;
  box-shadow: none;
  border: none;
  font-family: Inter;

  &__content {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }

  &__icon {
    display: flex;
    flex-shrink: 0;

    svg,
    img {
      max-width: unset;
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
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s $ease;

    .svg-icon {
      animation: rotateLoader 1s linear infinite;
    }
  }

  &__text {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  //&.link {
  //  background: transparent;
  //  color: var(--color-disabled);
  //
  //  &:focus {
  //    outline: 4px solid rgba(0, 97, 174, 0.3);
  //  }
  //
  //  &:hover {
  //    color: var(--color-primary);
  //  }
  //
  //  &:active,
  //  &.active {
  //    color: #005192;
  //  }
  //
  //  .button__content {
  //    padding: 4px 0;
  //  }
  //}
  //
  //&.link-underline {
  //  display: block;
  //  border-radius: 0;
  //  border: none;
  //  width: min-content;
  //  white-space: nowrap;
  //  border-bottom: 1px dashed currentColor;
  //  background: transparent;
  //  color: currentColor;
  //
  //  &:focus {
  //    outline: none;
  //  }
  //
  //  &:hover {
  //    border-color: var(--color-primary);
  //  }
  //
  //  &:active,
  //  &.active {
  //    color: #005192;
  //  }
  //
  //  .button__content {
  //    padding: 0 !important;
  //  }
  //}
  //

  //
  //// sizes
  //&.large {
  //  .button__content {
  //    padding: 12px 24px;
  //    font-size: var(--font-size-16);
  //    line-height: calc(24 / 18);
  //  }
  //}
  //
  //&.medium {
  //  .button__content {
  //    padding: 10px 20px;
  //    font-size: var(--font-size-14);
  //    line-height: calc(17 / 14);
  //  }
  //}
  //
  //&.medium-small {
  //  .button__content {
  //    padding: 7px 16px;
  //    font-size: var(--font-size-14);
  //    line-height: calc(20 / 14);
  //    height: 32px;
  //  }
  //}
  //
  //&.small {
  //  .button__content {
  //    padding: 3px 12px;
  //    font-size: var(--font-size-standart);
  //    line-height: calc(17 / 14);
  //  }
  //}

  &--loading {
    #{$this} {
      &__content {
        opacity: 0;
      }

      &__loader {
        opacity: 1;
      }
    }
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &--with-icon {
    #{$this}__text {
      justify-content: flex-start;
    }
  }

  &--theme {
    &-primary {
      &#{$this}--variant {
        &-fill {
          background: var(--component-primary);
          color: var(--color-font-invert);

          &:active,
          &:focus,
          &:hover {
            background: var(--component-primary-hover);
          }
        }

        &-outline,
        &-text {
          color: var(--component-primary);

          &:active,
          &:focus,
          &:hover {
            color: var(--component-primary-hover);
          }
        }
      }
    }

    &-secondary {
      &#{$this}--variant {
        &-fill {
          background: var(--component-gray);
          color: var(--color-font-invert);

          &:active,
          &:focus,
          &:hover {
            background: var(--component-gray-hover);
          }
        }

        &-outline,
        &-text {
          color: var(--component-gray);

          &:active,
          &:focus,
          &:hover {
            color: var(--component-gray-hover);
          }
        }
      }
    }

    &-danger {
      &#{$this}--variant {
        &-fill {
          background: var(--component-danger);
          color: var(--color-font-invert);

          &:active,
          &:focus,
          &:hover {
            background: var(--component-danger-hover);
          }
        }

        &-outline,
        &-text {
          color: var(--component-danger);

          &:active,
          &:focus,
          &:hover {
            color: var(--component-danger-hover);
          }
        }
      }
    }

    &-success {
      &#{$this}--variant {
        &-fill {
          background: var(--component-green-background);
          color: var(--color-font-invert);

          &:active,
          &:focus,
          &:hover {
            background: var(--component-green-hover);
          }
        }

        &-outline,
        &-text {
          color: var(--component-green-background);

          &:active,
          &:focus,
          &:hover {
            color: var(--component-green-hover);
          }
        }
      }
    }

    &-transparent {
      &#{$this}--variant {
        &-fill {
          background: transparent;
          color: var(--color-gray);

          &:active,
          &:focus,
          &:hover {
            color: var(--input-hover-background-color) !important;
          }
        }

        &-outline,
        &-text {
          color: var(--color-gray);

          &:active,
          &:hover,
          &:focus-visible {
            color: var(--input-hover-background-color) !important;
          }
        }
        &-outline {
          border-color: transparent;
          &:active,
          &:hover,
          &:focus-visible {
            border-color: #b6d5ed !important;
          }
          &:active,
          &:focus-visible {
            background: var(--component-blue-background);
          }
        }
      }
    }
  }

  &--variant {
    &-fill {
    }

    &-outline {
      background: transparent;
      border: 1px solid currentColor;
    }

    &-text {
      background: transparent;
      padding: 0 !important;
      width: fit-content;
    }
  }

  &--size {
    &-extra-large {
      padding: 14px;
      font-size: var(--font-size-16);
      font-weight: var(--font-weight-600);
      line-height: 20px;

      #{$this}__content {
        min-height: 20px;
      }

      &#{$this}--variant-outline {
        padding: 13px;

        &#{$this}--without-icon {
          padding: 13px 15px;
        }
      }

      &#{$this}--without-icon {
        padding: 14px 16px;
      }
    }

    &-large {
      padding: 8px;
      font-size: var(--font-size-14);
      font-weight: var(--font-weight-600);
      line-height: 19.6px;

      #{$this}__content {
        min-height: 20px;
      }

      &#{$this}--variant-outline {
        padding: 7px;

        &#{$this}--without-icon {
          padding: 7px 15px;
        }
      }

      &#{$this}--without-icon {
        padding: 8px 16px;
      }
    }

    &-medium {
      padding: 6px;
      font-size: var(--font-size-14);
      font-weight: var(--font-weight-500);
      line-height: 18.2px;

      #{$this}__content {
        min-height: 20px;
      }

      &#{$this}--variant-outline {
        padding: 5px;

        &#{$this}--without-icon {
          padding: 5px 15px;
        }
      }

      &#{$this}--without-icon {
        padding: 6px 16px;
      }
    }

    &-medium-small {
    }

    &-small {
      padding: 4px;
      font-size: var(--font-size-standart);
      font-weight: var(--font-weight-500);

      #{$this}__content {
        min-height: 18px;
        gap: 2px;
      }

      &#{$this}--variant-outline {
        padding: 3px;

        &#{$this}--without-icon {
          padding: 2px 15px;
        }
      }

      &#{$this}--without-icon {
        padding: 3px 16px;

        #{$this}__content {
          min-height: 26px;
        }
      }
    }
  }

  &--custom-colored {
    &#{$this}--variant {
      &-fill {
        background-color: v-bind(customColor) !important;
        color: var(--color-font-invert);

        &:active,
        &:focus,
        &:hover {
          background-color: v-bind(customColorBackgroundHoverRGBA) !important;
        }
      }

      &-outline,
      &-text {
        color: v-bind(customColor) !important;

        &:active,
        &:focus,
        &:hover {
          color: v-bind(customColorBackgroundHoverRGBA) !important;
        }
      }
    }
  }

  &--centered {
    #{$this}__text {
      flex: 0;
    }
  }

  &--square {
    border-radius: 0;
  }
  &--full-width {
    width: 100%;
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
