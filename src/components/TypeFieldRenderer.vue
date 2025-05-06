<template>
  <Component
    :key="`field-${field.Code}`"
    :is="getComponentForField(field.FieldType)"
    :field="field"
    v-bind="$attrs"
  ></Component>
</template>
<script setup lang="ts">
import { type DetailingBlockField, ViewFieldTypes } from '@/core/interface/Object'
import SimpleViewField from '@c/Ui/DataDisplay/Fields/SimpleViewField.vue'
import SimpleWithTextDetailField from '@c/Ui/DataDisplay/Fields/SimpleWithTextDetailField.vue'
import FieldLeader from '@c/Ui/DataDisplay/Fields/FieldLeader.vue'
import TextPercentAndDetailMain from '@c/Ui/DataDisplay/Fields/TextPercentAndDetailMain.vue'
import TextPercentAndDetailAdditional from '@c/Ui/DataDisplay/Fields/TextPercentAndDetailAdditional.vue'
import SummaryInfoField from '@c/Ui/DataDisplay/Fields/SummaryInfoField.vue'
import SimpleWithIconField from '@c/Ui/DataDisplay/Fields/SimpleWithIconField.vue'
import ComplexPanel from '@c/Ui/DataDisplay/Fields/ComplexPanel.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  field: DetailingBlockField
  params?: any
}>()

const getComponentForField = (fieldType: ViewFieldTypes) => {
  switch (fieldType) {
    case ViewFieldTypes.SimpleView:
      return SimpleViewField
    case ViewFieldTypes.SimpleWithTextDetail:
      return SimpleWithTextDetailField
    case ViewFieldTypes.SummaryInfo:
      return SummaryInfoField
    case ViewFieldTypes.CommentLeader:
      return FieldLeader
    case ViewFieldTypes.TextPercentAndDetailMain:
      return TextPercentAndDetailMain
    case ViewFieldTypes.TextPercentAndDetailAdditional:
      return TextPercentAndDetailAdditional
    case ViewFieldTypes.SimpleWithIcon:
      return SimpleWithIconField
    case ViewFieldTypes.ComplexPanel:
      return ComplexPanel
    default:
      return SimpleViewField
  }
}
</script>
<style scoped lang="scss"></style>
