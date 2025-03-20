<template>
  <div
    ref="wrapper"
    class="dropdown-component"
  >
    <div
      ref="trigger"
      :class="[
        'dropdown-component__trigger',
        { 'dropdown-component__trigger_active': isActive }
      ]"
      @click="clickOnTrigger"
    >
      <SvgIcon name="chevron-down" />
      <span v-if="counterValue" class="dropdown-component__trigger__counter">{{ counterValue }}</span>
    </div>

    <div
      ref="content"
      class="dropdown-component__content"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { createPopper } from '@popperjs/core'
import { onClickOutside } from '@vueuse/core'

const wrapper = ref<HTMLElement>()
const content = ref<HTMLElement>()
const trigger = ref<HTMLElement>()
const popperInstance = ref<any>()

const emit = defineEmits(['open', 'close'])

const isActive = ref(false)

const showContent = () => {
  content.value?.setAttribute('data-show', '');
  popperInstance.value?.update();
  isActive.value = true
  emit('open')
}

const hideContent = () => {
  content.value?.removeAttribute('data-show');
  isActive.value = false
  emit('close')
}

const clickOnTrigger = () => {
  if (_.isString(content.value?.getAttribute('data-show'))) {
    hideContent()
    return
  }

  showContent()
}

const props = defineProps<{
  stopCloseOutsideClass?: string
  counterValue?: string | number
}>()

onClickOutside(trigger, (event) => {
  if (props.stopCloseOutsideClass) {
    const target = event?.target as HTMLElement

    if (target && target.className && target.className?.includes?.(props.stopCloseOutsideClass)) {
      return
    }

    let parentElement = target.parentElement

    while (parentElement) {
      const classes = Array.from(parentElement.classList)

      if (classes.includes?.(props.stopCloseOutsideClass)) {
        return
      }

      parentElement = parentElement.parentElement
    }
  }

  hideContent()
})

onMounted(() => {
  if (!wrapper.value || !content.value || !trigger.value) return

  popperInstance.value = createPopper(
    trigger.value,
    content.value,
    {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
      ],
    }
  )
})
</script>

<style scoped lang="scss">
.dropdown-component {
  &__content {
    display: none;
    width: max-content;

    &[data-show] {
      display: block;
      box-shadow: 0px 4px 20px rgba(6, 28, 40, 0.22);
    }
  }

  &__trigger {
    position: relative;

    &:hover {
      color: var(--color-font);
    }

    &__counter {
      position: relative;
      top: -4px;
      font-size: 9px;
    }

    &_active {
      color: var(--color-font);

      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>