<template>
  <div
    :class="[
      'favorite-module',
      {
        'favorite-module_no-background':
          !value.backgroundColor || value.backgroundColor.toLowerCase() === '#ffffff',
      },
    ]"
    :title="`${value.title}: ${value.subtitle}`"
  >
    <div class="favorite-module__wrapper">
      <div class="favorite-module__head">
        <div class="favorite-module__icon">
          <SvgIcon :name="value.icon" />
        </div>
        <div class="favorite-module__actions">
          <slot name="actions">
            <UiButton1
              title="Удалить из избранного"
              variant="text"
              theme="transparent"
              :icon-size="20"
              icon-left="bookmark-minus"
              @click.stop="removeModuleFromFavourite"
            ></UiButton1>
            <UiButton1
              v-if="value.hasTableData && !hideControls"
              style="transform: rotate(90deg)"
              title="Открыть табличные данные модуля"
              variant="text"
              theme="transparent"
              :icon-size="20"
              icon-left="maximize-square"
              @click.stop="openModuleTable"
            ></UiButton1>
          </slot>
        </div>
      </div>
      <div>
        <span class="favorite-module__title">{{ value.title }}</span>
        <span class="favorite-module__subtitle">{{ value.subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardFavoritiesModuleItem } from '@/core/interface/Dashboard'
import { hexToRgb } from '@/core/utils/Color'

const props = defineProps<{
  value: DashboardFavoritiesModuleItem
  hideControls?: boolean
}>()
const emit = defineEmits(['remove-module-from-favourite', 'open-module-table'])
const removeModuleFromFavourite = () => {
  emit('remove-module-from-favourite')
}
const openModuleTable = () => {
  emit('open-module-table')
}
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
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__head {
    display: flex;
    justify-content: space-between;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__title {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
    font-weight: var(--font-weight-600);
  }

  &__subtitle {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
