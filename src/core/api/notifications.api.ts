import _ from 'lodash'
import type { IApiResponse } from '@/core/interface/Api'
import type { ValidateResult } from '@/core/interface/ValidateResult'
import type { NotificationEventTypes } from '@/core/constants/NotificationEventTypes'
import type { INotification } from '@/core/interface/Notifications'

export interface ISetNotificationPayloadVals {
  txtComment: string
  dateNotification: string
  BaseObjectId: number
  BaseObjectType: number
  ddlExecutorType: string
  ctrlDictsRoles: string
  lstUsers: string
  ddlNotificationType: NotificationEventTypes
  ctrlClientInfoPanel: string
  ddlFilials: string
}

export interface ISetNotificationPayload {
  ObjectId: number
  OperationCode: string
  Vals: ISetNotificationPayloadVals
}

export const SetNotification = async (payload: ISetNotificationPayload) => {
  const { data, error }: IApiResponse<any> = await useApi('Notifications.SetNotification', {
    body: payload,
  })

  return { data, error }
}

export const ValidateNotification = async (payload: ISetNotificationPayload) => {
  const { data, error }: IApiResponse<ValidateResult> = await useApi('Notifications.Validate', {
    body: payload,
  })

  return { data, error }
}

interface IGetNotificationsForObjectPayload {
  ObjectId: number
  ObjectType: number
}

export interface INotificationsArrayResponse {
  Items: INotification[]
  TotalCount: number
}

export const GetNotificationsForObject = async (payload: IGetNotificationsForObjectPayload) => {
  const { data, error }: IApiResponse<INotificationsArrayResponse> = await useApi(
    'Notifications.GetNotificationsForObject',
    {
      body: {
        ObjectId: payload.ObjectId,
        ObjectType: payload.ObjectType,
      },
    }
  )

  return { data, error }
}

export const GetNotificationsCount = async () => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'Notifications.GetNotificationsCount',
    {}
  )

  return { data, error }
}

export const GetNotificationsGroup = async ({ ...req }: IApiNotificationGroup) => {
  const { data, error }: IApiResponse<INotificationsArrayResponse> = await useApi(
    'Notifications.GetNotificationsObjects',
    {
      body: req,
    }
  )

  return { data, error }
}

export const GetNotificationsRows = async ({ ...reg }: IApiGetNotificationsRows) => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'Notifications.GetNotificationsRows',
    {
      body: reg,
    }
  )
  return { data, error }
}

export const DeleteNotification = async ({ ...req }: IApiDeleteNotification) => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'Notifications.FinishNotifications',
    {
      body: req,
    }
  )
  return { data, error }
}
