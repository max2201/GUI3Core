<template>
  <div ref="boundaryElement" class="detail-field">
    <VDropdown
      v-if="field.Value"
      class="detail-field__dropdown"
      :disabled="!field.Detailing"
      placement="right-start"
      :container="boundaryElement"
      :distance="0"
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
  :deep(.v-popper__popper.v-popper__popper--shown) {
    box-shadow: 5px 4px 20px 0px rgba(50, 81, 117, 0.35);
  }
  :deep(.v-popper--theme-dropdown .v-popper__inner) {
    border: none;
    border-radius: 0px;
  }
  .v-popper--shown {
    background: v-bind('fieldColors.background');
    color: #23282f;
  }
  &__measure {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 20px 24px;
    cursor: pointer;
    color: var(--color-font-invert);
    background-color: v-bind('fieldColors.color');

    &-title {
      font-family: Inter;
      font-size: 16px;
      line-height: 20.8px;
      padding-right: 20px;
    }

    &-value {
      font-family: Inter;
      font-size: 32px;
      font-weight: 600;
      line-height: 38.4px;
      display: flex;

      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-color: var(--color-text);
      text-decoration-thickness: 1px;
      &:deep(.svg-icon) {
        color: var(--color-font-invert) !important;
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

<style lang="scss" scoped>
.total {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  color: var(--color-font-invert);
  background-color: v-bind('fieldColors.color');

  &-title {
    font-family: Inter;
    font-size: 16px;
    line-height: 20.8px;
    padding-right: 20px;
  }

  &-value {
    font-family: Inter;
    font-size: 32px;
    font-weight: 600;
    line-height: 38.4px;
  }
}
</style>
