<template>
  <div class="dashboard">
    <UiLoader :loading="isLayoutLoading" theme="page" not-transparent />
    <GridLayout
      class="dashboard__grid-layout"
      ref="gridLayout"
      v-model:layout="layout"
      :col-num="8"
      :row-height="140"
      :margin="[20, 20]"
      :is-draggable="layoutEditMode"
      :is-resizable="layoutEditMode"
      :use-css-transforms="true"
      :vertical-compact="true"
    >
      <GridItem
        @container-resized="changeLoadingState"
        v-for="favModule in favModulesCombinedData"
        :key="favModule.data.id"
        :x="favModule.layout?.x"
        :y="favModule.layout?.y"
        :w="favModule.layout?.w"
        :h="favModule.layout?.h"
        :i="favModule.layout?.i"
        :is-resizable="favModule.data.hasTableWidget && layoutEditMode"
        drag-allow-from=".dashboard__grid-item-drag-handler"
        :min-w="favModule.data.hasTableWidget ? 4 : undefined"
        :min-h="favModule.data.hasTableWidget ? 2 : undefined"
        class="dashboard__grid-item"
      >
        <div class="dashboard__grid-item-drag-handler"></div>
        <DashboardFavoriteModuleTable
          :hide-controls="!layoutEditMode"
          v-if="favModule.data.hasTableWidget"
          class="dashboard__fav-modules-table"
          :value="favModule.data"
          @redirect-to-list="() => handleFavoriteModuleClick(favModule.data)"
          @hide-module-table="hideModuleTable(favModule.data)"
        />
        <DashboardFavoriteModule
          :hide-controls="!layoutEditMode"
          v-else
          class="dashboard__fav-modules-item"
          :value="favModule.data"
          @click="() => handleFavoriteModuleClick(favModule.data)"
          @remove-module-from-favourite="removeModuleFromFavorite(favModule.data)"
          @open-module-table="openModuleTable(favModule.data)"
        />
      </GridItem>
      <GridItem
        @container-resized="changeLoadingState"
        v-if="layoutNotifications"
        :x="layoutNotifications.x"
        :y="layoutNotifications.y"
        :w="layoutNotifications.w"
        :h="layoutNotifications.h"
        :i="layoutNotifications.i"
        :is-resizable="false"
        class="dashboard__grid-item"
        :min-w="4"
        :min-h="2"
        drag-allow-from=".dashboard__grid-item-drag-handler"
      >
        <div class="dashboard__grid-item-drag-handler"></div>
        <DashboardNotifications class="dashboard__notifications" />
      </GridItem>

      <GridItem
        @container-resized="changeLoadingState"
        v-if="layoutFavObjects"
        :x="layoutFavObjects.x"
        :y="layoutFavObjects.y"
        :w="layoutFavObjects.w"
        :h="layoutFavObjects.h"
        :i="layoutFavObjects.i"
        :is-resizable="false"
        :min-w="4"
        :min-h="2"
        class="dashboard__grid-item"
        drag-allow-from=".dashboard__grid-item-drag-handler"
      >
        <div class="dashboard__grid-item-drag-handler"></div>
        <DashboardFavoriteObjects class="dashboard__fav-objects" :objects="favoriteObjects" />
      </GridItem>

