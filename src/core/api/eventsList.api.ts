import type { IApiResponse } from '@/core/interface/Api'
import type { IObjectEvent } from '@/core/interface/ObjectEvent'
import type { AggregatedEventType } from '@/core/constants/AggregatedEventType'

interface GetEventsListParams {
  EventTapeType?: number // 0
  BaseObjectId: number
  BaseObjectType: number
  PageSize?: number
  EventTypesFilter?: AggregatedEventType[]
}

export const GetEventsList = async (payload: GetEventsListParams) => {
  const { data, error }: IApiResponse<IObjectEvent[]> = await useApi('EventTape.GetMessages', {
    body: {
      EventTapeType: payload.EventTapeType || 0,
      BaseObjectId: payload.BaseObjectId,
      BaseObjectType: payload.BaseObjectType,
      PageSize: payload.PageSize || 30,
      EventTypesFilter: payload.EventTypesFilter,
    },
  })

  return { data, error }
}

interface GetNewEventsListParams {
  LastEventId: number
  EventTapeType?: number // 0
  BaseObjectId: number
  BaseObjectType: number
  EventTypesFilter?: AggregatedEventType[]
}

export const GetNewEventsList = async (payload: GetNewEventsListParams) => {
  const { data, error }: IApiResponse<IObjectEvent[]> = await useApi('EventTape.GetMessages', {
    body: {
      EventTapeType: payload.EventTapeType || 0,
      BaseObjectId: payload.BaseObjectId,
      BaseObjectType: payload.BaseObjectType,
      EventTypesFilter: payload.EventTypesFilter,
      LastEventId: payload.LastEventId,
      SeekDirection: 0, // hardcode for define direction of seek events
      PageSize: null, // harcode for get all new issues
    },
  })

  return { data, error }
}

interface AddObjectEventPayload {
  EventTapeType?: number
  IsImportant?: boolean
  BaseObjectId: number
  BaseObjectType: number
  MessageText: string
  Images?: any[]
}

export const AddObjectEvent = async (payload: AddObjectEventPayload) => {
  const { data, error }: IApiResponse<any> = await useApi('EventTape.AddMessage', {
    body: {
      EventTapeType: payload.EventTapeType || 0,
      IsImportant: payload.IsImportant,
      BaseObjectId: payload.BaseObjectId,
      BaseObjectType: payload.BaseObjectType,
      MessageText: payload.MessageText || 'test',
      Images: payload.Images,
    },
  })

  return { data, error }
}

interface GetOldEventsListParams {
  LastEventId: number
  BaseObjectId: number
  BaseObjectType: number
  EventTapeType?: number // 0
  EventTypesFilter?: AggregatedEventType[]
}

export const GetOldEventsList = async (payload: GetOldEventsListParams) => {
  const { data, error }: IApiResponse<IObjectEvent[]> = await useApi('EventTape.GetMessages', {
    body: {
      EventTapeType: payload.EventTapeType || 0,
      BaseObjectId: payload.BaseObjectId,
      BaseObjectType: payload.BaseObjectType,
      EventTypesFilter: payload.EventTypesFilter,
      LastEventId: payload.LastEventId,
      SeekDirection: 1, // hardcode for define direction of old events
      PageSize: 30, // harcode
    },
  })

  return { data, error }
}
