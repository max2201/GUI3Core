<template>
  <div class="ui-datepicker" :class="{ 'ui-datepicker--time': mode === 'dateTime' }">
    <VDatePicker
      hide-time-header
      auto-hide
      v-bind="$attrs"
      v-model="localValue"
      :attributes="attributes"
      :mode="mode"
      is24hr
      :is-required="!clearable"
      :popover="
        isString
          ? false
          : {
              visibility: 'focus',
              placement: 'bottom',
            }
      "
      :min-date="$attrs['min-date'] || new Date('1925-01-01')"
      :max-date="$attrs['max-date'] || new Date('2100-01-01')"
    >
      <template #default="{ togglePopover, inputValue, inputEvents }">
        <slot :slotScope="{ togglePopover, inputValue, inputEvents }">
          <UiInput1
            :id="id"
            :theme="inputTheme"
            :label="label"
            :placeholder="
              placeholder ? placeholder : mode === 'date' ? 'ДД.ММ.ГГГГ' : 'ДД.ММ.ГГГГ ЧЧ:ММ'
            "
            ref="inputRef"
            :disabled="disabled"
            :clearable="!disabled && clearable"
            :model-value="
              inputValue.length === 2 || inputValue.length === 5 ? inputValue + '.' : inputValue
            "
            v-on="inputEvents"
            @clear-input="clean"
            :icon="isString ? undefined : icon"
            :icon-position="iconPosition"
            :mask="mask ? mask : mode === 'date' ? '##.##.####' : '##.##.#### ##:##'"
            :has-modified="hasModified"
            @icon-click="togglePopover"
            @maska="maskCompletedCheck($event)"
          />
        </slot>
      </template>
      <template #header-prev-button>
        <SvgIcon :width="24" :height="24" name="chevron-left" />
      </template>
      <template #header-next-button>
        <SvgIcon :width="24" :height="24" name="chevron-right" />
      </template>
      <template #nav-prev-button>
        <SvgIcon :width="24" :height="24" name="chevron-left" />
      </template>
      <template #nav-next-button>
        <SvgIcon :width="24" :height="24" name="chevron-right" />
      </template>
    </VDatePicker>
  </div>
</template>

<script setup lang="ts">
import { parse, format, isValid } from 'date-fns'
const inputRef = ref<HTMLInputElement | null>(null)
// Определяем свойства
const props = defineProps({
  modelValue: [Date, String, null],
  mode: {
    type: String,
    default: 'date',
    validator: (mode: string) => ['date', 'dateTime'].includes(mode),
  },
  id: {
    type: String,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'calendar',
  },
  inputTheme: {
    type: String,
    default: undefined,
  },
  iconPosition: {
    type: String,
    default: 'right',
    validator: (size: string) => ['left', 'right'].includes(size),
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
  hasModified: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  isString: {
    type: Boolean,
    default: false,
  },
})

// Определяем события
const emit = defineEmits(['update:modelValue', 'maska'])

// Локальное значение
const localValue = ref<Date | null>(null)

// Форматирование даты
const parseDate = (value: string): Date | null => {
  const formats = ['dd.MM.yyyy HH:mm:ss', 'dd.MM.yyyy HH:mm', 'dd.MM.yyyy']
  for (const formatString of formats) {
    const date = parse(value, formatString, new Date())
    if (isValid(date)) {
      return date
    }
  }
  return null
}

// Отслеживаем завершенность ввода маски
const maskCompletedCheck = ({ detail: { completed } }) => {
  emit('maska', { detail: { completed } })
}

// Инициализация начального значения
watch(
  () => props.modelValue,
  (value) => {
    if (value === '01.01.1900' || value === '01.01.1900 00:00:00') {
      localValue.value = null
      return
    }
    if (value instanceof Date && isValid(value)) {
      localValue.value = value
    } else if (typeof value === 'string') {
      localValue.value = parseDate(value)
    } else {
      localValue.value = null
    }
  },
  { immediate: true },
)

// Синхронизация локального значения с `modelValue`
watch(localValue, (value) => {
  if (!value) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', format(value, 'dd.MM.yyyy HH:mm:ss'))
  }
})

// Очистка значения
const clean = () => {
  localValue.value = null
}

