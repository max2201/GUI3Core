<template>
  <div class="dashboard">
    <div class="dashboard__fav-modules">
      <DashboardFavoriteModule
        v-for="favModule in favoriteModulesItems"
        :key="favModule.id"
        :value="favModule"
        @click="() => handleFavoriteModuleClick(favModule)"
      />
    </div>
    <div class="dashboard__fav-modules-tables">
      <GridLayout
        class="dashboard__fav-modules-layout"
        v-model:layout="layout"
        :col-num="6"
        :row-height="10"
        :margin="[20, 20]"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <GridItem
          v-for="(favModule, index) in favoriteModulesItems"
          :key="favModule.id"
          :x="layout[index]?.x"
          :y="layout[index]?.y"
          :w="layout[index]?.w"
          :h="layout[index]?.h"
          :i="layout[index]?.i"
          drag-allow-from=".dashboard-widget-group__head"
          :min-w="2"
          :min-h="10"
          class="dashboard__table-widget-item"
        >
          <DashboardFavoriteModuleTable class="dashboard__fav-modules-table" :value="favModule" @redirect-to-list="() => handleFavoriteModuleClick(favModule)"/>
        </GridItem>
      </GridLayout>
    </div>
    <div class="dashboard__notifications">
      <DashboardNotifications />
    </div>

    <div class="dashboard__fav-objects">
      <DashboardFavoriteObjects :objects="favoriteObjects" />
    </div>

    <div class="dashboard__widgets">
      <DashboardWidgetGroup
        v-for="(group, groupIndex) in widgetGroups"
        :key="group.Id"
        :group-name="group.Name"
        :allow-edit="group.AllowEdit"
        @reload-data="reloadWidgetGroupData(group.Id, groupIndex)"
        :loading="groupLoadingIndex === groupIndex"
      >
        <template v-if="widgetGroups.length" #default>
          <DashboardWidget
            v-for="widget in group.Widgets"
            :key="widget.WidgetGuid"
            :widget="widget"
            :loading="groupLoadingIndex === groupIndex || widgetLoadingIndex === widget.WidgetGuid"
            @update:grouping="
              updateWidgetData(group.Id, widget.WidgetGuid, widget.DiffViewType, $event)
            "
            @update:diff-view-type="
              updateWidgetData(group.Id, widget.WidgetGuid, $event, widget.GroupField)
            "
          ></DashboardWidget>
        </template>
      </DashboardWidgetGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus'
import type { DashboardFavoritiesModuleItem, MetricGroupDto } from '@/core/interface/Dashboard'
import { IconsByModuleGroupID } from '@/core/utils/Icons'
import { GetGroupData, GetUserGroupList, GetWidgetData } from '@/core/api/wigets.api'

const dashboardStore = useDashboardStore()
const { FavoritesModules, favoriteObjects } = storeToRefs(dashboardStore)

const configurationStore = useConfigurationStore()
const { modules } = storeToRefs(configurationStore)
const authStore = useAuthStore()

const widgetGroups = ref<MetricGroupDto[]>([])
const groupLoadingIndex = ref<number | null>(null)
const widgetLoadingIndex = ref<string | null>(null)

const reloadWidgetGroupData = async (groupId: number, groupIndex: number) => {
  groupLoadingIndex.value = groupIndex
  const { data, error } = await GetGroupData(groupId)
  if (!data || error) {
    groupLoadingIndex.value = null
    return
  }
  widgetGroups.value[groupIndex] = data
  groupLoadingIndex.value = null
}

