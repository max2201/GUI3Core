<template>
  <div class="stub-panel">
    <slot name="content">
      <SvgIcon v-if="icon" :name="icon" :width="94" :height="94" />
      <span v-if="text" class="stub-panel__text">{{ text }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string
  text?: string
}>()
</script>

<style lang="scss" scoped>
.stub-panel {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 0 28px;
  &__text {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    color: #8990a2;
  }
}
</style>
