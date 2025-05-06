<template>
  <div class="request-new-view"><request-new-form :object-id="objectId"></request-new-form></div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  objectId: number
  loading: boolean
}>()
</script>

<style lang="scss" scoped>
.request-new-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: var(--color-font-disabled);
  font-weight: var(--font-weight-500);
  font-size: var(--font-size-16);
  line-height: 150%;
  background-color: var(--color-font-disabled);
}
</style>
