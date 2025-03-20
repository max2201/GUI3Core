<template>
  <div class="row fields">
    <div class="col" v-for="(field, index) in filter.PrimaryFields" :key="field.id">
      <FilterField
        :field="field"
        is-primary-field
        @on-change="onChangeFilterValue(index, true, $event)"
      />
    </div>
  </div>

  <div class="row fields" v-if="showAdditionalFields">
    <div v-for="(field, index) in filter.SecondaryFields" :key="field.id" class="col">
      <FilterField
        :field="field"
        is-secondary-field
        @on-change="onChangeFilterValue(index, false, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IModuleFilter } from '@/core/interface/Auth'

const props = defineProps<{
  filter: IModuleFilter
  showAdditionalFields?: boolean
}>()

const moduleStore = useModuleStore()
const { moduleFilter } = storeToRefs(moduleStore)

const onChangeFilterValue = (filterKey: number, isPrimary: boolean, value: any) => {
  if (moduleFilter.value) {
    if (isPrimary) {
      moduleFilter.value.PrimaryFields[filterKey].currentVal = value
      return
    }

    moduleFilter.value.SecondaryFields[filterKey].currentVal = value
  }
}
</script>

<style lang="scss" scoped>
.fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .col {
    flex: 1 1 auto;
    margin-bottom: 12px;

    .ui-checkbox {
      margin-top: 22px;
    }
  }
}
</style>
