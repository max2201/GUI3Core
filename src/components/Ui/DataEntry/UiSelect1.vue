<template>
  <div class="ui-select" :class="[...modifiers, ...additionalClass]">
    <label v-if="selectLabel" class="ui-select__label" :for="id">
      <span
        >{{ selectLabel }}<span v-if="isRequired" class="ui-select__label-sup-star">*</span></span
      >
      <div
        v-if="error"
        class="ui-select__label-error-icon"
        :title="typeof error === 'boolean' ? '' : error"
      >
        <SvgIcon
          :width="size === 'large' ? 14 : 12"
          :height="size === 'large' ? 14 : 12"
          name="info"
        />
      </div>
      <div
        v-if="warning"
        class="ui-select__label-warning-icon"
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
    <div ref="containerRef">
      <vue-select
        ref="vueselect"
        v-bind="$attrs"
        v-model="localValue"
        class="ui-select__wrapper"
        :id="id"
        :options="options"
        :disabled="disabled"
        :clearable="multiple || clearable"
        :error="error"
        :multiple="multiple"
        :close-on-select="!multiple"
        :deselect-from-dropdown="multiple"
        :searchable="searchable"
      >
        <template #open-indicator="{ attributes }">
          <span v-bind="attributes">
            <SvgIcon :width="24" :height="24" name="chevron-down" />
          </span>
        </template>
        <template v-if="$slots['list-header']" #list-header>
          <div class="ui-select__list-header">
            <slot name="list-header"></slot>
          </div>
        </template>
        <template #option="item">
          <slot name="option" :item="item">
            <UiCheckbox1
              class="ui-select__option"
              v-if="multiple"
              :model-value="
                Array.isArray(localValue) &&
                localValue
                  .map((elem) => elem.value || elem)
                  .includes(item.value || item.label || item)
              "
              :text="item[$attrs.label] || item.label || item"
            />
            <span v-else>{{ item[$attrs.label] || item.label || item }}</span>
          </slot>
        </template>
        <template #selected-option-container="{ option }">
          <span
            class="vs__selected"
            :class="{
              'vs__selected--multiple': Array.isArray(localValue) && localValue.length >= 2,
            }"
          >
            {{ option[$attrs.label] || option.label || option }}
          </span>
        </template>
        <template #no-options>
          <span> Не найдено</span>
        </template>
      </vue-select>
    </div>
    <div v-if="helper" class="ui-select__helper">{{ helper }}</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import VueSelect from 'vue-select'
import { onClickOutside } from '@vueuse/core'

const containerRef = ref(null)
const vueselect = ref<any>(null)
onClickOutside(containerRef, () => {
  if (vueselect.value.open) {
    vueselect.value.open = false
  }
})

const dropdownMaxHeight = computed(() => {
  if (containerRef.value) {
    const windowContentRect = containerRef.value.getBoundingClientRect()
    const result = document.body.clientHeight - windowContentRect.bottom - 70
    return `${Math.max(result, 50)}px`
  }
  return '100px'
})

const id = nanoid()
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits([
  'onChange',
  'onChangeable',
  'onEnter',
  'onCtrlAltEnter',
  'onCtrlEnter',
  'update:modelValue',
])

defineExpose({ inputRef })

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  id: {
    type: String,
  },
  selectLabel: {
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
  loading: {
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
  // selectOptions
  multiple: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: true,
    default() {
      return []
    },
  },
})
const localValue = defineModel<unknown>('modelValue')

const modifiers = computed(() => [
  showError.value && 'ui-select--error',
  props.disabled && 'ui-select--disabled',
  `ui-select--theme-${props.theme}`,
  `ui-select--size-${props.size}`,
  props.hasModified ? 'ui-select--modified' : undefined,
  props.readableDisableMode ? 'ui-select--readable-disable-mode' : undefined,
  props.searchable && 'ui-select--searchable',
  props.multiple && 'ui-select--multiple',
])

const showError = computed(() => {
  return props.error
})

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

// hooks
onMounted(() => {
  if (props.focusOnMount) {
    inputRef.value?.focus()
  }
})

const onEventGlobalFocus = (id: string) => {
  if (id !== props.id) return

  inputRef.value?.focus()
}
EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
</script>

