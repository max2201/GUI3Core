<template>
  <div class="ui-tag" @click="tagClickAction && tagClickAction()">
    <slot name="prepend">
      <SvgIcon
        v-if="iconBefore"
        :width="12"
        :height="12"
        :name="iconBefore"
        @click="iconBeforeAction && iconBeforeAction()"
      />
    </slot>
    <slot name="label">
      <span class="ui-tag__title">
        <slot> {{ label }} </slot>
      </span>
    </slot>
    <slot name="append">
      <SvgIcon
        class="ui-tag__icon"
        :class="{ 'ui-tag__icon--close': iconAfter === 'close' }"
        v-if="iconAfter"
        :width="12"
        :height="12"
        :name="iconAfter"
        @click="iconAfterAction && iconAfterAction()"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  label?: string
  iconBefore?: string
  iconBeforeAction?: Function
  iconAfter?: string
  iconAfterAction?: Function
  tagClickAction?: Function
  variant?: string
}>()
</script>

<style lang="scss">
.ui-tag {
  $this: &;

  cursor: pointer;
  background: #e3ebf1;
  border: 1px solid #d5dde3;
  border-radius: 20px;
  padding: 1px 3px 1px 7px;
  display: flex;
  align-items: center;
  gap: 2px;

  &__title {
    white-space: nowrap;
    font-family: Inter;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #23282f;
  }

  &__icon {
    &--close {
      color: #8990a2;
    }
  }

  &:hover {
    #{$this}__icon {
      &--close {
        color: #1A8FF2;
      }
    }
  }
}
</style>
