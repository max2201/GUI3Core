<template>
  <div v-if="value" class="detail">
    <div class="detail__title">{{ value.Title }}</div>
    <div
      :class="[
        'detail__value',
        {
          detail__value_bold: value.IsBold,
        },
      ]"
    >
      <span
        v-if="value.Value && dotColor"
        :class="[
          'detail__dot-color',
          value.SystemColor !== -1 && `system-background-color-${value.SystemColor}`,
        ]"
        :style="{
          'background-color': value.CustomColor,
          border:
            value.CustomColor?.toLocaleLowerCase() === '#ffffff' ? '1px solid black' : undefined,
        }"
      ></span>
      {{ value.Value || '-' }}
    </div>
    <div class="detail__description" v-if="false"></div>
  </div>
</template>

<script setup lang="ts">
import type { CardViewCellProps } from '@/core/interface/Module'

const props = defineProps<{
  value: CardViewCellProps
}>()

const dotColor = computed(() => {
  return props.value.CustomColor || (props.value.SystemColor && props.value.SystemColor !== -1)
})
</script>

<style lang="scss" scoped>
.detail {
  min-height: 40px;
  min-width: 120px;

  & + & {
    margin-top: 20px;
  }

  &__title {
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-14);
    line-height: 1.3;
    color: var(--color-gray);
  }

  &__value {
    margin-top: 8px;
    color: var(--color-font);

    &_value {
      font-weight: var(--font-weight-600);
    }
  }

  &__description {
    margin-top: 4px;
  }

  &__dot-color {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-right: 6px;
  }
}
</style>
