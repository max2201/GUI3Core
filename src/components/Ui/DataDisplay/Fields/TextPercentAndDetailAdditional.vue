// TODO: вынести VDropdown в обертку так же для TextPercentAndDetailMain
<template>
  <div ref="boundaryElement" class="detail-field">
    <VDropdown
      v-if="field.Value"
      class="detail-field__dropdown"
      :disabled="!field.Detailing"
      placement="right-start"
      :container="boundaryElement"
      :distance="0"
      :overflow-padding="0"
      :flip="false"
    >
      <div class="detail-field__measure">
        <div class="detail-field__measure-title">
          {{ field.Title }}
        </div>
        <div class="detail-field__measure-value">
          {{ field.Value }}

          <UiButton1
            v-if="field.Detailing"
            class="detail-field__value-icon"
            variant="text"
            icon-left="open-here"
            :icon-size="11"
          />
        </div>
      </div>
      <template v-if="field.Detailing" #popper>
        <div class="detail-field__detailing">
          <div class="detail-field__detailing-header">
            <div class="detail-field__detailing-title">{{ field.Title }}</div>
            <UiButton1
              v-close-popper
              class="detail-field__detailing-close-button"
              variant="text"
              icon-left="chevrons-left"
              :icon-size="24"
            />
          </div>
          <div class="detail-field__detailing-value">{{ field.Detailing }}</div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import { type DetailingBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import { computed, ref } from 'vue'

const props = defineProps<{
  field: DetailingBlockField
}>()

const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field!.SystemColor as SystemColorsValue)
  return {
    background: currentColor?.secondary || '',
    color: currentColor?.primary || '',
    dropdown: currentColor.primary,
    text: props.field?.SystemColor === SystemColorsValue.Danger ? currentColor?.primary || '' : '',
  }
})

const boundaryElement = ref<HTMLDivElement>()
</script>
<style lang="scss" scoped>
.detail-field {
  color: var(--color-font);

  :deep(.v-popper__arrow-container) {
    display: none;
  }

  .v-popper--shown {
    background: v-bind('fieldColors.background');
  }

  :deep(.v-popper__popper.v-popper__popper--shown) {
    box-shadow: 5px 4px 20px 0px rgba(50, 81, 117, 0.35);
  }

  :deep(.v-popper--theme-dropdown .v-popper__inner) {
    border: none;
    border-radius: 0px;
  }

  &__measure {
    display: flex;
    justify-content: space-between;
    padding: 20px 24px;
    cursor: pointer;
    position: relative;

    &:deep(.svg-icon) {
      color: var(--color-gray);
    }

    &:hover {
      background: v-bind('fieldColors.background');

      &:deep(.svg-icon) {
        color: var(--color-primary) !important;
      }
    }

    &-title {
      margin-left: 20px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 300;
      line-height: 16.8px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      position: relative;
      padding-right: 20px;
      width: 100%;

      &:before {
        content: '';
        position: absolute;
        left: -20px;
        width: 12px;
        height: 12px;
        border-radius: 4px;
        background: v-bind('fieldColors.color');
        margin-right: 10px;
      }
    }

    &-value {
      display: flex;
      font-family: Inter;
      font-size: 32px;
      font-weight: 500;
      line-height: 41.6px;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-color: var(--color-text);
      text-decoration-thickness: 1px;
      color: v-bind('fieldColors.text');

      &:deep(.svg-icon) {
        display: block !important;
      }
    }

    &__value-icon {
      margin-left: 8px;
    }
  }

  &__detailing {
    display: block;
    border: 1px solid var(--color-border);
    width: 300px;
    background-color: var(--color-font-invert);
    top: 0;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: v-bind('fieldColors.dropdown');
      padding: 9px 24px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
      line-height: 16.8px;
      color: #ffffff;

      &:deep(.svg-icon) {
        color: #ffffff !important;
        display: block !important;

        &:hover {
          color: #ffffff !important;
        }
      }
    }

    &-title {
      color: var(--color-font-invert);
      font-family: Inter;
      font-size: 14px;
      font-weight: 300;
    }

    &-value {
      padding: 20px 24px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      line-height: 19.6px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
  }
}
</style>