<!--          @resize="
          [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.data.WidgetType) &&
          pieWidgetResizeHandler($event)
        "
        @resized="
          [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.data.WidgetType) &&
          pieWidgetResizedHandler($event, widget.data.MetricId)
        "-->
      <GridItem
        @container-resized="changeLoadingState"
        v-for="widget in widgetsCombinedData"
        :key="widget.data.MetricId"
        :x="widget.layout?.x"
        :y="widget.layout?.y"
        :w="widget.layout?.w"
        :h="widget.layout?.h"
        :i="widget.layout?.i"
        :min-w="
          widget.data.WidgetType === WidgetTypes.NumberValue
            ? widget.data.GroupDetails?.length
              ? 2
              : 1
            : [WidgetTypes.PieChart, WidgetTypes.DonutChart].includes(widget.data.WidgetType)
              ? 2
              : 4
        "
        :min-h="
          widget.data.WidgetType === WidgetTypes.NumberValue && !widget.data.GroupDetails?.length
            ? 1
            : 2
        "
        class="dashboard__grid-item"
        drag-allow-from=".dashboard__grid-item-drag-handler"
      >
        <div class="dashboard__grid-item-drag-handler"></div>
        <DashboardWidget
          :size="widget.layout?.w === 1 ? 'small' : widget.layout?.w > 2 ? 'large' : 'medium'"
          :hide-actions="layoutEditMode"
          :widget="widget.data"
          :loading="widgetLoadingIndex === widget.data.WidgetGuid"
          @open-widget-data-view="openWidgetDataView(widget.data)"
          @reload-data="
            updateWidgetData(
              widget.data.GroupId,
              widget.data.WidgetGuid,
              widget.data.DiffViewType,
              widget.data.GroupField,
            )
          "
          @update:grouping="
            updateWidgetData(
              widget.data.GroupId,
              widget.data.WidgetGuid,
              widget.data.DiffViewType,
              $event,
            )
          "
          @update:diff-view-type="
            updateWidgetData(
              widget.data.GroupId,
              widget.data.WidgetGuid,
              $event,
              widget.data.GroupField,
            )
          "
        >
          <template #edit-actions v-if="layoutEditMode">
            <UiButton1
              theme="transparent"
              title="Дублировать виджет"
              custom-color="#F0F5F9"
              custom-text-color="#8990A2"
              :icon-size="20"
              icon-left="duplicate"
            ></UiButton1>
            <UiButton1
              v-if="widget.data.AllowEdit"
              theme="transparent"
              title="Редактировать виджет"
              custom-color="#F0F5F9"
              custom-text-color="#8990A2"
              :icon-size="20"
              icon-left="pencil"
              @click="openWidgetEdit(widget.data)"
            ></UiButton1>
            <UiButton1
              v-else
              theme="transparent"
              title="Посмотреть настойки виджета"
              custom-color="#F0F5F9"
              custom-text-color="#8990A2"
              :icon-size="20"
              icon-left="eye"
              @click="openWidgetEdit(widget.data)"
            ></UiButton1>
            <UiButton1
              v-if="widget.data.AllowEdit"
              theme="transparent"
              title="Удалить виджет"
              custom-color="#F0F5F9"
              custom-text-color="#8990A2"
              :icon-size="20"
              icon-left="trash"
              @click="deleteWidget(widget.data)"
            ></UiButton1>
          </template>
        </DashboardWidget>
      </GridItem>
      <GridItem
        @container-resized="changeLoadingState"
        v-if="layoutSettings"
        :x="layoutSettings.x"
        :y="layoutSettings.y"
        :w="layoutSettings.w"
        :h="layoutSettings.h"
        :i="layoutSettings.i"
        :is-resizable="false"
        class="dashboard__grid-item"
        drag-allow-from=".dashboard__grid-item-drag-handler"
      >
        <div class="dashboard__grid-item-drag-handler"></div>
        <DashboardSettingsBlock
          v-model:edit-mode="layoutEditMode"
          @add-widget="openWidgetEdit"
        ></DashboardSettingsBlock>
      </GridItem>
    </GridLayout>
  </div>
</template>

<script async setup lang="ts">
import { GridItem, GridLayout } from 'grid-layout-plus'
import type { Layout } from 'grid-layout-plus'
import type { DashboardFavoritiesModuleItem, MetricGroupDto } from '@/core/interface/Dashboard'
import { IconsByModuleGroupID } from '@/core/utils/Icons'
import { DeleteWidget, GetUserGroupList, GetWidgetData } from '@/core/api/wigets.api'
import { UpdateUserDashboardLayoutItems } from '@/core/api/auth.api'
import debounce from 'lodash/debounce'
import { type FreeModalArgs, FreeModalTarget } from '@/core/interface/FreeModal'
import { WidgetEditEventTypes, WidgetTypes } from '@/core/constants/DashboardWidgetTypes'

