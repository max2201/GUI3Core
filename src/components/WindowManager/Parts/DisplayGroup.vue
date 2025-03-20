<template>
  <div class="group" :class="[primary && '_primary', highlight && `_highlight-${highlight}`]">
    <span class="group__label">{{ label }}</span>
    <span class="group__value">
      <template v-if="value">{{ value }}</template>
      <template v-else>–</template>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  value?: string
  primary?: boolean
  highlight?: 'green' | 'red' | 'orange'
}>()
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
  & + & {
    margin-top: 8px;
  }
  &__label {
    font-size: var(--font-size-standart);
    color: var(--color-gray);
  }
  &__value {
    margin-top: 2px;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    line-height: 1.2;
  }

  // modifier
  &._primary {
    min-height: 42px;
    padding: 4px 12px;
    border-radius: 5px;

    .group {
      &__value {
        margin-top: 1px;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-400);
      }
    }
  }

  // highlight styles
  &._highlight-green {
    background: #ebfae5;
  }
  &._highlight-red {
    background: #fff4ef;
  }
}
</style>
