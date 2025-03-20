<template>
  <Teleport v-if="isOpen" :to="anchorSelector">
    <div
      ref="currentDetailsModalRef"
      :class="['ui-field-detials-modal__wrapper', ...Object.values(StopClickOutsideClasses)]"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <div
        class="ui-field-detials-modal"
        :class="{ 'ui-field-detials-modal--compact': compact }"
        :style="[
          {
            width: width ? `${width}px` : '',
          },
        ]"
        @click.stop.prevent
      >
        <div class="ui-field-detials-modal__close">
          <UiButton1
            :icon-size="20"
            icon-left="close"
            variant="text"
            theme="transparent"
            @click.stop="onClose"
          ></UiButton1>
        </div>

        <div class="ui-field-detials-modal__content">
          <div class="ui-field-detials-modal__title">
            <div>{{ title }}</div>
          </div>
          <div class="ui-field-detials-modal__body">
            <slot></slot>
          </div>
        </div>

        <div class="ui-field-detials-modal__actions">
          <div class="ui-field-detials-modal__actions-side">
            <UiButton1 v-if="!hideClose" variant="outline" @click="onClose"> Закрыть </UiButton1>
            <slot name="left-actions"></slot>
          </div>
          <div class="ui-field-detials-modal__actions-side">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import { onUnmounted } from 'vue'
const props = defineProps<{
  title: string
  isOpen: boolean
  anchorId?: string
  width?: number
  hideClose?: boolean
  compact?: boolean
}>()

const anchorSelector = computed(() => {
  if (props.anchorId) {
    console.info('anchorSelector', `#${props.anchorId}`)
    console.info('document find', document.getElementById(props.anchorId))
    return `#${props.anchorId}`
  }

  console.info('anchorSelector', 'body')

  return 'body'
})

const emits = defineEmits(['close'])

const currentDetailsModalRef = ref()
let isWaitMouseDownOnModal = false

const onMouseDown = (e: MouseEvent) => {
  if (!currentDetailsModalRef.value) return

  if (currentDetailsModalRef.value === e.target) {
    isWaitMouseDownOnModal = true
  }
}

const onMouseUp = (e: MouseEvent) => {
  if (!currentDetailsModalRef.value) return

  if (currentDetailsModalRef.value !== e.target) {
    isWaitMouseDownOnModal = false
    return
  }

  if (isWaitMouseDownOnModal) {
    onClose()
  }
}
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
const onClose = () => {
  isWaitMouseDownOnModal = false
  emits('close')
}
</script>

<style lang="scss" scoped>
.ui-field-detials-modal__wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-input-modal);
  background-color: rgba(100, 100, 100, 0.2);
}

.ui-field-detials-modal {
  position: relative;
  width: 760px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: var(--component-background);
  box-shadow: var(--box-shadow-small);
  &--compact {
    width: 520px;
  }
  &__content {
    padding: 36px;
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    color: var(--color-font);
    font-weight: 600;
    font-size: var(--font-size-16);
    line-height: 20.8px;
  }
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 1px 2px;
  }
  &__body {
    display: block;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 36px;
    width: 100%;
    background: var(--color-background);
    border-top: 1px solid var(--color-border);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    gap: 8px;
  }

  &__actions-side {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
