<template>
  <div :class="['ui-switch', { 'ui-switch_active': value }]" @click="change">
    <div class="ui-switch__wrapper"><div class="ui-switch__dot" /></div>
    <div>{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['input'])

const change = () => {
  emits('input', !props.value)
}
</script>

<style lang="scss" scoped>
.ui-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ui-switch__wrapper {
  display: block;
  position: relative;
  width: 28px;
  height: 16px;
  transition: position ease-out 0.1s, background-color ease-out 0.2s;
  background-color: var(--color-gray);
  border-radius: 8px;
}

.ui-switch__dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  background-color: var(--component-primary-color-hover);
  border-radius: 50%;
}

.ui-switch_active {
  .ui-switch__wrapper {
    background-color: var(--color-primary);
  }

  .ui-switch__dot {
    left: 14px;
  }
}
</style>
