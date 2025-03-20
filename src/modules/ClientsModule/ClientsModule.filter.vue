<template>
  <div class="filter" v-if="fields">
    <div class="row">
      <!-- <FilterTemplates class="col filter__col" />
      <FilterScope class="col filter__col" /> -->

      <!-- col -->
      <div class="col filter__col">
        <FilterFields :fields="fields" />

        <!-- actions -->
        <FilterActions :showAdditional="!!fields.SecondaryFields.length" class="filter__actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IModuleFilter } from '@/core/interface/Auth'

const props = defineProps<{ fields?: IModuleFilter | null }>()
</script>

<style lang="scss" scoped>
.filter {
  padding: 24px 30px 20px;
  &__section-title {
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-14);
    line-height: 1.3;
    color: var(--color-font-2);
  }
  &__col {
    position: relative;
    flex: 1 1 auto;
    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      background: var(--color-border);
    }
    &:last-child::after {
      display: none;
    }
  }
}
</style>