const dashboardStore = useDashboardStore()
const moduleStore = useModuleStore()

const { FavoritesModules, favoriteObjects } = storeToRefs(dashboardStore)

const configurationStore = useConfigurationStore()
const { modules } = storeToRefs(configurationStore)
const authStore = useAuthStore()

const widgetGroups = ref<MetricGroupDto[]>([])
const groupLoadingIndex = ref<number | null>(null)
const widgetLoadingIndex = ref<string | null>(null)

const widgetsAll = computed(() => {
  return widgetGroups.value.flatMap((group) => {
    return group.Widgets.map((widget) => {
      return {
        ...widget,
        GroupId: group.Id,
        AllowEdit: group.AllowEdit,
      }
    })
  })
})

const layoutEditMode = ref(false)

const deleteWidget = async ({ GroupId, WidgetGuid, MetricId }) => {
  widgetLoadingIndex.value = WidgetGuid

  await DeleteWidget({ groupId: GroupId, widgetGuid: WidgetGuid })
  const { data, error } = await GetUserGroupList(true)
  if (!data || error) {
    return
  }

  widgetGroups.value = data
  widgetLoadingIndex.value = null

  const index = layout.value.findIndex((item) => item.i === `widget-${MetricId}`)

  if (index > -1) {
    layout.value.splice(index, 1)
  }
}