// Вычисляемые атрибуты
const attributes = computed(() => {
  return [
    {
      key: 'today',
      dot: true,
      dates: new Date(),
    },
  ]
})
const onEventGlobalFocus = (id: string) => {
  if (!props.id || id !== props.id) return

  inputRef.value?.focus()
}
// Отписываемся от события при уничтожении компонента
onBeforeUnmount(() => {
  EventBus.off(GlobalEvents.FocusElement, onEventGlobalFocus)
})
// Подписываемся на событие при монтировании
onMounted(() => {
  EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
})
</script>

<style lang="scss" scoped>
.ui-datepicker {
  :deep(.ui-input__icon) {
    cursor: pointer;
  }
  :deep(.vc-popover-content) {
    .vc-popover-content-wrapper {
      transform: unset !important;
      width: 100%;
      height: 100%;

      &:not([data-popper-placement]) {
        display: none;
      }

      .vc-nav-popover-container {
        margin: 0;
        padding: 0;
        height: 100%;
        border: none;

        .vc-nav-container {
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;

          .vc-nav-header {
            .vc-nav-arrow {
              width: 24px;
              height: 24px;
              color: var(--color-gray);
              background: transparent;
              box-shadow: unset;

              &:hover,
              &:focus {
                color: var(--color-font);
              }
            }

            .vc-nav-title {
              background: transparent;
              font-family: Inter;
              font-weight: 500;
              font-size: 14px;
              line-height: 18px;
              color: var(--color-font);
              border-bottom: 1px dashed currentColor;
              text-transform: capitalize;
              border-radius: 0;
              padding: 0;
              height: 24px;
              outline: none;
              box-shadow: unset;

              &:hover,
              &:focus {
                color: var(--component-primary-hover);
              }
            }
          }

          .vc-nav-items {
            margin: 0;
            gap: 20px;
            height: 100%;
            border-top: 1px solid #d5dde3;
            padding-top: 16px;

            .vc-nav-item {
              width: 100%;
            }
          }
        }
      }

      .vc-popover-caret {
        display: none;
      }
    }
  }

  :deep(.vc-container) {
    min-width: 264px;

    .vc-time-picker {
      border-top: none;
      padding: 16px 20px 20px;

      .vc-time-select-group {
        padding: 3px 5px;
        gap: 2px;
        border: 1px solid var(--color-border);
        border-radius: 5px;
        background: transparent;

        .vc-base-icon {
          color: var(--color-gray);
          margin: 0;
          margin-left: 10px;
          width: 24px;
          height: 24px;
          order: 3;
        }

        .vc-base-select {
          font-family: Inter;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          color: #23282f;

          select {
            text-align: center;
            padding: 0;
            margin: 0;
            font-family: Inter;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            color: #23282f;
            height: auto;
            border: none;
          }
        }
      }
    }

    .vc-weeks {
      padding: 16px 0 20px;
      margin: 0 20px;
      min-width: unset;
      border-top: 1px solid #d5dde3;
    }

    .vc-header {
      height: auto;
      margin: 0 20px;
      padding: 20px 0 20px;

      .vc-arrow {
        box-shadow: unset;
        width: 24px;
        height: 24px;
        color: var(--color-gray);
        background: transparent;

        &:hover {
          color: var(--color-font);
        }
      }

      .vc-title {
        background: transparent;
        font-family: Inter;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: var(--color-font);
        border-bottom: 1px dashed currentColor;
        text-transform: capitalize;
        border-radius: 0;
        padding: 0;
        height: 24px;

        &:hover {
          color: var(--component-primary-hover);
        }
      }
    }

    .vc-day {
      font-family: Inter;
      font-weight: 400;
      font-size: 14px;
      line-height: 18.2px;
      color: var(--color-font-2);

      &-content {
        border-radius: 5px;
        width: 100%;
        height: 100%;
      }

      .vc-highlight {
        background: #1a8ff2;
        border-radius: 5px;
        width: 100%;
        height: 100%;
      }
    }

    .is-not-in-month * {
      opacity: 1;
      pointer-events: auto;
      color: #8990a2;
    }
  }

  &--time {
    :deep(.vc-container) {
      .vc-weeks {
        padding-bottom: 16px;
        border-bottom: 1px solid #d5dde3;
      }
    }
  }
}
</style>
