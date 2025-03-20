<!-- @/components/ExistLockModal.vue -->
<template>
  <UiModal
    name="exist-lock"
    :isCustomForm="modalParams?.isActions"
    :class="[
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.objectEventsList,
      StopClickOutsideClasses.tableTr,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.windowManager,
    ]"
  >
    <div class="exist-lock">
      <div class="exist-lock__image">
        <div class="exist-lock__image-scaler">
          <img src="@/assets/img/decor/notification-error.svg" alt="exist-lock image" />
        </div>
      </div>

      <div class="exist-lock__body">
        <div class="exist-lock__title h6-title mb-5">
          Объект {{ modalParams?.lockedObjectName }} уже редактируется другим пользователем
        </div>
        <div class="mb-5">
          <LiteViewField
            :field="{
              Title: 'Сотрудник',
              Value: modalParams?.userName,
            }"
            ignore-state
          />
          <LiteViewField
            :field="{
              Title: 'Время блокировки',
              Value: modalParams?.lockDateTime,
            }"
            ignore-state
          />
        </div>
      </div>
    </div>
    <template #buttons>
      <div class="exist-lock__actions" v-if="modalParams?.isActions">
        <div>
          <UiButton1 theme="danger" variant="outline" size="large" @click="forceUnlock">
            Принудительно разблокировать
          </UiButton1>
        </div>
        <div>
          <UiButton1 theme="secondary" variant="outline" size="large" @click="close">
            Продолжить просмотр
          </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const sharedModals = useSharedModalsStore()
const { modalParams } = storeToRefs(sharedModals)
const close = () => {
  modalParams.value?.onCancel?.()
}

const forceUnlock = () => {
  modalParams.value?.onForceUnlock?.()
}
</script>

<style lang="scss" scoped>
.exist-lock {
  display: grid;
  grid-template-columns: 170px 350px;

  &__image {
    font-size: 0;
  }

  &__image-scaler {
    position: relative;
    z-index: 1;
    padding-bottom: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  &__actions {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__body {
    padding-top: 8px;
    padding-left: 8px;
  }

  &__text {
    margin-top: 18px;
  }
}
</style>
