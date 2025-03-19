import type { IApiResponse } from '@/core/interface/Api'
import type { IClientContact } from '@/core/interface/ClientContact'
import type { ValidateResult } from '@/core/interface/ValidateResult'
import type { FormField } from '@/core/interface/FormField'

export const GetClientAutoCompleteList = async (pattern: string) => {
  const { data, error }: IApiResponse<IClientContact[]> = await useApi(
    'Clients.GetAutoComliteList',
    {
      body: {
        Pattern: pattern,
      },
    },
  )

  return { data, error }
}

export const GetClientPhones = async (clientId: number) => {
  const { data, error }: IApiResponse<string[]> = await useApi('Clients.GetClientPhones', {
    body: {
      LongParamValue: clientId,
    },
  })

  return { data, error }
}

export const ClientValidate = async (payload: { Vals: Record<string, any> }) => {
  const { Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Clients.Validate', {
    body: {
      OperationCode: 'SaveClient',
      Vals,
    },
  })

  return { data, error }
}

export const ClientUpdateAdditionalDataValidate = async (payload: {
  ObjectId: number
  Vals: unknown
}) => {
  const { ObjectId, Vals } = payload
  const { data, error }: IApiResponse<ValidateResult> = await useApi('Clients.Validate', {
    body: {
      OperationCode: 'Clients.UpdateAdditionalData',
      ObjectId,
      Vals,
    },
  })

  return { data, error }
}

export const ClientUpdateAdditionalData = async (payload: { ObjectId: number; Vals: unknown }) => {
  const { ObjectId, Vals } = payload
  const { data, error }: IApiResponse<any> = await useApi('Clients.UpdateAdditionalData', {
    body: {
      OperationCode: 'Clients.UpdateAdditionalData',
      ObjectId,
      Vals,
    },
  })

  return { data, error }
}

interface IClientUpdateResult {
  Id: number
  BaseObjectType: number
  BaseObjectName: string
  BaseObjectDate: string
}

export const ClientUpdate = async (payload: { ObjectId: number; Vals: Record<string, any> }) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<IClientUpdateResult> = await useApi('Clients.SaveClient', {
    body: {
      OperationCode: 'SaveClient',
      ObjectId,
      Vals,
    },
  })

  return { data, error }
}

export const ClientsGetFormFields = async () => {
  const { data, error }: IApiResponse<FormField[]> = await useApi('Clients.GetFormFields', {
    body: {
      OperationCode: 'SaveClient',
    },
  })

  return { data, error }
}
