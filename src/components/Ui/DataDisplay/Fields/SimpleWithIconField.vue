<template>
  <div class="simple-with-icon-field">
    <h4 :title="field.Title" class="simple-with-icon-field__title">
      {{ field.Title }}
    </h4>
    <div class="simple-with-icon-field__content">
      <SvgIcon
        :width="20"
        :height="20"
        class="simple-with-icon-field__detailing"
        :name="field.Detailing"
      ></SvgIcon>
      <span :title="field.Value" class="simple-with-icon-field__value">
        {{ field.Value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'

const props = defineProps<{
  field: LiteViewBlockField
}>()

const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field!.SystemColor as SystemColorsValue)
  return {
    value: currentColor?.primary,
  }
})
</script>

<style scoped lang="scss">
.simple-with-icon-field {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;

  &__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #8990a2;
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
  }

  &__content {
    overflow: hidden;
    display: flex;
    gap: 3px;
    align-items: center;
  }

  &__detailing {
    color: #d5dde3;
  }

  &__value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: Inter;
    font-size: 24px;
    font-weight: 500;
    line-height: 31.2px;
    color: v-bind('fieldColors.value');
  }
}
</style>
