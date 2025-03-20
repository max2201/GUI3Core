<template>
  <div class="statistic-panel">
    <div class="statistic-panel__label">{{ panel.Title }}</div>
    <div class="statistic-panel__value">
      {{ panel.Value }}
      <div
        v-if="panel.Detailing"
        :class="[
          'statistic-panel__percents',
          `system-color-${panel.SystemColor}`,
          `system-border-color-${panel.SystemColor}`,
          `system-background-color-with-alpha-${panel.SystemColor}`,
        ]"
      >
        {{ panel.Detailing }}
      </div>
    </div>
    <div :class="['statistic-panel__mark', `system-background-color-${panel.SystemColor}`]" />
  </div>
</template>

<script setup lang="ts">
import type { StatisticPanel } from '@/core/interface/Requests'

const props = defineProps<{
  panel: StatisticPanel
}>()
</script>

<style lang="scss">
.statistic-panel {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 17px 31px;
  padding-left: 18px;
}
.statistic-panel__label {
  font-size: var(--font-size-14);
  color: var(--color-gray);
}
.statistic-panel__value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-24);
  white-space: nowrap;
}
.statistic-panel__percents {
  border-radius: 40px;
  border-width: 1px;
  border-style: solid;
  font-size: var(--font-size-16);
  width: min-content;
  padding: 1px 8px;
}
.statistic-panel__mark {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: var(--color-border);
}
</style>
