<template>
  <div v-if="flags" class="object-flags" :class="[{ 'object-flags_empty': !flags.length }]">
    <UiButton1
      class="object-flags__plus"
      @click="handleClickAddFlag"
      icon-left="plus-circle"
      variant="text"
      :icon-size="24"
      ><span v-if="!flags.length"> Добавить флаг </span></UiButton1
    >

    <div class="object-flags__wrapper">
      <ObjectFlag
        v-for="(flag, index) in flags"
        :key="index"
        :flag="flag"
        @click="() => handleClickAddFlag()"
      />
    </div>

    <NewFlagModal :object="object" />
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import type { IObjectFlag } from '@/core/interface/Object'
import { AddModalName } from '@/core/constants/ModalsNames'

const sharedModals = useSharedModalsStore()

const props = defineProps<{
  object: IObjectDto
}>()

const flags = computed<IObjectFlag[] | null>((): IObjectFlag[] => {
  const itemFlags = props.object?.Flags

  if (!itemFlags) return null

  return itemFlags
})

const handleClickAddFlag = () => {
  sharedModals.setModal({
    name: AddModalName,
  })
}
</script>

<style lang="scss" scoped>
.object-flags {
  display: grid;
  grid-template-columns: 24px auto;
  grid-gap: 10px;
  padding: 10px 15px;

  &_empty {
    grid-template-columns: 200px auto;
  }

  &__plus {
    font-weight: var(--font-weight-400) !important;

    &:not(:hover) {
      .ui-button__text {
        color: var(--color-font) !important;
      }
    }
  }

  .window-flags__plus .svg-icon {
    width: 24px;
    height: 24px;
    color: var(--color-primary);
  }

  &__wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px 40px;
  }
}
</style>
