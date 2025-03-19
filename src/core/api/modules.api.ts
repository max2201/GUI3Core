import type { IApiResponse } from '@/core/interface/Api'
import type {
  IModuleDatasetDto,
  IModuleGroupOperations,
  IModuleState,
} from '@/core/interface/Module'
import type { ImagesContaner } from '@/core/interface/Object'
import type { INotification } from '@/core/interface/Notifications'
import { BaseObjectType } from '@/core/constants/BaseObjectType'

// GetItems
export interface IApiUseModuleParam {
  ModuleId?: string | 'RequestsModule'
}

export interface IApiUsePagination {
  PageNumber?: number
  PageSize?: number
  SortProperty?: string | null
  SortMode?: number | 0 | 1
  Filter?: { [key: string]: string }
}

export interface IApiNotificationGroup {
  PageNumber: number
  PageSize: number
  Types: number[]
}

export interface IApiDeleteNotification {
  LongParamIds: number[]
}

export interface IApiGetNotificationsRows {
  PageNumber: number
  PageSize: number
  TextFilter: string
  Types: Array<number>
  OnlyOverdue: boolean
}

export interface IApiSaveFiles {
  ObjectId: number
  BaseObjectType: number
  Images: Array<ImagesContaner>
}

export interface IApiGetTasks {
  PageSize: number
  PageNumber: number
}

export interface IGetModuleDatasetRequest extends IApiUseModuleParam, IApiUsePagination {}

export interface IGetModuleStateRequest extends IApiUseModuleParam, IApiUsePagination {}

export const GetItems = async ({ ModuleId, ...req }: IGetModuleDatasetRequest) => {
  const { data, error }: IApiResponse<IModuleDatasetDto> = await useApi('Modules.GetItems', {
    body: req,
    moduleId: ModuleId,
  })

  return { data, error }
}
export const apiGroupOperations = async (operation: string, ids: string[]) => {
  const { data, error }: IApiResponse<IModuleGroupOperations> = await useApi(operation, {
    body: {
      Ids: ids,
    },
  })

  return { data, error }
}
export const GetModuleState = async ({ ViewId, ModuleId }: any) => {
  const { data, error }: IApiResponse<IModuleState> = await useApi('Modules.GetModuleState', {
    moduleId: ModuleId,
    body: {
      ViewId,
    },
  })

  return { data, error }
}

// GetLastNotificationForObject
export interface IGetLastNotificationDtoRequest {
  moduleId: BaseObjectType
  InputObject: {
    Id: number
    BaseObjectType: number
  }
}

export const GetLastNotificationForObject = async (req: IGetLastNotificationDtoRequest) => {
  const { data, error }: IApiResponse<INotification> = await useApi('Objects.GetLastNotification', {
    body: req,
  })

  return { data, error }
}

interface AddModuleFilterPayload extends IApiUseModuleParam {
  ViewId: string
  FilterName: string
  CurrentFilterValues: { [key: string]: string }
}

export const AddModuleFilter = async ({
  ModuleId,
  ViewId,
  FilterName,
  CurrentFilterValues,
}: AddModuleFilterPayload) => {
  const { data, error }: IApiResponse<IModuleState> = await useApi('Modules.AddModuleFilter', {
    moduleId: ModuleId,
    body: {
      ViewId,
      FilterName,
      CurrentFilterValues,
    },
  })

  return { data, error }
}

interface SetCurrentFilterPayload extends IApiUseModuleParam {
  ViewId: string
  FilterId: string | number
}

export const SetCurrentFilter = async ({ ModuleId, ViewId, FilterId }: SetCurrentFilterPayload) => {
  const { data, error }: IApiResponse<IModuleState> = await useApi('Modules.SetCurrentFilter', {
    moduleId: ModuleId,
    body: {
      ViewId,
      FilterId,
    },
  })

  return { data, error }
}

export const DeleteSavedFilter = async ({
  ModuleId,
  ViewId,
  FilterId,
}: SetCurrentFilterPayload) => {
  const { data, error }: IApiResponse<IModuleState> = await useApi('Modules.DelModuleFilter', {
    moduleId: ModuleId,
    body: {
      ViewId,
      FilterId,
    },
  })

  return { data, error }
}

export const AddModuleToFavorites = async (ModuleId: string, ViewId: string = '') => {
  const { data, error }: IApiResponse<string[]> = await useApi('Modules.AddModuleToFavorites', {
    moduleId: ModuleId,
    body: {
      ViewId,
    },
  })

  return { data, error }
}

export const RemoveModuleFromFavorite = async (ModuleId: string, ViewId: string = '') => {
  const { data, error }: IApiResponse<string[]> = await useApi('Modules.DelModuleFromFavorites', {
    moduleId: ModuleId,
    body: {
      ViewId,
    },
  })

  return { data, error }
}

export const GetTasksCount = async () => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'Tasks.GetPotentialUserTasksCount',
    {},
  )

  return { data, error }
}

export const GetTasks = async ({ ...req }: IApiGetTasks) => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'Tasks.GetPotentialUserTasksToolTips',
    {
      body: req,
    },
  )

  return { data, error }
}

export const apiSaveFiles = async ({ ...reg }: IApiSaveFiles) => {
  const { data, error }: IApiResponse<any> = await useApi('Objects.UpdateImagesContainer', {
    body: reg,
  })

  return { data, error }
}

export const SetUserAsExecutorForTask = async ({ ...req }) => {
  const { data, error }: IApiResponse<string[]> = await useApi('Tasks.SetUserAsExecutorForTask', {
    body: req,
  })

  return { data, error }
}

export const GetKanban = async ({ ...req }) => {
  const { data, error }: IApiResponse<string[]> = await useApi('Kanban.GetObjects', {
    body: req,
  })

  return { data, error }
}

export const ExecuteCommand = async ({ ...req }) => {
  const { data, error }: IApiResponse<string[]> = await useApi('Kanban.ExecuteCommand', {
    body: req,
  })

  return { data, error }
}

export interface GetDtoObjectsForCustomTablePayload {
  BaseObjectId: number
  ViewId: string
  PageSize: number
  PageNumber: number
  SortColumn: string
  SortMode: number
}

export const GetDtoObjectsForCustomTable = async (payload: GetDtoObjectsForCustomTablePayload) => {
  const { data, error }: IApiResponse<IModuleDatasetDto> = await useApi(
    'Modules.GetDtoObjectsForCustomTable',
    {
      body: {
        BaseObjectId: payload.BaseObjectId,
        ViewId: payload.ViewId,
        PageSize: payload.PageSize,
        PageNumber: payload.PageNumber,
        SortColumn: payload.SortColumn,
        SortMode: payload.SortMode,
      },
    },
  )

  return { data, error }
}