const updateWidgetData = async (groupId, widgetGuid, compareType, detailingType) => {
  widgetLoadingIndex.value = widgetGuid
  const { data, error } = await GetWidgetData({ groupId, widgetGuid, compareType, detailingType })
  if (!data || error) {
    widgetLoadingIndex.value = null
    return
  }
  let currentGroupIndex = widgetGroups.value.findIndex((group) => group.Id === groupId)
  if (currentGroupIndex < 0) return
  let currentWidgetIndex = widgetGroups.value[currentGroupIndex].Widgets.findIndex(
    (widget) => widget.WidgetGuid === widgetGuid,
  )
  if (currentWidgetIndex < 0) return
  widgetGroups.value[currentGroupIndex].Widgets[currentWidgetIndex] = data
  widgetLoadingIndex.value = null
}

const favoriteModulesItems = computed(() => {
  return FavoritesModules.value
    .map((favModuleID) => {
      const moduleItem = authStore.user?.AvailableModules.find((m) => m.FullViewId === favModuleID)
      if (!moduleItem) return undefined

      const moduleSettings = modules.value.find((m) => m.Id === moduleItem.Id)
      if (!moduleSettings) return undefined

      return {
        id: moduleItem.Id,
        groupId: moduleSettings.moduleGroupID,
        viewId: moduleItem.ViewId,
        title: moduleItem.TabName || moduleSettings.Title,
        subtitle: moduleSettings.moduleGroupTitle,
        icon: IconsByModuleGroupID[moduleSettings.moduleGroupID],
        iconColor: moduleSettings.PrimaryColor,
        backgroundColor: moduleSettings.SecondaryColor,
      }
    })
    .filter(Boolean) as DashboardFavoritiesModuleItem[]
})

const handleFavoriteModuleClick = (favoriteModule: DashboardFavoritiesModuleItem) => {
  router.push(
    `/${favoriteModule.groupId}/${favoriteModule.id}${
      favoriteModule.viewId ? '/' + favoriteModule.viewId : ''
    }`,
  )
}

// Initial layout calculation
const calculateInitialLayout = () => {
  const layout = []
  // Widgets layout
  favoriteModulesItems.value.forEach((_, index) => {
    layout.push({
      x: (index % 2) * 3,
      y: Math.floor(index / 2),
      w: 3,
      h: 10,
      i: `table-${index}`,
    })
  })

  return layout
}

// Layout management
const layout = ref(calculateInitialLayout())

// Save layout changes to localStorage
const saveLayout = () => {
  localStorage.setItem('dashboard-layout', JSON.stringify(layout.value))
}

// Watch layout changes
watch(
  () => layout.value,
  () => {
    saveLayout()
  },
  { deep: true },
)

onMounted(async () => {
  const savedLayout = localStorage.getItem('dashboard-layout')
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout)
  }

  const { data, error } = await GetUserGroupList(true)
  if (!data || error) {
    return
  }
  widgetGroups.value = data
})
</script>

<style scoped lang="scss">
.dashboard {
  display: grid;
  padding: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  grid-template-rows: min-content min-content 280px auto;
  grid-template-areas:
    'fav-module fav-module fav-module fav-module fav-module fav-module'
    'fav-module-tables fav-module-tables fav-module-tables fav-module-tables fav-module-tables fav-module-tables'
    'notifications notifications notifications fav-object fav-object fav-object'
    'widgets widgets widgets widgets widgets widgets';
  background-color: var(--component-background);
}

.dashboard__fav-modules {
  grid-area: fav-module;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  grid-template-rows: min-content;
}

.dashboard__fav-modules-tables {
  grid-area: fav-module-tables;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
}

.dashboard__fav-modules-layout {
  margin: -20px;
}

.dashboard__fav-modules-table {
  height: 100%;
}

.dashboard__table-widget-item {
  overflow: hidden;
}

.dashboard__notifications {
  grid-area: notifications;
  overflow: hidden;
  background-color: var(--color-background);
  padding: 16px 20px;
  border-radius: 8px;
}

.dashboard__fav-objects {
  grid-area: fav-object;
  background-color: var(--color-background);
  overflow: hidden;
  padding: 16px 20px;
  border-radius: 8px;
}

.dashboard__widgets {
  grid-area: widgets;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
</style>