const openWidgetDataView = (item) => {
  const windowContentDiv = Array.from(document.getElementsByClassName('dashboard'))[0]
  const windowContentRect = windowContentDiv.getBoundingClientRect()

  if (!windowContentRect) {
    console.error('Не удалось открыть окно - не найдено view')
    return
  }

  if (item?.WidgetGuid && item?.GroupId) {
    EventBus.emit(GlobalEvents.OpenFreeModal, {
      top: 89,
      bottom: 47,
      right: 20,
      left: 80,
      target: FreeModalTarget.WidgetView,
      object: {
        groupId: item.GroupId,
        widgetGuid: item.WidgetGuid,
      },
      title: 'Просмотр виджета',
      options: {
        headerCloseIcon: 'close',
        styles: {
          header: { background: '#BD9873', justifyContent: 'space-between' },
          window: { borderRadius: '10px' },
          headerCloseIcon: { order: 1 },
        },
      },
    } as unknown as FreeModalArgs)
  }
}
const openWidgetEdit = (item = null) => {
  const windowContentDiv = Array.from(document.getElementsByClassName('dashboard'))[0]
  const windowContentRect = windowContentDiv.getBoundingClientRect()

  if (!windowContentRect) {
    console.error('Не удалось открыть окно - не найдено view')
    return
  }

  EventBus.emit(GlobalEvents.OpenFreeModal, {
    top: 134,
    bottom: 0,
    right: 0,
    width: 1095,
    target: FreeModalTarget.WidgetEdit,
    object: {
      groupId: (item?.WidgetGuid && item?.GroupId) || undefined,
      widgetGuid: (item?.GroupId && item?.WidgetGuid) || undefined,
      allowEdit: item?.WidgetGuid && item?.GroupId ? item.AllowEdit : true,
    },
    callback: async (eventType?: WidgetEditEventTypes) => {
      if (eventType === WidgetEditEventTypes.Delete) {
        const { data, error } = await GetUserGroupList(true)
        if (!data || error) {
          return
        }
        widgetGroups.value = data
        const index = layout.value.findIndex((elem) => elem.i === `widget-${item.MetricId}`)
        if (index > -1) {
          layout.value.splice(index, 1)
        }
      } else if (eventType === WidgetEditEventTypes.Update) {
        const { data, error } = await GetUserGroupList(true)
        if (!data || error) {
          return
        }
        widgetGroups.value = data

        widgetsAll.value.forEach((widget) => {
          // Check if this widget already exists in layout
          const widgetLayoutExists = layout.value.some(
            (item) => item.i === `widget-${widget.MetricId}`,
          )

          // If it doesn't exist, add the widget to layout with default properties
          if (!widgetLayoutExists) {
            // const prevItem = layout.value.find()
            const prevItem = layout.value.reduce((acc, curr) => {
              if (curr.y > acc.y || (curr.y === acc.y && curr.x > acc.x)) {
                return curr
              }
              return acc
            })
            console.log(prevItem)
            let xPos = 0
            let yPos = 0

            xPos = prevItem.x + prevItem.w
            console.log(prevItem.y)
            if (xPos + 1 > 8) {
              xPos = 0
              yPos = prevItem.y + prevItem.h
            } else {
              yPos = prevItem.y
            }

            layout.value.push({
              i: `widget-${widget.MetricId}`,
              x: xPos,
              y: yPos,
              w: widget.WidgetType === WidgetTypes.NumberValue ? 1 : 2,
              h: widget.WidgetType === WidgetTypes.NumberValue ? 1 : 2,
            })
          }
        })
      }
    },
    title:
      item?.WidgetGuid && item?.GroupId
        ? item.AllowEdit
          ? 'Редактирование виджета'
          : 'Просмотр настроек виджета'
        : 'Добавление нового виджета',
    options: {
      styles: { header: { background: '#BD9873' } },
    },
  } as unknown as FreeModalArgs)
}
//
// const reloadWidgetGroupData = async (groupId: number, groupIndex: number) => {
//   groupLoadingIndex.value = groupIndex
//   const { data, error } = await GetGroupData(groupId)
//   if (!data || error) {
//     groupLoadingIndex.value = null
//     return
//   }
//   widgetGroups.value[groupIndex] = data
//   groupLoadingIndex.value = null
// }

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
    .map((favModule) => {
      const moduleItem = authStore.user?.AvailableModules.find(
        (m) => m.FullViewId === favModule.FullViewId,
      )
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
        hasTableWidget: favModule.HasTableWidget,
        hasTableData: moduleSettings.IsTableModule,
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

// TODO: добавить try catch для обработки ошибок + посмотреть подобные места
const removeModuleFromFavorite = async (module) => {
  await moduleStore.removeModuleFromFavorite(module.viewId, module.id)
  const index = layout.value.findIndex((item) => item.i === `fav-${module.id}`)

  if (index > -1) {
    layout.value.splice(index, 1)
  }
}

const openModuleTable = async (module) => {
  await moduleStore.setFavoriteModuleToTableWidget(module.viewId, module.id)
  const layoutItem = layout.value.find((item) => item.i === `fav-${module.id}`)
  if (layoutItem && gridLayout.value) {
    if (layoutItem.x > 4) {
      gridLayout.value.dragEvent(
        'drag',
        layoutItem.i,
        layoutItem.x - (layoutItem.x === 5 ? 1 : layoutItem.x === 6 ? 2 : 3),
        layoutItem.y,
        layoutItem.h,
        layoutItem.w,
      )
    }
    gridLayout.value.resizeEvent('resize', layoutItem.i, layoutItem.x, layoutItem.y, 2, 4)
  }
}
const hideModuleTable = async (module) => {
  await moduleStore.delFavoriteModuleFromTableWidget(module.viewId, module.id)
  const layoutItem = layout.value.find((item) => item.i === `fav-${module.id}`)
  if (layoutItem && gridLayout.value) {
    gridLayout.value.resizeEvent('resize', layoutItem.i, layoutItem.x, layoutItem.y, 1, 1)
  }
}

const gridLayout = ref<InstanceType<typeof GridLayout>>()
const calculateInitialLayout = () => {
  const layout: Layout = []

  const addItemToLayout = (width, height, id) => {
    let xPos = 0
    let yPos = 0

    if (layout.length > 0) {
      const prevItem = layout[layout.length - 1]

      xPos = prevItem.x + prevItem.w

      if (xPos + width > 8) {
        xPos = 0
        yPos = prevItem.y + prevItem.h
      } else {
        yPos = prevItem.y
      }
    }

    layout.push({
      x: xPos,
      y: yPos,
      w: width,
      h: height,
      i: id,
    })
  }

  // Widgets layout
  favoriteModulesItems.value.forEach((item) => {
    const width = item.hasTableWidget ? 4 : 1
    const height = item.hasTableWidget ? 2 : 1
    const id = `fav-${item.id}`
    addItemToLayout(width, height, id)
  })
  addItemToLayout(4, 2, 'notifications')

  // Add favorite objects widget
  addItemToLayout(4, 2, 'favObjects')

  // Add widget groups
  widgetsAll.value.forEach((item) => {
    addItemToLayout(
      item.WidgetType === WidgetTypes.NumberValue ? 1 : 2,
      item.WidgetType === WidgetTypes.NumberValue ? 1 : 2,
      `widget-${item.MetricId}`,
    )
  })

  addItemToLayout(2, 2, 'layoutSettings')
  return layout
}

const layoutFavModules = computed(() => {
  return layout.value.filter(({ i }) => typeof i === 'string' && i.startsWith('fav-'))
})
const layoutNotifications = computed(() => {
  return layout.value.find(({ i }) => typeof i === 'string' && i.startsWith('notifications'))
})
const layoutFavObjects = computed(() => {
  return layout.value.find(({ i }) => typeof i === 'string' && i.startsWith('favObjects'))
})
const layoutWidgets = computed(() => {
  return layout.value.filter(({ i }) => typeof i === 'string' && i.startsWith('widget-'))
})
const layoutSettings = computed(() => {
  return layout.value.find(({ i }) => typeof i === 'string' && i.startsWith('layoutSettings'))
})

const favModulesCombinedData = computed(() => {
  return favoriteModulesItems.value.map((item) => {
    const layoutData = layoutFavModules.value.find(
      ({ i }) => typeof i === 'string' && i === `fav-${item.id}`,
    )
    return { data: item, layout: layoutData }
  })
})
const widgetsCombinedData = computed(() => {
  return widgetsAll.value.map((item) => {
    const layoutData = layoutWidgets.value.find(
      ({ i }) => typeof i === 'string' && i === `widget-${item.MetricId}`,
    )
    return { data: item, layout: layoutData }
  })
})

// Layout management
const layout = ref<Layout>([])

// Save layout changes to localStorage
const debouncedUpdateServer = debounce(
  async (layoutData: Layout) => {
    await UpdateUserDashboardLayoutItems(layoutData)
  },
  1000,
  { leading: false, trailing: true },
)

const saveLayout = () => {
  localStorage.setItem(LOCALSTORAGE.DashboardLayout, JSON.stringify(layout.value))
  debouncedUpdateServer(layout.value)
}

// Watch layout changes
watch(
  () => layout.value,
  () => {
    saveLayout()
  },
  { deep: true },
)

const isLayoutLoading = ref(true)
const changeLoadingState = debounce(
  async () => {
    isLayoutLoading.value = false
  },
  1000,
  { leading: false, trailing: true },
)
onBeforeMount(async () => {
  const { data, error } = await GetUserGroupList(true)
  if (!data || error) {
    return
  }
  widgetGroups.value = data

  const savedLayout = await localStorage.getItem(LOCALSTORAGE.DashboardLayout)
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout)

    // проверяем есть ли удалённые элементы в лейауте и удаляем из лейаута
    layout.value = layout.value.filter(({ i }) => {
      // Check if this is a favorite module or table item
      if (typeof i === 'string' && i.startsWith('fav-')) {
        // Extract the module ID from the layout item
        const moduleId = i.replace('fav-', '')

        // Check if this module exists in favoriteModulesItems
        // Keep the item only if the module exists in favoriteModulesItems
        return favoriteModulesItems.value.some((module) => module.id === moduleId)
      }
      // Check if this is a widget item
      if (typeof i === 'string' && i.startsWith('widget-')) {
        // Extract the widget ID from the layout item
        const widgetId = Number(i.replace('widget-', ''))

        // Keep the item only if the widget exists in widgetGroups
        return widgetsAll.value.some((widget) => widget.MetricId === widgetId)
      }
      // Keep all non-favorite items
      return true
    })
    // проверяем есть ли новые элементы в лейауте и добавляем в лейаут
    favoriteModulesItems.value.forEach((module) => {
      // Check if this module already exists in layout as module
      const moduleLayoutExists = layout.value.some((item) => item.i === `fav-${module.id}`)

      // If neither exists, add the module to layout with default properties
      if (!moduleLayoutExists) {
        layout.value.push({
          i: `fav-${module.id}`,
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        })
      }
    })
    // Add missing widgets to layout
    widgetsAll.value.forEach((widget) => {
      // Check if this widget already exists in layout
      const widgetLayoutExists = layout.value.some((item) => item.i === `widget-${widget.MetricId}`)

      // If it doesn't exist, add the widget to layout with default properties
      if (!widgetLayoutExists) {
        layout.value.push({
          i: `widget-${widget.MetricId}`,
          x: 0,
          y: 0,
          w: widget.WidgetType === 10 ? 1 : 2,
          h: widget.WidgetType === 10 ? 1 : 2,
        })
      }
    })
  } else {
    layout.value = calculateInitialLayout()
  }
})

