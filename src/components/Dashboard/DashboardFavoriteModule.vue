<template>
  <div
    :class="[
      'favorite-module',
      {
        'favorite-module_no-background': value.backgroundColor.toLowerCase() === '#ffffff',
      },
    ]"
  >
    <div class="favorite-module__wrapper">
      <div class="favorite-module__icon">
        <SvgIcon :name="value.icon" />
      </div>
      <span class="favorite-module__title">{{ value.title }}</span>
      <span class="favorite-module__subtitle">{{ value.subtitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardFavoritiesModuleItem } from '@/core/interface/Dashboard'
import { hexToRgb } from '@/core/utils/Color'

const props = defineProps<{
  value: DashboardFavoritiesModuleItem
}>()

const backgroundRGB = computed(() => hexToRgb(props.value.backgroundColor))
const backgroundColorRGBA = computed(() => {
  if (!backgroundRGB.value) return ''

  return `rgba(${backgroundRGB.value.r}, ${backgroundRGB.value.g}, ${backgroundRGB.value.b}, .9)`
})
const backgroundHoverColorRGBA = computed(() => {
  if (!backgroundRGB.value) return ''

  return `rgba(${backgroundRGB.value.r}, ${backgroundRGB.value.g}, ${backgroundRGB.value.b}, .99)`
})

const iconBackground = computed(() => props.value.iconColor)
const iconColor = computed(() => {
  return props.value.backgroundColor.toLowerCase() === '#ffffff'
    ? 'var(--color-font)'
    : 'var(--color-font-invert)'
})
const iconBorder = computed(() => {
  return props.value.backgroundColor.toLowerCase() === '#ffffff'
    ? '1px solid var(--color-border)'
    : ''
})
</script>

<style scoped lang="scss">
.favorite-module {
  display: block;
  height: 115px;
  border-radius: 6px;
  padding: 16px 20px;
  overflow: hidden;
  background-color: v-bind(backgroundColorRGBA);
  transition: all 0.2s ease-out;

  &:hover {
    background-color: v-bind(backgroundHoverColorRGBA);
    cursor: pointer;
  }

  &_no-background {
    border: 1px solid var(--color-border);
  }

  &__wrapper {
    display: block;
    width: 100%;
  }

  &__title {
    display: block;
    margin-bottom: 6px;
    font-weight: var(--font-weight-600);
  }

  &__subtitle {
    display: block;
    font-weight: var(--font-weight-500);
    color: var(--color-gray);
  }
}

.favorite-module:hover .favorite-module__subtitle {
  color: var(--color-font);
}

.favorite-module__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-bottom: 12px;
  background-color: v-bind(iconBackground);
  border: v-bind(iconBorder);

  > svg {
    width: 24px;
    height: 24px;
    color: v-bind(iconColor);
  }
}
</style>
