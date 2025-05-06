<template>
  <div class="row fields">
    <div class="col" v-for="(field, index) in filter.PrimaryFields" :key="field.id">
      <UiFormField
        v-if="field.type === FilterFieldTypes.CheckBox"
        :id="field.id"
        separate-label
        :has-modified="field.currentVal !== field.defaultVal"
      >
        <FilterField
          :field="field"
          is-primary-field
          @on-change="onChangeFilterValue(index, true, $event)"
          @on-change-subitems="onChangeFilterSubitemsValue(index, true, $event)"
        />
      </UiFormField>
      <FilterField
        v-else
        :field="field"
        is-primary-field
        @on-change="onChangeFilterValue(index, true, $event)"
        @on-change-subitems="onChangeFilterSubitemsValue(index, true, $event)"
      />
    </div>
  </div>

  <div class="row fields" v-if="showAdditionalFields">
    <div v-for="(field, index) in filter.SecondaryFields" :key="field.id" class="col">
      <UiFormField
        v-if="field.type === FilterFieldTypes.CheckBox"
        :id="field.id"
        separate-label
        :has-modified="field.currentVal !== field.defaultVal"
      >
        <FilterField
          :field="field"
          is-secondary-field
          @on-change="onChangeFilterValue(index, false, $event)"
          @on-change-subitems="onChangeFilterSubitemsValue(index, false, $event)"
        />
      </UiFormField>
      <FilterField
        v-else
        :field="field"
        is-secondary-field
        @on-change="onChangeFilterValue(index, false, $event)"
        @on-change-subitems="onChangeFilterSubitemsValue(index, false, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterFieldTypes, type IModuleFilter } from '@/core/interface/Auth'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  filter: IModuleFilter
  showAdditionalFields?: boolean
}>()

const moduleStore = useModuleStore()
const { moduleFilter } = storeToRefs(moduleStore)

const emit = defineEmits(['update-filter-values'])

const onChangeFilterValue = (filterKey: number, isPrimary: boolean, value: any) => {
  if (moduleFilter.value) {
    if (isPrimary) {
      moduleFilter.value.PrimaryFields[filterKey].currentVal = value
      return
    }

    moduleFilter.value.SecondaryFields[filterKey].currentVal = value
  } else {
    const result = cloneDeep(props.filter)
    result[isPrimary ? 'PrimaryFields' : 'SecondaryFields'][filterKey].currentVal = value
    emit('update-filter-values', result)
  }
}
const onChangeFilterSubitemsValue = (filterKey: number, isPrimary: boolean, value: any) => {
  if (moduleFilter.value) {
    if (isPrimary) {
      moduleFilter.value.PrimaryFields[filterKey].subItems = value.subItems
      return
    }

    moduleFilter.value.SecondaryFields[filterKey].subItems = value.subItems
  } else {
    const result = cloneDeep(props.filter)
    result[isPrimary ? 'PrimaryFields' : 'SecondaryFields'][filterKey].subItems = value.subItems
    emit('update-filter-values', result)
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
