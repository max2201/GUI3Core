<template>
  <div v-if="card" class="object-param-card">
    <h3 class="object-param-card__label mb-3">{{ card.Title }}</h3>
    <div class="object-param-card__stats mb-2">
      <div v-for="field in card.Fields" :key="field.Code" class="object-param-card__stat">
        <div class="object-param-card__stat__label mb-1">{{ field.Title }}</div>
        <div class="object-param-card__stat__count">
          <SvgIcon :width="20" :height="20" name="text" /> {{ field.Value }}
        </div>
      </div>
    </div>
    <div v-if="false" class="object-param-card__info">
      <SvgIcon :width="11" :height="11" name="open-here" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientMetricGroup } from '@/core/interface/Requests'

const props = defineProps<{
  card: ClientMetricGroup
}>()
</script>

<style lang="scss">
.object-param-card {
  padding: 20px 16px;
  border: var(--border-default);
  border-radius: 5px;
  width: 175px;
  height: 145px;
}
.object-param-card__label {
}
.object-param-card__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}
.object-param-card__stat {
}
.object-param-card__stat__label {
  font-size: var(--font-size-14);
  color: var(--color-gray);
}
.object-param-card__stat__count {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: var(--font-size-24);
  gap: 3px;

  .svg-icon {
    color: var(--color-border);
  }
}
.object-param-card__info {
}
</style>
