import _ from 'lodash'
import { toRaw, unref } from 'vue'
import type { IObjectEvent } from '@/core/interface/ObjectEvent'
import { AggregatedEventType } from '@/core/constants/AggregatedEventType'
import {
  GetEventsList,
  AddObjectEvent,
  GetNewEventsList,
  GetOldEventsList,
} from '@/core/api/eventsList.api'

export const useObjectEventListStore = defineStore(
  'objectEventList',
  () => {
    const selectedObjectID = ref<null | number>(null)
    const selectedObjectType = ref<null | number>(null)
    const isShowEventsList = computed(
      () => Boolean(selectedObjectID.value) && Boolean(selectedObjectType.value),
    )
    const objectEvents = ref<IObjectEvent[]>([])
    const isLoadingEventsList = ref(false)
    const isLoadingNewEvents = ref(false)
    const isLoadedLastOldMessage = ref(false)
    const filters = ref<AggregatedEventType[]>([])

    const getEventTypesFilter = () => {
      return filters.value.length ? unref(toRaw(filters.value)) : undefined
    }

    const setSelectedObjectID = (
      objectID: number,
      objectType: number,
      defaultFilters = [AggregatedEventType.Message],
    ) => {
      selectedObjectID.value = objectID
      selectedObjectType.value = objectType
      objectEvents.value = []
      filters.value = defaultFilters
      isLoadingOldEvents.value = false
      isLoadedLastOldMessage.value = false
      isLoadingEventsList.value = true

      GetEventsList({
        BaseObjectId: objectID,
        BaseObjectType: objectType,
        EventTypesFilter: getEventTypesFilter(),
      })
        .then(({ data, error }) => {
          if (error) {
            console.error('GetEventsList error', error)
            return
          }

          if (!data || !_.isArray(data)) {
            console.error('GetEventsList not found data', data)
            return
          }

          objectEvents.value = [...data]
        })
        .finally(() => {
          isLoadingEventsList.value = false
        })
    }

    const closeObjectEventsList = () => {
      selectedObjectID.value = null
    }

    const addObjectEvent = (payload: {
      IsImportant?: boolean
      MessageText: string
      Images?: any[]
    }) => {
      if (!selectedObjectID.value || !selectedObjectType.value) return

      const BaseObjectId = selectedObjectID.value
      const BaseObjectType = selectedObjectType.value
      const LastEventId = objectEvents.value[0]?.Id

      AddObjectEvent({
        ...payload,
        BaseObjectId,
        BaseObjectType,
      }).then(() => {
        if (!LastEventId) {
          console.error('Will not load new events because not found last event id', LastEventId)
          return
        }

        isLoadingNewEvents.value = true

        GetNewEventsList({
          BaseObjectId,
          BaseObjectType,
          LastEventId,
          EventTypesFilter: getEventTypesFilter(),
        })
          .then(({ data, error }) => {
            if (error) {
              console.error('GetNewEventsList in AddObjectEvent error', error)
              return
            }

            if (!data || !_.isArray(data)) {
              console.error('GetNewEventsList in AddObjectEvent not found data', data)
              return
            }

            objectEvents.value.unshift(...data)
          })
          .finally(() => {
            isLoadingNewEvents.value = false
          })
      })
    }

    const isLoadingOldEvents = ref(false)

    const loadOldObjectEvents = () => {
      if (!selectedObjectID.value || !selectedObjectType.value) return
      if (isLoadingOldEvents.value || isLoadedLastOldMessage.value) return

      const BaseObjectId = selectedObjectID.value
      const BaseObjectType = selectedObjectType.value
      const LastEventId = objectEvents.value[objectEvents.value.length - 1]?.Id

      isLoadingOldEvents.value = true

      GetOldEventsList({
        BaseObjectId,
        BaseObjectType,
        LastEventId,
        EventTypesFilter: getEventTypesFilter(),
      })
        .then(({ data, error }) => {
          if (error) {
            console.error('GetNewEventsList in AddObjectEvent error', error)
            return
          }

          if (!data || !_.isArray(data)) {
            console.error('GetNewEventsList in AddObjectEvent not found data', data)
            return
          }

          if (selectedObjectID.value !== BaseObjectId) return

          if (data.length === 0) {
            isLoadedLastOldMessage.value = true
            return
          }

          objectEvents.value.push(...data)
        })
        .finally(() => {
          isLoadingOldEvents.value = false
        })
    }

    const setFilters = (newFilters: AggregatedEventType[]) => {
      if (!selectedObjectID.value || !selectedObjectType.value) return

      filters.value = unref(toRaw(newFilters))

      objectEvents.value = []
      isLoadingOldEvents.value = false
      isLoadedLastOldMessage.value = false
      isLoadingEventsList.value = true

      const BaseObjectId = selectedObjectID.value
      const BaseObjectType = selectedObjectType.value

      GetEventsList({
        BaseObjectId,
        BaseObjectType,
        EventTypesFilter: getEventTypesFilter(),
      })
        .then(({ data, error }) => {
          if (error) {
            console.error('GetEventsList error', error)
            return
          }

          if (!data || !_.isArray(data)) {
            console.error('GetEventsList not found data', data)
            return
          }

          if (BaseObjectId !== selectedObjectID.value) return

          if (data.length === 0) {
            isLoadedLastOldMessage.value = true
          }

          objectEvents.value = [...data]
        })
        .finally(() => {
          isLoadingEventsList.value = false
        })
    }

    return {
      filters,
      isShowEventsList,
      setSelectedObjectID,
      closeObjectEventsList,
      addObjectEvent,
      objectEvents,
      isLoadingEventsList,
      isLoadingNewEvents,
      isLoadingOldEvents,
      loadOldObjectEvents,
      isLoadedLastOldMessage,
      setFilters,
      selectedObjectID,
      selectedObjectType,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useObjectEventListStore, import.meta.hot))
}
