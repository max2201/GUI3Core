<template>
  <DashboardWidgetGroup class="fav-objects">
    <template #title>
      <h3 class="fav-objects__title">
        <SvgIcon name="star" class="fav-objects__title__star mr-2" />
        Избранное
        <span class="element-pill">{{ objectItems.length }}</span>
      </h3>
    </template>
    <template #actions>
      <span></span>
    </template>

    <div class="fav-objects__items">
      <ObjectPanel
        v-for="objectItem in objectItems"
        :key="objectItem.key"
        :title="objectItem.title"
        :badge-color="objectItem.badgeColor"
        show-close
        class="mb-1"
        @click="() => handleOpenFavObject(objectItem.object)"
        @close="() => handleDeleteFavObject(objectItem.object)"
      />
      <div v-if="!objects.length" class="fav-objects__items__empty">
        <img src="@/assets/img/empty.png" alt="" />
        <span
          >Вы пока ничего не добавили в избранное.<br />Используйте звездочку рядом c нaзвaниeм
          карточек</span
        >
      </div>
    </div>
  </DashboardWidgetGroup>
</template>

<script setup lang="ts">
import type { FavoriteObject } from '@/core/interface/Auth'
import { GetObjectDto } from '@/core/api/object.api'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { createObjectInstance } from '@/core/services/createObjectInstance'

const props = defineProps<{
  objects: FavoriteObject[]
}>()

const configurationStore = useConfigurationStore()
const { BaseObjectsColors } = storeToRefs(configurationStore)

const objectItems = computed(() => {
  return props.objects.map((object) => ({
    key: object.Object.Id,
    title: `${object.Object.Id}. ${object.Object.BaseObjectName}`,
    badgeColor: BaseObjectsColors.value[object.Object.BaseObjectType],
    object,
  }))
})

const dashboardStore = useDashboardStore()
const handleDeleteFavObject = (object: FavoriteObject) => {
  dashboardStore.removeObjectFromFavorites(object.ModuleId, object.Object.Id)
}

const sharedModals = useSharedModalsStore()
const windowStore = useWindowStore()

const handleOpenFavObject = async (object: FavoriteObject) => {
  const objectModel = createObjectInstance(object.Object.Id, object.Object.BaseObjectType)

  windowStore.addTab({
    id: objectModel.id,
    title: `${object.Object.BaseObjectName}`,
    type: objectModel.type,
    data: objectModel.rawData,
    object: objectModel,
  })
}
</script>

<style scoped lang="scss">
.fav-objects {
  height: 100%;
  overflow: hidden;

  &__title {
    display: flex;
    align-items: center;
    height: 32px;
    user-select: none;

    &__star {
      width: 24px;
      height: 24px;

      &:hover {
        cursor: default;
      }
    }
  }

  &__items {
    display: block;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 50px;
    &::-webkit-scrollbar {
      background-color: var(--component-background) !important;
    }

    &::-webkit-scrollbar-track {
      background: var(--component-background) !important;
    }

    &::-webkit-scrollbar-thumb {
      border-color: var(--component-background) !important;
    }

    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-16);
      line-height: 150%;
      color: var(--color-font-disabled);

      > span {
        margin-top: -30px;
        text-align: center;
      }
    }
  }
}
</style>
