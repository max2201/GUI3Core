<template>
  <div class="table-group">
    <h3 v-if="title" class="table-group__title">
      {{ title }}
    </h3>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<style lang="scss" scoped>
.table-group {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__title {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: var(--color-font);
    padding: 4px 0 8px;
  }
}
</style>
