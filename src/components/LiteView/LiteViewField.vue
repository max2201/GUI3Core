<template>
  <div
    class="lite-view__field pt-1 pb-1 pl-2 pr-2"
    :class="[
      field.SystemColor !== -1 && `system-background-color-with-alpha-${field.SystemColor}`,
      {
        'lite-view__field_ignore-state': ignoreState,
      },
    ]"
  >
    <span :title="field.Title" class="lite-view__field__title">{{ field.Title }}</span>
    <span
      :class="[
        field.SystemColor !== -1 && `system-color-${field.SystemColor}`,
        field.IsBold && 'fw-600',
      ]"
      :style="[
        {
          width: valueWidth ? `${valueWidth}px` : undefined,
        },
      ]"
      :title="field.Value"
      class="lite-view__field__value"
      @contextmenu.stop.prevent="onValueRightClick"
    >
      {{ field.Value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockField } from '@/core/interface/Object'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  field: LiteViewBlockField
  ignoreState?: boolean
  valueWidth?: number
}>()

const toast = useToast()

const onValueRightClick = () => {
  const textarea = document.createElement('textarea')
  textarea.value = props.field.Value
  document.body.appendChild(textarea)
  textarea.select()
  textarea.focus() // It's necessary for case when you try copy to buffer from code when page have modal with focus
  document.execCommand('copy')
  document.body.removeChild(textarea)
  toast.success('Скопировано')
}
</script>

<style scoped lang="scss">
.lite-view__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;

  &__title {
    width: 162px;
    color: var(--color-gray);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__value {
    width: 200px;
    color: var(--color-font);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &_ignore-state {
    background-color: transparent !important;

    .lite-view__field__title {
      color: var(--color-gray) !important;
    }

    .lite-view__field__value {
      color: var(--color-font) !important;
      font-weight: var(--font-weight-500);
    }
  }
}
</style>
