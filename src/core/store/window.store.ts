// import { AuthLogin, AuthRecover } from '@/core/api/auth.api'
import type { IWindowTab } from '@/core/interface/Window'
import type { IObjectDto } from '../interface/Object'
import { toRaw } from 'vue'
import { cloneDeep } from 'lodash'
import { createObjectInstance } from '../services/createObjectInstance'

export const useWindowStore = defineStore(
  'window',
  () => {
    const configurationStore = useConfigurationStore()
    const { BaseObjectsColors } = storeToRefs(configurationStore)

    // state
    const isOpened = ref(false)
    const tabs = ref<IWindowTab[]>([])
    const activeTabId = ref<number | null>(null)
    // computed
    const activeTab = computed(() => {
      return tabs.value.find((x) => x.id === activeTabId.value)
    })

    const objectByTabId = (objectId: number) => {
      return tabs.value.find((tab) => tab.id === objectId)?.object
    }

    const setContentTab = (tab: number) => {
      const activeTabIndex = tabs.value.findIndex((tab) => tab.id === activeTab.value.id)

      tabs.value[activeTabIndex].contentTab = tab
    }

    // store actions
    const openWindow = () => {
      isOpened.value = true
    }

    const closeWindow = () => {
      isOpened.value = false
    }

    const addTab = (tab: IOpenWindowTabPayload, shouldShow: boolean = true) => {
      const tabIndex = tabs.value.findIndex((tabInStore) => tabInStore.id === tab.id)

      // Если id == -1, генерируем новый, уникальный
      if (tab.id === -1) {
        let newId
        do {
          newId = Math.floor(Math.random() * -10000)
        } while (tabs.value.some((tabInStore) => tabInStore.id === newId))
        tab.id = newId
      }

      if (tabIndex === -1) {
        tabs.value = [
          ...tabs.value,
          {
            color: BaseObjectsColors.value[tab.type] || '',
            contentTab: 0,
            editMode: false,
            ...tab,
          },
        ]
      }

      if (shouldShow) {
        openWindow()
        activeTabId.value = tab.id
      }
    }

    const removeTab = (id: number) => {
      const index = tabs.value.map((x) => x.id).indexOf(id)
      const nextElement = tabs.value[index + 1]
      const prevElement = tabs.value[index - 1]

      let nextActiveTabId = null as number | null
      if (nextElement) {
        nextActiveTabId = nextElement.id
      } else if (prevElement) {
        nextActiveTabId = prevElement.id
      }

      tabs.value = tabs.value.filter((x) => x.id !== id)
      activeTabId.value = nextActiveTabId
    }

    const clearTabs = () => {
      tabs.value = []
    }

    const showTab = (id: number) => {
      if (tabs.value.find((x) => x.id === id)) {
        activeTabId.value = id

        return true
      }

      return false
    }

    const updateTabData = (id: number, data: IObjectDto) => {
      const tab = tabs.value.find((tab: IWindowTab) => tab.id === id)

      if (!tab) return

      const prevId = tab.id

      tab.id = data.BaseObjectId

      if (tab.id !== prevId) {
        showTab(tab.id)
      }

      tab.title = data.WindowTitle || data.BaseObjectName
      tab.data = cloneDeep(toRaw(data))
    }

    const switchTabEditMode = (id: number, newObject: unknown) => {
      const tab = tabs.value.find((tab: IWindowTab) => tab.id === id)

      if (!tab) return

      tab.editMode = !tab.editMode
      tab.object = newObject
      tab.data = newObject.getCurrentState()
    }

    return {
      isOpened,
      openWindow,
      closeWindow,
      clearTabs,
      tabs,
      activeTabId,
      activeTab,
      addTab,
      removeTab,
      showTab,
      updateTabData,
      objectByTabId,
      setContentTab,
      switchTabEditMode,
    }
  },
  {
    persist: {
      pick: ['activeTabId', 'tabs'],
      afterHydrate: (ctx) => {
        ctx.store.tabs = ctx.store.tabs.map((tab) => ({
          ...tab,
          object: createObjectInstance(tab.id, tab.type, undefined, tab.editMode),
        }))
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot))
}
