<template>
  <div ref="boundaryElement" class="simple-with-text-detail-field">
    <div
      v-if="field.SystemColor && field.SystemColor >= 0"
      class="simple-with-text-detail-field__title-color"
    ></div>
    <span :title="field.Title" class="simple-with-text-detail-field__title-text">
      {{ field.Title }}
    </span>
    <VDropdown
      v-if="field.Value"
      class="simple-with-text-detail-field__value-wrapper"
      :disabled="!field.Detailing"
      :container="boundaryElement"
      :boundary="boundary || boundaryElement"
      :distance="0"
      :skidding="skidding"
      :placement="placement"
      :flip="flip"
    >
      <div class="simple-with-text-detail-field__value">
        <span
          class="simple-with-text-detail-field__value-text"
          :class="{
            'simple-with-text-detail-field__value-text--number': isValueNumber,
            'simple-with-text-detail-field__value-text--link': field.Detailing,
          }"
          :title="field.Value"
        >
          {{ field.Value }}</span
        >
        <SvgIcon
          v-if="field.Detailing"
          :width="11"
          :height="11"
          class="simple-with-text-detail-field__value-icon"
          name="open-here"
        />
      </div>
      <template v-if="field.Detailing" #popper>
        <div class="simple-with-text-detail-field__dropdown">
          <div class="simple-with-text-detail-field__dropdown-header">
            <span>{{ field.Title }}</span>
            <UiButton1 v-close-popper variant="text" icon-left="chevrons-right" :icon-size="24" />
          </div>
          <div class="simple-with-text-detail-field__dropdown-content">
            {{ field.Detailing }}
          </div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'

const props = withDefaults(
  defineProps<{
    field: LiteViewBlockField
    flip?: boolean
    placement?: string
    skidding?: number
    boundary?: string
  }>(),
  {
    flip: false,
    placement: 'bottom-start',
  },
)

const boundaryElement = ref<HTMLDivElement>()

const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field!.SystemColor as SystemColorsValue)

  return {
    background: currentColor?.secondary || '',
    color: currentColor?.primary || '',
    dropdown: currentColor?.primary || '',
    text: props.field?.SystemColor === SystemColorsValue.Danger ? currentColor?.primary || '' : '',
  }
})

// TODO: заменить на регулярку, скорее всего не всегда проценты будут
const isValueNumber = computed(() => {
  return props.field.Value.endsWith('%')
})
</script>

<style scoped lang="scss">
.simple-with-text-detail-field {
  display: grid;
  grid-template-columns: v-bind(
    'props.field.SystemColor && props.field.SystemColor >= 0 ? "min-content minmax(50%, 1fr) auto" : "minmax(50%, 1fr) auto"'
  );
  background: v-bind('fieldColors.background');
  align-items: center;
  padding: 3.5px 10px;
  border-radius: 5px;
  column-gap: 8px;
  position: relative;

  :deep(.v-popper__arrow-container) {
    display: none;
  }

  &__dropdown {
    display: flex;
    flex-direction: column;
    max-height: 300px;

    &-header {
      :deep(.svg-icon) {
        color: #ffffff !important;

        &:not(:hover) {
          color: #ffffff !important;
        }
      }

      display: flex;
      align-items: center;
      justify-content: space-between;
      background: v-bind('fieldColors.dropdown');
      padding: 9px 21px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
      line-height: 16.8px;
      color: #ffffff;
    }

    &-content {
      padding: 20px 24px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      line-height: 19.6px;
      text-align: left;
      color: #23282f;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  &__title {
    &-color {
      width: 12px;
      height: 12px;
      background: v-bind('fieldColors.color');
      border-radius: 3px;
      flex-shrink: 0;
    }

    &-text {
      color: #23282f;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      line-height: 16.8px;
    }
  }

  &__value-wrapper {
    display: flex;
    overflow: hidden;
    justify-content: right;
  }

  &__value {
    display: flex;
    color: var(--color-font);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    gap: 2px;

    &-text {
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
      line-height: 16.1px;
      color: #23282f;
      overflow: hidden;
      text-overflow: ellipsis;

      &--number {
        font-family: Inter;
        font-size: 20px;
        font-weight: 500;
        line-height: 23px;
        color: v-bind('fieldColors.text');
      }

      &--link {
        border-bottom: 1px dashed #23282f;
      }
    }

    &:hover {
      cursor: pointer;

      * {
        border-color: var(--color-primary);

        &.simple-with-text-detail-field__value-icon {
          color: var(--color-primary);
        }
      }
    }

    &-icon {
      flex-shrink: 0;
      color: var(--color-gray);
    }
  }
}
</style>
