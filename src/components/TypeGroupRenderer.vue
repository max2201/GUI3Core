<template>
  <Component
    :key="`group-${group.Code}`"
    :is="getComponentForGroup(group?.GroupType)"
    :group="group"
    v-bind="$attrs"
  >
    <template #fields="slotProps">
      <slot name="fields" v-bind="slotProps"></slot>
    </template>
  </Component>
</template>
<script setup lang="ts">
import { GroupViewTypes } from '@/core/constants/GroupViewTypes'
import type { IBaseGroupType } from '@/core/interface/Object'
import PanelListGroup from '@c/Ui/DataDisplay/Groups/PanelListGroup.vue'
import DoublePanelListGroup from '@c/Ui/DataDisplay/Groups/DoublePanelListGroup.vue'
import SummaryInfoGroup from '@c/Ui/DataDisplay/Groups/SummaryInfoGroup.vue'
import NumbersGroup from '@c/Ui/DataDisplay/Groups/NumbersGroup.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  group: IBaseGroupType
  params?: any
}>()
const getComponentForGroup = (GroupType: GroupViewTypes) => {
  switch (GroupType) {
    case GroupViewTypes.PanelList:
      return PanelListGroup
    case GroupViewTypes.DoublePanelList:
      return DoublePanelListGroup
    case GroupViewTypes.SummaryInfo:
      return SummaryInfoGroup
    case GroupViewTypes.NumbersGroup:
      return NumbersGroup
    default:
      return PanelListGroup
  }
}
</script>
<style scoped lang="scss"></style>
