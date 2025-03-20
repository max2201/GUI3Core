<template>
  <div
    :class="[
      'object-flag',
      {
        'object-flag_passive': passive,
      },
    ]"
  >
    <span
      class="object-flag__point"
      :style="[
        {
          'background-color': flag.Color,
          'border-color':
            flag.Color.toLowerCase() === '#ffffff' || !flag.Color ? 'var(--color-gray)' : undefined,
        },
      ]"
    />

    <span class="object-flag__title">
      {{ flag.Title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { IObjectFlag } from '@/core/interface/Object'

const props = defineProps<{
  flag: IObjectFlag
  passive?: boolean
}>()
</script>

<style lang="scss">
.object-flag {
  &__point {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: white;
    margin-right: 5px;
    border: 1px solid transparent;
  }

  &__title {
    padding: 2px 0;
  }

  &:hover:not(.object-flag_passive) {
    cursor: pointer;

    .object-flag__title {
      color: var(--color-primary);
    }
  }
}

.object-flag:not(.object-flag_passive) .object-flag__title {
  border-bottom: 1px dashed var(--color-font);
}
</style>
