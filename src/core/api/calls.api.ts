import type { IApiResponse } from '@/core/interface/Api'
import type { ValidateResult } from '@/core/interface/ValidateResult'
export const CallUpdateAdditionalDataValidate = async (payload: {
  ObjectId: number
  Vals: unknown
}) => {
  const { ObjectId, Vals } = payload
  const { data, error }: IApiResponse<ValidateResult> = await useApi('CallApi.Validate', {
    body: {
      OperationCode: 'CallApi.UpdateAdditionalData',
      ObjectId,
      Vals,
    },
  })

  return { data, error }
}

export const CallUpdateAdditionalData = async (payload: { ObjectId: number; Vals: unknown }) => {
  const { ObjectId, Vals } = payload
  const { data, error }: IApiResponse<any> = await useApi('CallApi.UpdateAdditionalData', {
    body: {
      OperationCode: 'CallApi.UpdateAdditionalData',
      ObjectId,
      Vals,
    },
  })

  return { data, error }
}
export const CallValidate = async (payload) => {
  const { ObjectId, Vals } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('CallApi.Validate', {
    body: {
      ObjectId,
      OperationCode: 'CallApi.Save',
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

export const CallUpdate = async (payload: IRequestsUpdatePayload) => {
  const { ObjectId, BaseObjectType, Vals } = payload

  const { data, error }: IApiResponse<any> = await useApi('CallApi.Save', {
    body: {
      ObjectId,
      BaseObjectType,
      OperationCode: 'CallApi.Save',
      Vals,
    },
  })

  return { data, error }
}

export interface CallValidateVals {
  // комментарий
  txtComment: string
  // Предмет разговора
  CallSubject: string
  // напоминание
  ctrlRemindersPanel_Checked: boolean // галочка что включено создание напоминания
  ctrlRemindersPanel_IsExactTime: boolean // флаг, что передается точное время напоминания
  ctrlRemindersPanel_dtExact?: string // точное время напоминания
  ctrlRemindersPanel_dateRemind?: string // дата напоминания (при режиме с задержкой)
  ctrlRemindersPanel_ddlTimeRemind?: string // задержка (при режиме с задержкой)
  ctrlRemindersPanel_UsersIds?: string // список id получателей уведомления
  ctrlRemindersPanel_RolesIds?: string // список id ролей получателей уведомления
  // Клиент
  chbNotClient: boolean

  infoClient_ClientID?: string
  infoClient_ClientName?: string
  infoClient_ClientType?: string
  linkedClient_DisplayName?: string
  linkedClient_ID?: string
  // Контакт
  InfoContact_ClientID?: string
  InfoContact_ClientName?: string
  InfoContact_ClientType?: string
  // Телефоны
  ctrlPhones_ContactPersons?: string
  ctrlPhones_ResultPhones?: string
  //   Заявка
  CurrentRequestDto?: string
  IsProcessRequest?: boolean

  FilialCode: number //текущий филиал
  // Флаги
  FlagsChanged: boolean
  ctrlEventManager_Flags?: string

  chbProcessAllLinkedCalls: boolean
  isManualClosing: boolean
}

export interface CallValidatePayload {
  ObjectId: number
  Vals: CallValidateVals
}
