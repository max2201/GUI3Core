<template>
  <label
    :for="id"
    :class="{
      'ui-checkbox--active': isChecked,
      'ui-checkbox--disabled': disabled,
      'ui-checkbox--error': error,
      'ui-checkbox--radio': isRadio,
    }"
    class="ui-checkbox"
    @click.prevent="toggleCheckbox"
  >
    <input
      v-bind="$attrs"
      ref="inputRef"
      :id="id"
      :type="type"
      :name="name"
      :disabled="disabled"
      :checked="isChecked"
      class="ui-checkbox__input"
    />
    <span class="ui-checkbox__box">
      <div v-if="isRadio" class="ui-checkbox__checkmark ui-checkbox__checkmark--radio" />
      <SvgIcon v-else class="ui-checkbox__checkmark" name="checkbox-mark" />
    </span>

    <slot>
      <span class="ui-checkbox__text" v-if="text">
        {{ text }}
      </span>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'

const id = 'id_' + nanoid(10)
const inputRef = ref<HTMLInputElement | null>(null)
const props = defineProps({
  type: {
    type: String,
    default: 'checkbox',
    validator: (type: string) => ['checkbox', 'radio'].includes(type),
  },
  isTriple: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'name',
  },
  text: {
    type: String,
    default: '',
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const localValue = defineModel<boolean | number>('modelValue', {
  default: false,
})
const emit = defineEmits(['update:modelValue'])

const isRadio = computed(() => {
  return props.type === 'radio'
})

const isChecked = computed(() => {
  return props.isTriple ? localValue.value === 1 : localValue.value === true
})
const isIndeterminate = computed(() => props.isTriple && localValue.value === 2)

function toggleCheckbox() {
  if (props.isTriple) {
    localValue.value = (+localValue.value + 1) % 3
    if (inputRef.value) {
      inputRef.value.indeterminate = isIndeterminate.value
    }
  } else {
    localValue.value = !localValue.value
  }
}
</script>

<style lang="scss" scoped>
.ui-checkbox {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  position: relative;
  gap: 8px;
  cursor: pointer;

  &__input {
    width: 0.1px;
    height: 0.1px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
  }

  &__box {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    min-width: 18px;
    min-height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 2px solid var(--color-gray);
    font-size: 10px;
    color: var(--color-primary);
    transition:
      border 0.25s $ease,
      background 0.25s $ease,
      outline 0.25s $ease;

    .ui-checkbox__checkmark {
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
      will-change: transform, opacity;
      transition:
        transform 0.25s $ease,
        opacity 0.25s $ease;

      &--radio {
        width: 6px;
        height: 6px;
        background: var(--color-primary);
        border-radius: 50%;
      }
    }
  }

  &__text {
    color: var(--color-font);
    transition: color 0.2s;
    font-family: Inter;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;

    strong {
      font-weight: var(--font-weight-600);
    }

    a {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }

  &--radio {
    .ui-checkbox {
      &__box {
        border-radius: 50%;
      }
    }
  }

  &:hover {
    .ui-checkbox__box {
      border-color: var(--color-primary);
    }
  }

  .ui-checkbox__input:focus + .ui-checkbox__box {
    outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
  }

  &--active {
    .ui-checkbox {
      &__box {
        border-color: var(--color-primary);

        .ui-checkbox__checkmark {
          opacity: 1;
          transform: scale(1);
        }
      }

      &__text {
        color: var(--color-font);
      }
    }
  }

  &--disabled {
    cursor: none;
    pointer-events: none;

    .ui-checkbox__box {
      border-color: var(--color-border);
    }

    .ui-checkbox__checkmark {
      color: var(--color-border);

      &--radio {
        background-color: var(--color-border);
      }
    }
  }

  &--error {
    .ui-checkbox {
      &__box {
        border-color: var(--color-red);
        color: var(--color-red);
      }
      &__text {
        color: var(--color-red);
      }
    }
    &:hover {
      .ui-checkbox {
        &__box {
          border-color: var(--color-red);
        }
      }
    }
  }
}
</style>
