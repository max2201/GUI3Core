<template>
  <div class="ui-tags">
    <UiTag v-for="(tag, index) in tags" :key="index" v-bind="{ ...tag }"></UiTag>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: {
    value: string
    label?: string
    iconBefore?: string
    iconBeforeAction?: Function
    iconAfter?: string
    iconAfterAction?: Function
    tagClickAction?: Function
  }[]
}>()
</script>

<style lang="scss">
.ui-tags {
  display: flex;
  gap: 6px;
  overflow: hidden;
  flex-wrap: wrap;
}
</style>
