import type { IApiResponse } from '@/core/interface/Api'
import type { IObjectStep } from '@/core/interface/Object'
import type { ValidateResult, ValidateResultSimple } from '@/core/interface/ValidateResult'
import { OperationCode } from '@/core/constants/OperationCode'

export interface IRequestsValidatePayload {
  ObjectId: number
  BaseObjectType: number
  OperationCode: OperationCode
  Vals: Record<string, any>
}

export const RequestsValidate = async (payload: IRequestsValidatePayload) => {
  const { ObjectId, BaseObjectType, OperationCode, Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Requests.Validate', {
    body: {
      ObjectId,
      BaseObjectType,
      OperationCode,
      Vals,
    },
  })

  return { data, error }
}

export interface IRequestsUpdatePayload {
  ObjectId: number
  BaseObjectType: number
  Vals: Record<string, any>
}

export const RequestsUpdate = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, BaseObjectType, Vals } = payload

  const { data, error }: IApiResponse<any> = await useApi('Requests.UpdateRequest', {
    body: {
      ObjectId,
      BaseObjectType,
      OperationCode: 'Requests.UpdateRequest',
      Vals,
    },
  })

  return { data, error }
}
export const AddRequests = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, BaseObjectType, Vals } = payload

  const { data, error }: IApiResponse<any> = await useApi('Requests.AddRequest', {
    body: {
      ObjectId,
      BaseObjectType,
      OperationCode: 'Requests.AddRequest',
      Vals,
    },
  })

  return { data, error }
}
export const RequestsUpdateAdditionalData = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<any> = await useApi('Requests.UpdateAdditionalData', {
    body: {
      ObjectId,
      OperationCode: 'Requests.UpdateAdditionalData',
      Vals,
    },
  })

  return { data, error }
}
export const RequestsValidateAdditionalData = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Requests.Validate', {
    body: {
      ObjectId,
      OperationCode: 'Requests.UpdateAdditionalData',
      Vals,
    },
  })

  return { data, error }
}
export const RequestGetSteps = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, Vals } = payload
  const { data, error }: IApiResponse<any> = await useApi('RequestsUtilsApi.GetSteps', {
    body: {
      ObjectId: -1,
      BaseObjectType: 1,
      OperationCode: 'RequestsUtilsApi.GetSteps',
      Vals,
    },
  })

  return { data, error }
}
export const RequestMergeToClient = async (payload: IRequestsUpdatePayload) => {
  const { objectId, Vals } = payload
  const { data, error }: IApiResponse<any> = await useApi('RequestsUtilsApi.MergeToClient', {
    body: {
      ObjectId: objectId,
      BaseObjectType: 1,
      OperationCode: 'RequestsUtilsApi.MergeToClient',
      Vals,
    },
  })

  return { data, error }
}
export interface RequestValidateVals {
  callFromWin: boolean // вызов из win формы
  infoClient_Client: string // id клиента из контрола клиента
  infoClient_ClientName: string // имя клиента из настройки контрола
  infoPartnerState: string // список данных партнера через PartnerRequestState
  ddlWorkingState: string // текущий результат
  ddlSource: string // источник заявки
  ddlFilials: string // филиал
  ddlCanceledText: string // детализация результата
  txtComment: string // комментарий
  ctrlPromoCode: string
  txtSourceDetail: string // детализация источника
  chbNotClient: boolean // галочка, что не является клиентом
  contactsPhones_ResultPhones: string | null // телефоны контакта через Phones (который показывается если не является клиентом)
  contactsPhones_ContactPersons: string | null // контакты из контрола телефонов контакта через список ContactPerson (который показывается если не является клиентом)
  ctrlPhones_ResultPhones: string | null // телефоны клиента через Phones
  ctrlPhones_ContactPersons: string | null // контакты из контрола телефонов клиента через список ContactPerson
  stepsPanel_Groups: any // список динамических полей через FieldGroupDTO
  Changes: string // список изменений из формы слияния (это пока не реализовано, надо передать пустой список или пустую строку)
  OpeneDateTime: string // время когда была открыта форма заявки
  ddlUsers: string // id ответственных
  ctrlLocationOfClient: string // местоположение клиента через LocationInfo
  ctrlRemindersPanel_Checked: boolean // галочка что включено создание напоминания
  ctrlRemindersPanel_IsExactTime: boolean // флаг, что передается точное время напоминания
  ctrlRemindersPanel_dtExact: string // точное время напоминания
  ctrlRemindersPanel_dateRemind: string // дата напоминания (при режиме с задержкой)
  ctrlRemindersPanel_ddlTimeRemind: string // задержка (при режиме с задержкой)
  ctrlRemindersPanel_UsersIds: string // список id получателей уведомления
  ctrlRemindersPanel_RolesIds: string // список id ролей получателей уведомления
}
export interface StepsValidateVals extends RequestValidateVals {
  validateFirstStep: boolean
}
export interface RequestValidatePayload {
  ObjectId: number
  Vals: RequestValidateVals
}

export const RequestValidate = async (payload: RequestValidatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Requests.Validate', {
    body: {
      ObjectId,
      OperationCode: 'Requests.UpdateRequest',
      Vals,
    },
  })

  return { data, error }
}
export const AddRequestValidate = async (payload: RequestValidatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Requests.Validate', {
    body: {
      ObjectId,
      OperationCode: 'Requests.AddRequest',
      Vals,
    },
  })

  return { data, error }
}
export const StepsValidate = async (payload: RequestValidatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResultSimple> = await useApi(
    'RequestsUtilsApi.ValidateSteps',
    {
      body: {
        ObjectId,
        OperationCode: 'RequestsUtilsApi.ValidateSteps',
        Vals,
      },
    },
  )

  return { data, error }
}
export const ValidateStepsValidate = async (payload: RequestValidatePayload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResultSimple> = await useApi(
    'RequestsUtilsApi.Validate',
    {
      body: {
        ObjectId,
        OperationCode: 'RequestsUtilsApi.ValidateSteps',
        Vals,
      },
    },
  )

  return { data, error }
}
