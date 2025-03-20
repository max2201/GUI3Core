<template>
  <div
    :class="[
      'page',
    ]"
  >
    <LayoutHeaderMessenger />

    <div class="page__wrapper">
        <slot></slot>
    </div>

    <SharedModals />
  </div>
</template>

<script setup lang="ts">
import { LayoutHeaderMessenger, SharedModals } from '@c/Layout'
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 50px calc(100vh - 50px);
  overflow: hidden;

  &__wrapper {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: auto;
    width: 100vw;
    overflow: auto;
  }
}
</style>
