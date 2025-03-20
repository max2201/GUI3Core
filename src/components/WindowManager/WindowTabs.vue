<template>
  <UiInfinityTabs
    :tabs="mappedTabs"
    :active-tab-id="activeTabId"
    :stop-click-ouside-class="stopClickOusideClass"
    :stop-click-outside-dropdown="stopClickOutsideDropdown"
    @tab-click="onDropdownItemClick"
    @close-tab="onCloseTab"
    @add-to-favorites="addObjectToFavorites"
  />
</template>

<script setup lang="ts">
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import type { InfinityTabsItem } from '@/core/interface/InfinityTabsItem'
import type { IObjectDto } from '@/core/interface/Object'
import type { IWindowTab } from '@/core/interface/Window'
import { ReleaseObject } from '@/core/api/locking.api'

const stopClickOusideClass = StopClickOutsideClasses.windowManager
const stopClickOutsideDropdown = 'stop-click-outside-dropdown-in-window'

const dialogStore = useWindowStore()
const { tabs, activeTabId } = storeToRefs(dialogStore)

const mappedTabs = computed<InfinityTabsItem[]>(() => {
  return tabs.value.map((tab) => {
    return {
      ...tab,
      isFavorite: isFavorite(tab),
      showStar: true,
      closable: true,
      color: tab.color || '#000000',
    }
  })
})

const onDropdownItemClick = (tab: InfinityTabsItem) => {
  dialogStore.showTab(tab.id)
}

const onCloseTab = (tab: InfinityTabsItem) => {
  tab.object.release()
  dialogStore.removeTab(tab.id)
}

const dashboardStore = useDashboardStore()
const { favoriteObjects } = storeToRefs(dashboardStore)
const moduleStore = useModuleStore()
const { currentModuleId } = storeToRefs(moduleStore)

const isFavorite = (tab: IWindowTab) => {
  return Boolean(
    favoriteObjects.value.find((favObject) => favObject.Object.Id === tab.data?.BaseObjectId)
  )
}

const addObjectToFavorites = (tab: InfinityTabsItem) => {
  console.log('asdadsadada')
  const favObject = favoriteObjects.value.find(
    (favObject) => favObject.Object.Id === tab.data?.BaseObjectId
  )

  if (favObject) {
    dashboardStore.removeObjectFromFavorites(favObject.ModuleId, favObject.Object.Id)
  } else {
    dashboardStore.addObjectToFavorites(
      currentModuleId.value,
      tab.object.getCurrentState() as IObjectDto
    )
  }
}
</script>

<style lang="scss" scoped>
:deep(.dropdown-component) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > .dropdown-component__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
