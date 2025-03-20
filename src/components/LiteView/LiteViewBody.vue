<template>
  <div
    :style="{
      'grid-template-columns': `repeat(${liteViewBlocks.length}, ${LiteViewBlockWidth}px)`,
      'grid-gap': `0 ${LiteViewBlocksGap}px`,
    }"
    class="lite-view__body pb-6 pt-6 pl-5 pr-5"
  >
    <div
      v-for="block in liteViewBlocks"
      :key="`block-${block.Code}`"
      class="lite-view__body__block"
    >
      <h3 class="mb-4">
        {{ block.Title }}
      </h3>

      <LiteViewField v-for="field in block.Fields" :key="`field-${field.Code}`" :field="field" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockGroup } from '@/core/interface/Object'
import { LiteViewBlockWidth, LiteViewBlocksGap } from './constants'

const props = defineProps<{
  liteViewBlocks: LiteViewBlockGroup[]
}>()
</script>

<style scoped lang="scss">
.lite-view__body {
  display: grid;
  grid-template-rows: auto;
  overflow: hidden;
}

.lite-view__body__block {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
