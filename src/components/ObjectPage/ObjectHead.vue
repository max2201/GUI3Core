<template>
  <div class="head" v-if="activeTab">
    <div class="head__actions">
      <UiButton1 variant="text" @click="handleToogleStar">
        <UiFavoriteStarIcon :active="isFavorite" />
      </UiButton1>
    </div>
    <div class="head__title">{{ activeTab?.title }}</div>
    <UiButton1
      class="head__events-button"
      square
      custom-color="#f0f5f9"
      size="large"
      @click="onClickEvents()"
      theme="transparent"
    >
      Показать события
      <template #append>
        <ObjectEventsFilters :filters="[]" @change="onClickEvents" />
      </template>
    </UiButton1>
  </div>
</template>

<script setup lang="ts">
import type { FavoriteObject } from '@/core/interface/Auth'
import { useObjectEventListStore } from '@/core/store/objectEventList.store'

const dialogStore = useWindowStore()
const { activeTab, isOpened } = storeToRefs(dialogStore)

const dashboardStore = useDashboardStore()
const { favoriteObjects } = storeToRefs(dashboardStore)

const moduleStore = useModuleStore()
const { currentModuleId } = storeToRefs(moduleStore)

const isFavorite = computed(() => {
  if (!activeTab.value) return false

  return Boolean(
    favoriteObjects.value.find((favObject) => favObject.Object.Id === activeTab.value.id),
  )
})

const handleToogleStar = () => {
  if (isFavorite.value) {
    const favObject = favoriteObjects.value.find(
      (favObject) => favObject.Object.Id === activeTab.value.id,
    ) as FavoriteObject

    dashboardStore.removeObjectFromFavorites(favObject.ModuleId, favObject.Object.Id)
  } else {
    dashboardStore.addObjectToFavorites(
      currentModuleId.value,
      activeTab.value?.object.getCurrentState(),
    )
  }
}

const objectEventListStore = useObjectEventListStore()

watch(
  () => isOpened.value,
  (value: boolean) => {
    if (!value) {
      objectEventListStore.closeObjectEventsList()
    }
  },
)

watch(
  () => activeTab.value,
  (value) => {
    objectEventListStore.closeObjectEventsList()
  },
)

const onClickEvents = (filters = []) => {
  if (!activeTab.value) return

  const id = activeTab.value.id
  const type = activeTab.value.type

  if (!id || !type || id < 0) return

  objectEventListStore.setSelectedObjectID(id, type, filters)
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-border);

  > div {
    padding: 8px 15px;
  }

  &__actions {
    margin-right: 15px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  &__title {
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-16);
    line-height: 1.3;
    display: flex;
    margin-right: auto;
  }

  &__events-button {
    border-left: 1px solid var(--color-border);
    color: var(--color-font) !important;
    font-weight: var(--font-weight-400);
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
