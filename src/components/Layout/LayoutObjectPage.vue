<template>
  <div :class="['page']">
    <LayoutHeaderSimple />

    <div class="page__wrapper">
      <slot></slot>
    </div>
    <ObjectEventsList />
    <LiteViewRoot />
    <FreeModalsRoot />
    <CreateNotificationModal />
    <ModalVerification />
    <SharedModals />
  </div>
</template>

<script setup lang="ts">
import { LayoutHeaderSimple, SharedModals } from '@c/Layout'
import CreateNotificationModal from '@c/Notifications/CreateNotificationModal.vue'
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
