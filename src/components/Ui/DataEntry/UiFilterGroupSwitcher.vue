<template>
  <div class="filter-group-switcher">
    <UiButton1
      class="filter-group-switcher__button"
      :class="{ 'filter-group-switcher__button--selected': selectedButton === button.id }"
      v-for="(button, key) in buttons"
      :key="`${button.id}${key}`"
      :theme="button.theme ?? 'transparent'"
      :variant="button.variant"
      :disabled="disabled || button.disabled"
      :icon-right="button.iconRight"
      :icon-left="button.iconLeft"
      :icon-size="button.iconSize"
      :size="size"
      :title="button.title"
      @click="onClickButton(button)"
    >
      <template #default v-if="button.label">{{ button.label }}</template>
    </UiButton1>
  </div>
</template>

<script setup lang="ts">
interface IButtonGroupSwicherItem {
  id: string | number
  label?: string
  title?: string
  theme?: string
  variant?: string
  disabled?: boolean
  iconRight?: string
  iconLeft?: string
  iconSize?: number
}

const props = defineProps<{
  buttons: IButtonGroupSwicherItem[]
  selectedButton: number
  size?: string
  disabled?: boolean
}>()

const emits = defineEmits(['select'])

const onClickButton = (button: IButtonGroupSwicherItem) => {
  emits('select', button.id)
}
</script>

<style lang="scss" scoped>
.filter-group-switcher {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1px;
  width: 100%;
  background: #f0f5f9;
  box-shadow: 0 1px 2px 0 #1b262f1f inset;
  border-radius: 5px;
  padding: 2px;

  &__button {
    color: #d5dde3 !important;

    &--selected {
      color: #8990a2 !important;
      background: #ffffff;
      box-shadow: 0 1px 4px 0 #061c2829;
    }
  }
}
</style>
