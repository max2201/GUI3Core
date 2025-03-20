<template>
  <div
    ref="currentModalDiv"
    class="modal"
    :class="[...modifiers, ...stopClasses]"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <div class="modal__wrapper" @click.prevent.stop>
      <div class="modal__close">
        <UiButton1
          :icon-size="20"
          icon-left="close"
          variant="text"
          theme="transparent"
          @click.stop="closeModal"
        ></UiButton1>
      </div>
      <div
        class="modal__content"
        :style="[
          {
            height: contentHeight,
          },
        ]"
      >
        <slot />
      </div>
      <div v-if="isForm" class="modal__actions">
        <UiButton1 class="mr-1" variant="outline" @click="closeModal"> Закрыть</UiButton1>
        <div class="modal__actions-right">
          <slot name="buttons"></slot>
        </div>
      </div>
      <div v-if="isCustomForm" class="modal__actions">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sharedModals = useSharedModalsStore()
const { modal: activeModal, modalParams } = storeToRefs(sharedModals)

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'center',
    validator: (v: string) => ['center', 'aside'].includes(v),
  },
  height: {
    type: String,
    default: '',
    validator: (v: string) => ['', 'fill'].includes(v),
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v: string) => ['normal', 'large', 'x-large'].includes(v),
  },
  padding: {
    type: Boolean,
    default: true,
  },
  scrolling: {
    type: Boolean,
    default: true,
  },
  isForm: {
    type: Boolean,
    default: false,
  },
  isCustomForm: {
    type: Boolean,
    default: false,
  },
  contentHeight: {
    type: String,
    default: '',
  },
  stopClasses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'opened'])

const isModalActive = computed(() => {
  return activeModal.value.includes(props.name)
})

const modifiers = computed(() => [
  `modal-${props.name}`,
  (props.isForm || props.isCustomForm) && '_form',
  isModalActive.value && '_active',
  props.position && `_${props.position}`,
  props.size && `_${props.size}`,
  props.height && `_${props.height}`,
  !props.padding && '_no-padding',
  !props.scrolling && '_no-scrolling',
])

const closeModal = () => {
  if (modalParams.value && modalParams.value.closable === false) {
    return false
  }

  if (isModalActive.value) {
    sharedModals.closeModal()
    emit('close')
  }
}

const currentModalDiv = ref<HTMLDivElement>()

let isWaitMouseDownOnModal = false

const onMouseDown = (e: MouseEvent) => {
  if (!currentModalDiv.value) return

  if (currentModalDiv.value === e.target) {
    isWaitMouseDownOnModal = true
  }
}

const onMouseUp = (e: MouseEvent) => {
  if (!currentModalDiv.value) return

  if (currentModalDiv.value !== e.target) {
    isWaitMouseDownOnModal = false
    return
  }

  if (isWaitMouseDownOnModal) closeModal()
}

watch(
  () => isModalActive.value,
  (newVal) => {
    if (newVal) {
      lockBody()
      nextTick(() => {
        if (isModalActive.value) emit('opened')
      })
    } else {
      unlockBody()
    }
  },
)
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: var(--z-index-modal);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: var(--modal-background);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s $ease;
  will-change: opacity;

  &__wrapper {
    width: 100%;
    max-height: 100%;
    position: relative;
    transition: transform 0.25s $ease;
    will-change: transform;
  }

  &__content {
    width: 100%;
    background: var(--modal-body-background);
    box-shadow: var(--box-shadow-large);
    overflow-y: auto;
    min-height: 1px;
    overflow-y: visible;
    padding: 36px;
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 1px 2px;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 36px;
    width: 100%;
    background: var(--color-background);
    border-top: 1px solid var(--color-border);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &__actions-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &._center {
    padding: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .modal {
      &__wrapper {
        transform: translate(0, 24px);
      }

      &__content {
        border-radius: 5px;
      }
    }
  }

  &._normal {
    .modal {
      &__wrapper {
        max-width: 600px;
      }
    }
  }

  &._large {
    .modal {
      &__wrapper {
        max-width: 832px;
      }
    }
  }

  &._x-large {
    .modal {
      &__wrapper {
        max-width: 968px;
      }

      &__content {
        padding: 48px 48px;
      }
    }
  }

  &._aside {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    .modal {
      &__wrapper {
        max-width: 516px;
        transform: translate(100%, 0);
      }
    }
  }

  &._fill {
    .modal {
      &__wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      &__content {
        display: flex;
        flex-direction: column;
      }
    }
  }

  &._no-padding {
    .modal__content {
      padding: 0;
    }
  }

  &._no-scrolling {
    .modal__content {
      overflow-y: hidden;
    }
  }

  &._active {
    pointer-events: all;
    opacity: 1;

    .modal__wrapper {
      transform: none;
    }
  }

  &._form {
    .modal__wrapper {
      border-radius: 5px;
    }

    &._normal .modal__wrapper {
      width: 600px;
    }

    .modal__content {
      border-radius: 5px 5px 0 0;
    }
  }
}

@include r($md) {
  .modal {
    &._large {
      .modal {
        &__content {
          padding: 24px;
        }
      }
    }

    &._no-padding {
      .modal__content {
        padding: 0;
      }
    }
  }
}

@include r($sm) {
  .modal {
    // центрированные модальные в мобильной версии
    // normal прибиты к низу
    // large и x_large растянуты на 100% высоты
    &._center {
      padding: 0;

      .modal {
        &__content {
          border-radius: var(--card-border-radius-sm);
        }
      }

      &._normal {
        .modal {
          &__wrapper {
            max-width: 100%;
          }

          &__content {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }

      &._large,
      &._x-large {
        .modal {
          &__wrapper {
            height: 100%;
          }

          &__content {
            border-radius: 0;
          }
        }
      }
    }
  }
}
</style>
