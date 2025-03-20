<template>
  <div class="ui-field-input-wrapper">
    <label
      :class="[
        'no-user-select',
        'ui-field-input-wrapper__label',
        {
          'ui-field-input-wrapper__label--modified': hasModified,
        },
      ]"
      >{{ label }}</label
    >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  hasModified?: boolean
}>()
</script>

<style lang="scss" scoped>
.ui-field-input-wrapper {
  &__label {
    display: block;
    line-height: 1.3;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    margin-bottom: 6px;
    user-select: none;
    &--modified {
      color: var(--color-red) !important;
    }
  }
}
</style>
