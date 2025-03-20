<template>
  <div :class="['counter-component', {}]">
    <SvgIcon
      v-if="iconBefore"
      :name="iconBefore"
      :is-link="false"
      class="counter-component__icon-before"
    />
    <span class="counter-component__value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
  iconBefore: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss">
.counter-component {
  display: inline-flex;
  align-items: center;
  height: 18px;
  gap: 2px;
  padding: 0 5px;
  border-radius: 50%;
  background-color: var(--color-bg-darken);
  color: var(--color-gray);

  &__icon-before > svg {
    width: 14px;
    height: 14px;
  }
}
</style>
