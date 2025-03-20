<template>
  <div class="object-events-filters">
    <UiButton1
      v-for="(filterItem, index) in filtersMap"
      :key="index"
      :class="[
        'object-events-filters__filter',
        {
          'object-events-filters__filter--active': filters.includes(filterItem.type),
        },
      ]"
      :icon-left="filterItem.icon"
      theme="transparent"
      variant="outline"
      :icon-size="20"
      @click.stop.prevent="selectFilter(filterItem.type)"
    >
    </UiButton1>
  </div>
</template>

<script setup lang="ts">
import { toRaw, unref } from 'vue'
import { AggregatedEventType } from '@/core/constants/AggregatedEventType'

const props = defineProps<{
  filters: AggregatedEventType[]
}>()

const emit = defineEmits(['change'])

const filtersMap = [
  { type: AggregatedEventType.Message, icon: 'chat' },
  { type: AggregatedEventType.Call, icon: 'telephone' },
  { type: AggregatedEventType.Warning, icon: 'alert' },
  { type: AggregatedEventType.Change, icon: 'pencil' },
]

const selectFilter = (filter: AggregatedEventType) => {
  let newFilters = [...props.filters]
  const indexOfFilter = props.filters.findIndex((existFilter) => filter === existFilter)

  if (indexOfFilter > -1) {
    newFilters.splice(indexOfFilter, 1)
  } else {
    newFilters.push(filter)
  }

  emit('change', unref(toRaw(newFilters)))
}
</script>

<style lang="scss" scoped>
.object-events-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min-content;
  gap: 4px;

  &__filter {
    border-color: var(--color-border);
    background: var(--component-background);

    &:hover,
    &:focus {
      border-color: var(--color-primary);
    }

    &--active {
      background-color: var(--color-primary-selected);
      border-color: var(--color-primary-hover);
    }
  }
}
</style>
