<template>
  <div class="leader">
    <div class="leader-title">
      {{ field.Title }}
    </div>
    <div class="leader-value">
      {{ field.Value }}
    </div>
    <div class="leader-detailing">
      {{ field.Detailing }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { type DetailingBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'

const props = defineProps<{
  field: DetailingBlockField
}>()
const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field.SystemColor as SystemColorsValue)
  return {
    background: currentColor?.secondary || '',
    color: currentColor?.primary || '',
  }
})
</script>
<style lang="scss" scoped>
.leader {
  justify-content: space-between;
  padding: 20px 24px;
  background-color: v-bind('fieldColors.background');
  border-bottom: 1px solid var(--color-border);

  &-title {
    font-size: 14px;
    line-height: 16.8px;
    color: var(--color-gray);
    padding-bottom: 10px;
  }

  &-value {
    font-size: 18px;
    font-weight: 500;
    line-height: 23.4px;
  }
}
</style>
