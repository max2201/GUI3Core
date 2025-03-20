<template>
  <UiModal
    name="notification"
    v-if="modalParams"
    :is-form="modalParams.isForm"
    :is-custom-form="modalParams.isActions"
    :class="[
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.objectEventsList,
      StopClickOutsideClasses.tableTr,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.windowManager,
    ]"
  >
    <div class="notification" :class="modalParams?.tableData ? 'table' : ''">
      <div class="notification__image" v-if="!modalParams.tableData">
        <div class="notification__image-scaler">
          <img
            v-if="modalParams?.type === 'warning'"
            src="@/assets/img/decor/notification-warning.svg"
            alt="notification image"
          />
          <img
            v-else-if="modalParams?.type === 'error'"
            src="@/assets/img/decor/notification-error.svg"
            alt="notification image"
          />
          <img
            v-else-if="modalParams?.type === 'success'"
            src="@/assets/img/decor/notification-success.svg"
            alt="notification image"
          />
          <img v-else src="@/assets/img/decor/notification-info.svg" alt="notification image" />
        </div>
      </div>
      <div class="notification__body">
        <div class="notification__title h5-title">{{ modalParams.title }}</div>
        <p v-if="modalParams?.description" class="notification__text text-s mb-6">
          {{ modalParams?.description }}
        </p>
        <template v-if="modalParams?.tableData">
          <div class="notification__table" v-for="row in modalParams.tableData">
            <div class="notification__table-row">
              <SvgIcon :width="20" :height="20" name="alertRounded" class="color-red" />
              <div class="notification__table-reason">{{ row.reason }}</div>
              <div class="notification__table-title">{{ row.title }}</div>
            </div>
          </div>
        </template>

        <div v-if="modalParams?.stackTrace" class="notification__trace">
          <UiButton1 @click="copyError" theme="transparent" variant="text" size="small">
            Копировать ошибку</UiButton1
          >
        </div>
      </div>
    </div>
    <template #buttons>
      <div class="notification__actions" v-if="modalParams?.isActions">
        <div>
          <UiButton1 size="large" variant="outline" @click="close"> Закрыть </UiButton1>
        </div>
        <div>
          <UiButton1 size="large" @click="confirm"> Сохранить </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const sharedModals = useSharedModalsStore()
const { modalParams } = storeToRefs(sharedModals)
const toast = useToast()

const copyError = () => {
  // Создаем временный элемент input
  const tempInput = document.createElement('input')
  tempInput.value = modalParams.value?.stackTrace
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
  toast.success('Ошибка  скопирована')
}
const close = () => {
  modalParams.value?.onCancel?.()
}

const confirm = () => {
  modalParams.value?.onSave?.()
}
</script>

<style lang="scss" scoped>
.notification {
  $this: &;
  display: flex;
  &__actions {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    width: 100%;
  }
  &__image {
    flex: 0 0 170px;
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
  &__body {
    padding-top: 16px;
    padding-left: 30px;
  }
  &__text {
    margin-top: 18px;
  }
  &__table {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;

    &-row {
      align-items: center;
      font-weight: 400;
      line-height: 130%;
      display: grid;
      gap: 8px;
      grid-template-columns: 20px calc(50% - 28px) calc(50% - 8px);
    }
    &-reason {
      color: #8990a2;
    }
    &-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.notification.table {
  .notification__body {
    width: 100%;
    padding: 0;
  }
}
@include r($sm) {
  .notification {
    flex-wrap: wrap;
    &__image,
    &__body {
      flex: 1 1 auto;
    }
  }
}
</style>
