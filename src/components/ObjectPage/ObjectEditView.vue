<template>
  <div class="object-edit" :style="{ width: props.width + '%' }">
    <UiLoader :loading="loading" theme="page" />
    <div class="object-edit__header">
      <SvgIcon name="userCreationOperations-add_request" :width="24" :height="24" />
      <span class="ml-2">{{ title }}</span>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 60,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.object-edit {
  position: absolute;
  z-index: 98;
  right: 0;
  overflow-y: auto;
  background: white;
  height: calc(100%);
  display: grid;
  grid-auto-rows: 42px 1fr;
  padding-bottom: 0px;
  box-shadow: 0px 16px 30px rgba(7, 31, 45, 0.2);
  &__header {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-bg-active);
    color: var(--component-green-color);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: start;
  }
}
</style>
