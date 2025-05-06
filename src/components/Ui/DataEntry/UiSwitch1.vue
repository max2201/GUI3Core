<template>
  <div
    :class="['ui-switch', { 'ui-switch--active': localValue, 'ui-switch--disabled': disabled }]"
    @click="change"
  >
    <div class="ui-switch__wrapper">
      <div class="ui-switch__dot" />
    </div>
    <div v-if="label" class="ui-switch__label" :title="label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const localValue = defineModel<boolean>('modelValue', { default: false })

const emits = defineEmits(['update:modelValue'])

const change = () => {
  if (props.disabled) return
  localValue.value = !localValue.value
}
</script>

<style lang="scss" scoped>
.ui-switch {
  $this: &;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &__wrapper {
    flex-shrink: 0;
    display: flex;
    position: relative;
    width: 28px;
    height: 16px;
    transition:
      position ease-out 0.1s,
      background-color ease-out 0.2s;
    background-color: var(--color-gray);
    border-radius: 8px;
  }

  &__dot {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    background-color: var(--component-primary-color-hover);
    border-radius: 50%;
  }

  &:hover {
    #{$this}__wrapper {
      background-color: var(--component-gray-hover);
    }
  }

  &--active {
    #{$this}__wrapper {
      background-color: var(--color-primary);
    }

    #{$this}__dot {
      left: 14px;
    }

    &:hover {
      #{$this}__wrapper {
        background-color: var(--component-primary-hover);
      }
    }
  }

  &__label{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
