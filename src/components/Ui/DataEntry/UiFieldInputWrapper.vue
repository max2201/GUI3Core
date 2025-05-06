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
      >{{ label }}
      <span
        v-if="warning"
        class="ui-field-input-wrapper__label-warning-icon"
        :title="typeof warning === 'boolean' ? '' : warning"
      >
        <SvgIcon :width="14" :height="14" class="c-yellow" name="alertRounded" />
      </span>
    </label>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  hasModified?: boolean
  warning?: string | boolean
}>()
</script>

<style lang="scss" scoped>
.ui-field-input-wrapper {
  &__label {
    display: flex;
    align-items: center;
    gap: 3px;
    line-height: 1.3;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    margin-bottom: 4px;
    user-select: none;

    &-warning-icon {
      display: flex;
      cursor: pointer;
    }

    &--modified {
      color: var(--color-primary) !important;
    }
  }
}
</style>
