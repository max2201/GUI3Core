<template>
  <div
    class="object-details"
    :style="[
      {
        'grid-template-columns': `repeat(${columnsCount}, minmax(180px, 300px))`,
      },
    ]"
  >
    <div v-for="(block, bindex) of details" :key="`block-${bindex}`" class="object-details__block">
      <div
        v-for="(field, findex) of block.Fields"
        :key="`field-${bindex}-${findex}`"
        class="object-details__field"
      >
        <CardViewCell v-if="field.Code === 'Client'" :value="getClientValue(field)" />
        <CardViewPhones
          v-else-if="field.FieldType === ViewFieldTypes.CallBackBlock && field.Code === 'Phones'"
          :phones="field.Value"
        />
        <CardViewCell
          v-else-if="Number.isInteger(field.FieldType) && SimpleViewTypes.includes(field.FieldType as any)"
          :value="field"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardViewCellProps } from '@/core/interface/Module'
import { ViewFieldTypes } from '@/core/interface/Object'

interface Field {
  Code: string
  FieldType: ViewFieldTypes
  ColSpan: number
  Title: string
  Value: any
  CustomColor: string
  SystemColor: number
  IsBold: boolean
}

interface FieldsBlock {
  Code: string
  Title: string
  Fields: Field[]
}

const SimpleViewTypes = [
  ViewFieldTypes.SimpleView,
  ViewFieldTypes.CallBackBlock,
  ViewFieldTypes.Comment,
  ViewFieldTypes.ClientView,
]

const props = defineProps<{
  details: FieldsBlock[]
}>()

const columnsCount = computed(() => {
  if (!props.details.length) {
    return 0
  }

  return props.details.length
})

const rowsCount = computed(() => {
  if (!props.details.length) {
    return 0
  }

  const blocksLength = props.details.map((block) => block.Fields.length)

  props.details.forEach((block, blockIndex) => {
    const fieldsWithColspan = block.Fields.filter((field) => field.ColSpan > 1)

    fieldsWithColspan.forEach((field) => {
      new Array(field.ColSpan - 1)
        .map((_, index) => index + 1 + blockIndex)
        .forEach((blockIndexForIncrease) => {
          if (blockIndexForIncrease > columnsCount.value) return

          blocksLength[blockIndexForIncrease]++
        })
    })
  })

  return Math.max(...blocksLength)
})

interface EnxtendedField {
  GroupNumber: number
  Code: string
  ColSpan: number
  FieldType?: ViewFieldTypes
  Title?: string
  Value?: any
  CustomColor?: string
  SystemColor?: number
  IsBold?: boolean
}

const EmptyFieldCode = 'Empty'

const getClientValue = (fieldValue: any): CardViewCellProps => {
  return {
    ...fieldValue,
    Title: 'ФИО клиента',
    Value: fieldValue.Value.BaseObjectName,
  }
}
</script>

<style lang="scss" scoped>
.object-details {
  display: grid;
  grid-gap: 16px 40px;

  &__block {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
