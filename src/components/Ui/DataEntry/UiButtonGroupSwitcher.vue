<template>
  <div class="button-group-switcher">
    <UiButton
      v-for="(button, key) in buttons"
      :key="button.id + key"
      :theme="button.theme ?? 'outline'"
      :disabled="button.disabled"
      :icon-right="button.iconRight"
      :icon-left="button.iconLeft"
      :size="size ?? 'medium-small'"
      :additonal-classes="selectedButton === button.id ? ['active'] : []"
      :style="{ width: 100 / buttons.length + '%' }"
      @click="onClickButton(button)"
    >
      {{ button.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
interface IButtonGroupSwicherItem {
  id: string | number
  label: string
  theme?: string
  disabled?: boolean
  iconRight?: string
  iconLeft?: string
}

const props = defineProps<{
  buttons: IButtonGroupSwicherItem[]
  selectedButton: number
  size?: string
}>()

const emits = defineEmits(['select'])

const onClickButton = (button: IButtonGroupSwicherItem) => {
  emits('select', button.id)
}
</script>

<style lang="scss" scoped>
.button-group-switcher {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;

  :deep(.button.outline) {
    color: var(--color-font);
    font-weight: var(--font-weight-400);
    border-radius: 0;
    border-color: var(--color-border);
    background-color: var(--color-font-invert);

    &:last-child {
      border-radius: 0 var(--button-border-radius) var(--button-border-radius) 0;
    }

    &:first-child {
      border-radius: var(--button-border-radius) 0 0 var(--button-border-radius);
    }

    &.active {
      background-color: var(--color-primary-selected);
      border-color: var(--color-bg-active);
    }
  }

  :deep(.button__content) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
