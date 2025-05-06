import type { IApiResponse } from '@/core/interface/Api'
import type { IClientContact } from '@/core/interface/ClientContact'
import type { ValidateResult, ValidateSameClients } from '@/core/interface/ValidateResult'
import type { FormField } from '@/core/interface/FormField'
export interface IClientValidateVals {
  DocumentType: string
  chbAgreeDogovorMessages: string
  chbAgreeReklamaMessages: string
  chbApiDisabled: string
  chbBan: string
  chbEnabledBonuses: string
  chbMobileAppExists: string
  chbNoMail: string
  ctrlCategory: string
  ctrlCompanyAccountantName: string
  ctrlCompanyActualAddress: string
  ctrlCompanyBank: string
  ctrlCompanyDefaultSignerName: string
  ctrlJobPlace: string
  ctrlClientDocument: string
  ctrlLegalDefaultInfo2_CtrlCeoFio: string
  ctrlLegalDefaultInfo2_CtrlCompanyAddress: string
  ctrlLegalDefaultInfo2_DdlCeoPosition: string
  ctrlLegalDefaultInfo2_DdlLegalType: string
  ctrlLegalDefaultInfo2_TxtCompanyDateRegistration: string
  ctrlLegalDefaultInfo2_TxtCompanyInn: string
  ctrlLegalDefaultInfo2_TxtCompanyKpp: string
  ctrlLegalDefaultInfo2_TxtCompanyName: string
  ctrlLegalDefaultInfo2_TxtCompanyOgrn: string
  ctrlLegalDefaultInfo2_TxtCompanyOkpo: string
  ctrlPersonDefaultInfo1_CtrlFio: string
  ctrlPersonDefaultInfo1_CtrlLivingPlace: string
  ctrlPersonDefaultInfo1_DateBirthday: string
  ctrlSubCat: string
  ddlCategory: string
  ddlClientsGroup: string
  ddlDeliveryType: string
  ddlLegalStatus: string
  infoAnketa: string
  infoBankPerson: string
  infoBonusCard: string
  infoDriverLicence: string
  txtBonus: string
  txtCode1: string
  txtCode2: string
  txtCodeWord: string
  txtComment: string
  txtCompanyDefaultSignerLawBase: string
  txtCompanyDefaultSignerPosition: string
  txtCompanyMainActivity: string
  txtCompanyPlaceOKSMCode: string
  txtCreditRaiting: string
  txtDiscount: string
  txtINN: string
  txtIPDateReg: string
  txtInitialBonuses: string
  txtInitialPersonalAccount: string
  txtInitialProfit: string
  txtIntegrationId: string
  txtMail: string
  txtNotifyNumber: string
  txtOgrnIp: string
  txtOkved: string
  txtSingleContractDate: string
  txtSingleContractNumber: string
  txtSingleContractTitle: string
  txtSnils: string
}
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

export const ClientValidate = async (payload: { Id: number; Vals: Record<string, any> }) => {
  const { Vals, Id } = payload

  const { data, error }: IApiResponse<ValidateResult> = await useApi('Clients.Validate', {
    body: {
      OperationCode: 'Clients.SaveClient',
      ObjectId: Id,
      Vals,
    },
  })

  return { data, error }
}
export const ClientCheckSameInnClients = async (payload: {
  Id: number
  Vals: Record<string, any>
}) => {
  const { Vals, Id } = payload

  const { data, error }: IApiResponse<ValidateSameClients> = await useApi(
    'ClientsUtils.CheckSameInnClients',
    {
      body: {
        OperationCode: 'ClientsUtils.CheckSameInnClients',
        ObjectId: Id,
        Vals,
      },
    },
  )

  return { data, error }
}
export const CheckSamePhoneClients = async (phone) => {
  const { data, error }: IApiResponse<string[]> = await useApi(
    'ClientsUtils.CheckSamePhoneClients',
    {
      body: {
        OperationCode: 'ClientsUtils.CheckSamePhoneClients',
        Vals: {
          Phone: JSON.stringify(phone),
        },
      },
    },
  )

  return { data, error }
}
export const ClientCheckSamePassportClients = async (payload: {
  Id: number
  Vals: Record<string, any>
}) => {
  const { Vals, Id } = payload

  const { data, error }: IApiResponse<ValidateSameClients> = await useApi(
    'ClientsUtils.CheckSamePassportClients',
    {
      body: {
        OperationCode: 'ClientsUtils.CheckSamePassportClients',
        ObjectId: Id,
        Vals,
      },
    },
  )

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
      OperationCode: 'Clients.SaveClient',
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
