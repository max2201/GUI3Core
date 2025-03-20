import _ from 'lodash'
import type { IApiResponse } from '@/core/interface/Api'
import type { AccessVerifyOperationType } from '@/core/constants/AccessVerifyOperationType'

interface VerifyAccessOutputDto {
  SuccessVerify: boolean
  ErrorMessage: string
}

interface VerifyAccessPayload {
  TypeOperation: AccessVerifyOperationType
  Id: number
  BaseObjectType: number
  // BaseObjectName: string
  // BaseObjectDate: string
}

export const VerifyAccess = async (payload: VerifyAccessPayload) => {
  const { TypeOperation, Id, BaseObjectType, BaseObjectName, BaseObjectDate } = payload

  const { data, error }: IApiResponse<VerifyAccessOutputDto> = await useApi('Access.VerifyAccess', {
    body: {
      TypeOperation,
      AccountingTime: new Date().toISOString(),
      InputObject: {
        Id,
        BaseObjectType,
        BaseObjectName,
        BaseObjectDate: BaseObjectDate || new Date().toISOString(),
      },
    },
  })

  return { data, error }
}
