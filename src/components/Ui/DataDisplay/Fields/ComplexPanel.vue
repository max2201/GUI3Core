<template>
  <div ref="boundaryElement" class="complex-panel">
    <UiFieldInput
      :id="field.UiId"
      :key="field.Code"
      :complex-type="field.Value.ComplexType"
      :name="field.Code"
      :value="value"
      :label="field.Title"
      :is-required="field.IsRequired"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { type DetailingBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import { computed, ref } from 'vue'

const props = defineProps<{
  field: DetailingBlockField
}>()
const value = ref(null)
value.value = props.field.Value.ComplexValue
const boundaryElement = ref<HTMLDivElement>()
const onChange = (val: string) => {
  console.log(12)
  value.value = val
}
</script>

<style lang="scss" scoped></style>
