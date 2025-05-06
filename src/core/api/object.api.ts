import _ from 'lodash'
import type { IApiResponse } from '@/core/interface/Api'
import type { FavoriteObject } from '@/core/interface/Auth'
import type { IObjectFlag } from '@/core/interface/Object'
import type { ValidateResult } from '@/core/interface/ValidateResult'
import type { IFIOValue, IAddressValue } from '@/core/interface/Object'
import type { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import type { IObjectDto } from '@/core/interface/Object'
import type { IModuleDatasetDto } from '@/core/interface/Module'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { RequestsModuleId } from '@/core/constants/ModuleId'

interface IApiUseModuleParam {
  ModuleId?: string | RequestsModuleId
}
// GetObjectDto
export interface IGetObjectDtoRequest extends IApiUseModuleParam {
  ObjectId: number
  BaseObjectType: number
  DtoViewType: DtoObjectViewType
  ReturnEmptyObject?: boolean
  CustomViewName?: string
}

export const GetObjectDto = async <T>({
  ModuleId,
  ...req
}: IGetObjectDtoRequest): Promise<IApiResponse<T>> => {
  const { data, error }: IApiResponse<T> = await useApi('Objects.GetObjectDto', {
    body: req,
    moduleId: ModuleId,
  })

  return { data, error }
}

export const AddObjectToFavorites = async (
  ModuleId: string,
  payload: {
    Id: number
    BaseObjectType: number
    BaseObjectName: string
    BaseObjectDate: string
  },
) => {
  const { data, error }: IApiResponse<FavoriteObject[]> = await useApi(
    'Objects.AddObjectToFavorites',
    {
      body: {
        InputObject: {
          Id: payload.Id,
          BaseObjectType: payload.BaseObjectType,
          BaseObjectName: payload.BaseObjectName,
          BaseObjectDate: payload.BaseObjectDate,
        },
      },
      moduleId: ModuleId,
    },
  )

  return { data, error }
}

export const DelObjectFromFavorites = async (
  ModuleId: string,
  payload: {
    Id: number
    BaseObjectType: number
    BaseObjectName: string
    BaseObjectDate: string
  },
) => {
  const { data, error }: IApiResponse<FavoriteObject[]> = await useApi(
    'Objects.DelObjectFromFavorites',
    {
      body: {
        InputObject: {
          Id: payload.Id,
          BaseObjectType: payload.BaseObjectType,
          BaseObjectName: payload.BaseObjectName,
          BaseObjectDate: payload.BaseObjectDate,
        },
      },
      moduleId: ModuleId,
    },
  )

  return { data, error }
}

export const ValidateObject = async (payload: {
  ModuleId?: string
  ObjectId: number
  BaseObjectType: number
  OperationCode: string
  Vals: { [key: string]: any }
}) => {
  const { data, error }: IApiResponse<ValidateResult> = await useApi('Objects.ValidateObject', {
    moduleId: payload.ModuleId,
    body: {
      ObjectId: payload.ObjectId,
      BaseObjectType: payload.BaseObjectType,
      OperationCode: payload.OperationCode,
      Vals: payload.Vals,
    },
  })

  return { data, error }
}

export const SetFlagToObject = async (payload: {
  ModuleId?: string
  ObjectId: number
  BaseObjectType: number
  TemplateId: number
  Description: string
}) => {
  const { data, error }: IApiResponse<IObjectFlag[]> = await useApi('Objects.SetFlagToObject', {
    moduleId: payload.ModuleId,
    body: {
      ObjectId: payload.ObjectId,
      BaseObjectType: payload.BaseObjectType,
      TemplateId: payload.TemplateId,
      Description: payload.Description,
    },
  })

  return { data, error }
}

export const DelFlagFromObject = async (payload: {
  ModuleId?: string
  ObjectId: number
  BaseObjectType: number
  TemplateId: number
}) => {
  const { data, error }: IApiResponse<IObjectFlag[]> = await useApi('Objects.DelFlagFromObject', {
    moduleId: payload.ModuleId,
    body: {
      ObjectId: payload.ObjectId,
      BaseObjectType: payload.BaseObjectType,
      TemplateId: payload.TemplateId,
    },
  })

  return { data, error }
}

export const getFioRecognition = async (payload: { StringParamValue: string }) => {
  const { data, error }: IApiResponse<IFIOValue> = await useApi('RecognitionApi.GetFio', {
    body: {
      StringParamValue: payload.StringParamValue,
    },
  })

  return { data, error }
}

export const getAddressRecognition = async (payload: { StringParamValue: string }) => {
  const { data, error }: IApiResponse<IAddressValue> = await useApi('RecognitionApi.GetAddress', {
    body: {
      StringParamValue: payload.StringParamValue,
    },
  })

  return { data, error }
}

export interface GetAsyncBlockInfoPayload {
  ModuleId: string
  BaseObjectId: number
  BaseObjectType: number
  BlockCode: number
}

export const GetAsyncBlockInfo = async ({
  ModuleId,
  BaseObjectId,
  BaseObjectType,
  BlockCode,
}: GetAsyncBlockInfoPayload) => {
  const { data, error }: IApiResponse<IModuleDatasetDto> = await useApi(
    'Objects.GetAsyncBlockInfo',
    {
      moduleId: ModuleId,
      body: {
        BaseObjectId: BaseObjectId,
        BaseObjectType: BaseObjectType,
        BlockCode: BlockCode,
      },
    },
  )

  return { data, error }
}