<style lang="scss" scoped>
.ui-select {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__list-header {
    position: sticky;
    top: 0;
    background: var(--component-background);
    z-index: 1;
    line-height: 18px;
    padding: 8px 16px;
  }

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

  &__option {
    align-items: flex-start;
  }

  &__wrapper {
    &.vs--open {
      :deep(.vs__selected) {
        position: static;
      }
    }

    :deep(.vs__dropdown-toggle) {
      cursor: pointer;
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
    }

    :deep(.vs__actions) {
      padding: 0;
      flex-shrink: 0;

      .vs__open-indicator {
        display: flex;
      }

      .vs__clear {
        fill: var(--color-gray) !important;

        &:hover {
          fill: var(--color-red) !important;
        }
      }
    }

    :deep(.vs__selected-options) {
      overflow: hidden;
      padding: 0;
      flex-wrap: nowrap;
      flex-basis: unset;

      .vs__search {
        margin: 0;
        padding: 0;
        border: none;
        display: block;
      }

      .vs--open {
        position: relative;
      }

      .vs__selected {
        z-index: 1;
        margin: 0;
        padding: 0;
        border: none;
        white-space: nowrap;
      }
    }

    :deep(.vs__dropdown-menu) {
      top: calc(100% + 1px);
      max-height: v-bind(dropdownMaxHeight);
      padding: 8px 0;
      background: var(--component-background);
      border: none;
      border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);
      box-shadow: 0 4px 15px rgba(105, 78, 75, 0.14);
      gap: 1px;
      display: flex;
      flex-direction: column;

      .vs__no-options {
        padding: 14px 20px;
        font-size: var(--font-size-14);
        text-align: center;
      }
    }

    :deep(.vs__dropdown-option) {
      flex-shrink: 0;
      position: relative;
      padding: 8px 16px;
      color: var(--color-font-2);
      font-family: var(--font-base);
      font-size: var(--font-size-14);
      font-style: normal;
      font-weight: var(--font-weight-400);
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
      transition:
        background 0.1s $ease,
        color 0.25s $ease;
    }

    :deep(.vs__dropdown-option--selected) {
      background: var(--color-bg-active-10alpha);
    }

    :deep(.vs__dropdown-option--highlight) {
      background: var(--color-bg-active-10alpha);
    }

    &:hover {
      :deep(.vs__dropdown-toggle) {
        border: 1px solid var(--input-hover-background-color);
      }
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
  }

  //// SIZE modifiers
  &--size {
    &-normal {
      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          padding: 3px 5px 3px 11px;
        }
      }

      .ui-select__input {
        font-size: var(--font-size-14);
        line-height: 24px;
      }
    }

    &-large {
      gap: 8px;

      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          padding: 11px 11px 11px 19px;
        }
      }

      .ui-select__input {
        font-size: var(--font-size-16);
        line-height: 24px;
      }

      .ui-select__label {
        font-size: var(--font-size-14);
        line-height: 18.2px;
      }
    }
  }

  &--focused {
    z-index: 4;

    .ui-select__wrapper {
      :deep(.vs__dropdown-toggle) {
        border-color: var(--input-hover-background-color);
      }
    }
  }

  &--error {
    .ui-select__wrapper {
      :deep(.vs__dropdown-toggle) {
        border-color: var(--color-red);
      }
    }

    .ui-select__input {
      color: var(--color-red) !important;
    }
  }

  &--modified {
    .ui-select__label {
      color: var(--color-primary) !important;
    }
  }

  &--theme {
    &-success {
      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          background-color: var(--component-green-background-light);
        }
      }
    }

    &-error {
      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          background-color: var(--component-danger-background);
        }
      }
    }

    &-warning {
      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          background-color: var(--component-warning-background-light);
        }
      }
    }

    &-secondary {
      .ui-select__wrapper {
        :deep(.vs__dropdown-toggle) {
          background-color: var(--component-blue-background);
        }
      }
    }
  }

  &--disabled {
    .ui-select__wrapper {
      :deep(.vs__dropdown-toggle) {
        background: var(--color-background);
        border-color: var(--color-border);

        .vs__open-indicator,
        .vs__search {
          background-color: transparent;
        }
      }
    }

    &.ui-select--readable-disable-mode {
      .ui-select__input {
        color: var(--color-font);
      }
    }
  }

  &--searchable {
    &.vs--open {
      :deep(.vs__selected) {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .ui-select__wrapper {
      cursor: text;

      :deep(.vs__dropdown-toggle) {
        cursor: text;
      }
    }
  }

  &--multiple {
    :deep(.vs__selected-options) {
      gap: 3px;

      .vs__selected {
        background: transparent;

        &--multiple {
          &:not(:last-of-type) {
            &::after {
              content: ',';
            }
          }
        }
      }
    }

    &.ui-select--searchable {
      :deep(.vs__selected-options) {
        .vs__search {
          display: block;
        }
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