// const currentPieWidgetSize = ref('')
// const pieWidgetResizedHandler = async (indexName, MetricId) => {
//   const layoutElement = layout.value.find((item) => item.i === indexName)
//   if (gridLayout.value && layoutElement?.w === 3) {
//     if (currentPieWidgetSize.value === 'large') {
//       await gridLayout.value.resizeEvent(
//         'resize',
//         layoutElement.i,
//         layoutElement.x,
//         layoutElement.y,
//         layoutElement.h,
//         2,
//       )
//       await gridLayout.value.resizeEvent(
//         'resize',
//         layoutElement.i,
//         layoutElement.x,
//         layoutElement.y,
//         layoutElement.h,
//         2,
//       )
//     }
//     if (currentPieWidgetSize.value === 'small') {
//       await gridLayout.value.resizeEvent(
//         'resize',
//         layoutElement.i,
//         layoutElement.x,
//         layoutElement.y,
//         layoutElement.h,
//         4,
//       )
//       await gridLayout.value.resizeEvent(
//         'resize',
//         layoutElement.i,
//         layoutElement.x,
//         layoutElement.y,
//         layoutElement.h,
//         4,
//       )
//     }
//   }
//   currentPieWidgetSize.value = ''
// }
// const pieWidgetResizeHandler = (indexName) => {
//   const layoutElement = layout.value.find((item) => item.i === indexName)
//   if (layoutElement.w === 4) {
//     currentPieWidgetSize.value = 'large'
//   }
//   if (layoutElement.w === 2) {
//     currentPieWidgetSize.value = 'small'
//   }
// }
</script>

<style scoped lang="scss">
:deep(.vgl-item--placeholder) {
  opacity: 1;
  border: 2px dashed #1a8ff2;
  border-radius: 8px;
  background: transparent;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-property: transform, width, height;
  transition-timing-function: ease;

  &::after {
    content: '';
    background-color: #1a8ff214;
    border-radius: 8px;
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 8px;
    right: 8px;
  }
}

:deep(.vgl-item--resizing) {
  padding: 2px;
  opacity: 0.9;
}

.dashboard {
  overflow: v-bind("isLayoutLoading ? 'hidden' : 'auto'");
  background-color: var(--color-background);
}

.dashboard__fav-modules {
  grid-area: fav-module;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  grid-template-rows: min-content;

  &-item {
    height: 100%;
  }
}

.dashboard__fav-modules-table {
  height: 100%;
}

.dashboard__grid-item {
  overflow: hidden;
  transition-property: transform, width, height;

  &-drag-handler {
    content: '';
    transition: opacity 0.3s ease-out;
    opacity: v-bind('+layoutEditMode');
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 10px;
    z-index: 1;
    background: #06478930;
    border-radius: 0 0 5px 5px;
  }
}

.dashboard__widgets {
  grid-area: widgets;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
</style>
