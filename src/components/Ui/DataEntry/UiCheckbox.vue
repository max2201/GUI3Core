<template>
  <label
    :for="id"
    :class="[
      isRadio && '_radio',
      checked && '_active',
      disabled && '_disabled',
      error && '_error',
      isEmpty && '_empty',
    ]"
    class="cb checkbox radio"
    @click.prevent="change"
  >
    <input
      v-bind="$attrs"
      ref="inputRef"
      :id="id"
      :type="type"
      :name="name"
      :disabled="disabled"
      :checked="checked"
      class="cb__input"
    />
    <span class="cb__icon">
      <SvgIcon name="checkmark" />
    </span>
    <span class="cb__text text-s">
      <slot>
        {{ text }}
      </slot>
    </span>
  </label>
</template>

<script setup lang="ts">
// dump component to prevent errors
// @checked is controlled by parent state

import { nanoid } from 'nanoid'
const id = nanoid(10)

const emit = defineEmits(['change'])

const props = defineProps({
  type: {
    type: String,
    default: 'checkbox',
  },
  checked: {
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

const isRadio = computed(() => {
  return props.type === 'radio'
})

const slots = useSlots()
const isEmpty = computed(() => {
  return !slots.default && !slots.toggle && !props.text
})

const change = () => {
  emit('change')
}
</script>

<style lang="scss" scoped>
.cb {
  display: inline-flex;
  // align-items: flex-start;
  align-items: center;
  position: relative;
  font-size: var(--font-size-14);
  line-height: 1.3;
  min-height: 32px;

  &__input {
    width: 0.1px;
    height: 0.1px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
  }

  &__icon {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    min-width: 20px;
    min-height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 2px solid var(--color-gray);
    font-size: 10px;
    color: var(--color-primary);
    cursor: pointer;
    transition: border 0.25s $ease, background 0.25s $ease, outline 0.25s $ease;

    .svg-icon {
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
      will-change: transform, opacity;
      transition: transform 0.25s $ease, opacity 0.25s $ease;
    }
  }

  &__text {
    cursor: pointer;
    padding-left: 8px;
    color: var(--color-font);
    transition: color 0.2s;

    strong {
      font-weight: var(--font-weight-600);
    }

    a {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }

  &._radio {
    .cb {
      &__icon {
        border-radius: 50%;

        .svg-icon {
          display: none;
        }
      }
    }
  }

  &:hover {
    .cb__icon {
      border-color: var(--color-primary);
    }
  }

  .cb__input:focus + .cb__icon {
    outline: 4px solid rgba(var(--color-primary-rgb), 0.3);
  }

  &._active {
    .cb {
      &__icon {
        border-color: var(--color-primary);
        background: var(--color-primary);
        &::after {
          transform: scale(1);
          opacity: 1;
        }
        .svg-icon {
          opacity: 1;
          transform: scale(1);
        }
      }
      &__text {
        color: var(--color-font);
      }
    }

    &:not(._radio) {
      .cb__icon {
        background: transparent;
      }
    }
  }

  &._disabled {
    cursor: none;
    pointer-events: none;
    .cb__icon {
      border-color: #aeaeae;
      &::after {
        background: #aeaeae;
      }
    }
    &:not(._active) {
      .cb__icon {
        background: var(--color-bg);
      }
    }
  }
  &._error {
    .cb {
      &__icon {
        border-color: var(--color-red);
        &::after {
          transform: scale(0);
        }
      }
    }
  }

  &._empty {
    .cb {
      &__text {
        padding-left: 0;
      }
    }
  }
}
</style>
