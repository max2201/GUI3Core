<template>
  <div
    class="simple-view-field"
    :class="[
      field.SystemColor !== -1 && `system-background-color-${field.SystemColor}`,
      {
        'simple-view-field--ignore-state': ignoreState,
      },
    ]"
  >
    <span :title="field.Title" class="simple-view-field__title">{{ field.Title }}</span>
    <div class="simple-view-field__value-wrapper">
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
        class="simple-view-field__value"
        @contextmenu.stop.prevent="onValueRightClick"
      >
        <slot name="value" :fieldValue="field.Value">
          {{ field.Value }}
        </slot>
      </span>
      <slot name="action"></slot>
    </div>
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
.simple-view-field {
  display: grid;
  grid-template-columns: 134px auto;
  gap: 8px;
  align-items: center;
  padding: 6.5px 6px;
  border-radius: 5px;

  &__title {
    color: var(--color-gray);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__value {
    color: var(--color-font);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__value-wrapper {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &_ignore-state {
    background-color: transparent !important;

    .simple-view-field__title {
      color: var(--color-gray) !important;
    }

    .simple-view-field__value {
      color: var(--color-font) !important;
      font-weight: var(--font-weight-500);
    }
  }
}
</style>
