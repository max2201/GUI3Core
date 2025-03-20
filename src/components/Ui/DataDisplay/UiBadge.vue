<template>
  <div
    :class="[
      'badge-component',
      {
        'badge-component_passive': passive,
        'badge-component_primary': primary,
        'badge-component_success': success,
        'badge-component_danger': danger,
        'badge-component_left-rounded': roundedLeftBorder,
        'badge-component_right-rounded': roundedRightBorder,
      },
    ]"
  >
    <SvgIcon
      v-if="iconBefore"
      :name="iconBefore"
      :is-link="false"
      class="badge-component__icon-before"
    />
    <span class="badge-component__value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  passive: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  iconBefore: {
    type: String,
    default: '',
  },
  roundedLeftBorder: {
    type: Boolean,
    default: true,
  },
  roundedRightBorder: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss">
.badge-component {
  display: inline-flex;
  align-items: center;
  height: 18px;
  gap: 2px;
  padding: 0 8px;

  &_primary {
    background-color: var(--component-primary-background);
    color: var(--component-primary-color);
    border: 1px solid var(--component-primary-border);

    &:hover:not(.badge-component_passive) {
      background-color: var(--component-primary-backgroud-hover);
    }
  }

  &_success {
    background-color: var(--component-green-background);
    color: var(--component-green-color);

    &:hover:not(.badge-component_passive) {
      background-color: var(--component-green-backgroud-hover);
    }
  }

  &_danger {
    background-color: var(--component-danger);
    color: var(--component-danger-color);

    &:hover:not(.badge-component_passive) {
      background-color: var(--component-danger-hover);
    }
  }

  &_left-rounded {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &_right-rounded {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  &:not(.badge-component_right-rounded) {
    padding-right: 4px;
  }

  &:not(.badge-component_left-rounded) {
    padding-left: 4px;
  }

  &__icon-before > svg {
    width: 14px;
    height: 14px;
  }
}
</style>
