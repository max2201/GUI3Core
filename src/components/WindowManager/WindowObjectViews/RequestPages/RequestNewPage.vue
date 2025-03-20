<template>
  <div class="request-new-view">
    <SvgIcon name="stub-box" :width="170" :height="180" />
    <div>Создание новой заявки</div>
  </div>
  <request-new-form :object-id="objectId"></request-new-form>
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
