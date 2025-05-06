import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetAsyncBlockInfo, GetObjectDto } from '@/core/api/object.api'
import type { IClientDto, IClientEditDto } from '@/core/interface/Client'
import {
  ClientCheckSameInnClients,
  ClientCheckSamePassportClients,
  ClientUpdate,
  ClientValidate,
  type IClientValidateVals,
} from '@/core/api/clients.api'

import type { ValidErrorCodes } from '@/core/constants/ValidErrorCodes'

export class ClientEditObject extends BaseObject<IClientEditDto> {
  declare public rawData?: IClientEditDto
  declare public currentState?: IClientEditDto
  public AfterCheckPassport: string
  public ModuleId = 'ClientsModule'

  constructor(id: number, objectDTO?: IClientEditDto) {
    super(id, objectDTO, BaseObjectType.Client)
    if (objectDTO) {
      this.rawData = cloneDeep(toRaw(unref(objectDTO)))
      this.currentState = reactive(cloneDeep(toRaw(unref(objectDTO))) as IClientEditDto)
    }
    this.AfterCheckPassport = 'False'
  }
  public setAfterCheckPassport(val: boolean) {
    this.AfterCheckPassport = val ? 'True' : 'False'
  }
  public async loadData(): Promise<IClientEditDto | undefined> {
    const requestParams = {
      ObjectId: this.id < 0 ? -1 : this.id,
      BaseObjectType: BaseObjectType.Client,
      DtoViewType: DtoObjectViewType.PrimaryEdit,
      ...(this.id < 0 && { ModuleId: this.ModuleId, ReturnEmptyObject: true }),
    }
    return GetObjectDto<IClientEditDto>(requestParams).then(({ data, error }) => {
      if (!data || error) {
        console.error('ClientObject -> loadData -> Cannot load GetObjectDto', error)
        return
      }

      const modifiedData: IClientEditDto = {
        ...data,
        CommentField: {
          ...data.CommentField,
          editing: false,
          initialValue: data.CommentField?.currentVal,
        },
      }

      this.rawData = modifiedData
      this.currentState = reactive(cloneDeep(modifiedData))
      return modifiedData
    })
  }
  public getCurrentState(): IClientEditDto | null {
    return this.currentState || null
  }

  public getUpdateVals() {
    return {
      ExternalFlags: this.currentState?.Flags ? JSON.stringify(this.currentState?.Flags) : null,
      NonRequiredPhone: 'False',
      VaidatePrimaryInfoExternalFlag: 'False',
      clientImages: JSON.stringify({
        Images: [],
        ObjectType: 'Client',
        ObjectId: '9c6eb2d5-bebf-4f38-967e-4ed3a0fe6281',
      }),
      ctrlPersonDefaultInfo1_NewClientPhotoId: this.currentState?.PhotoId,
      ctrlPersonDefaultInfo1_CitizenShip: this.currentState?.RepairTypeField.currentVal,
      ctrlPhonesTable: JSON.stringify(this.currentState?.PhonesInfo?.Collection),
      DocumentType: this.currentState?.DocumentTypeField.currentVal,
      chbAgreeDogovorMessages: this.currentState?.AgreeDogovorMessagesField.currentVal,
      chbAgreeReklamaMessages: this.currentState?.AgreeReklamaMessagesField.currentVal,
      chbApiDisabled: this.currentState?.ApiDisabledField.currentVal,
      chbBan: this.currentState?.BanField.currentVal,
      chbEnabledBonuses: this.currentState?.EnabledBonusField.currentVal,
      chbMobileAppExists: this.currentState?.MobileAppExistsField.currentVal,
      chbNoMail: this.currentState?.NoMailField.currentVal,
      ctrlCategory: this.currentState?.FinCategoryField.currentVal || '-1',
      ctrlCompanyAccountantName: JSON.stringify(
        this.currentState?.CompanyAccountantNameInfo?.Value?.ComplexValue,
      ),
      ctrlCompanyActualAddress: JSON.stringify(
        this.currentState?.CompanyActualAddressInfo?.Value?.ComplexValue,
      ),

      ctrlCompanyBank: JSON.stringify(this.currentState?.CompanyBankInfo?.Value?.ComplexValue),
      ctrlCompanyDefaultSignerName: JSON.stringify(
        this.currentState?.CompanyDefaultSignerNameInfo?.Value?.ComplexValue,
      ),
      ctrlJobPlace: JSON.stringify(this.currentState?.JobPlaceInfo?.Value?.ComplexValue),
      ctrlLegalDefaultInfo2_CtrlCeoFio: JSON.stringify(
        this.currentState?.CeoFio?.Value?.ComplexValue,
      ),
      ctrlLegalDefaultInfo2_CtrlCompanyAddress: JSON.stringify(
        this.currentState?.CompanyAddress?.Value?.ComplexValue,
      ),
      ctrlClientDocument: JSON.stringify(this.currentState?.ClientDocument),
      ctrlLegalDefaultInfo2_DdlCeoPosition: this.currentState?.CeoPositionField.currentVal,
      ctrlLegalDefaultInfo2_DdlLegalType: this.currentState?.LegalTypeField.currentVal,
      ctrlLegalDefaultInfo2_TxtCompanyDateRegistration:
        this.currentState?.CompanyDateRegistrationField.currentVal || '',
      ctrlLegalDefaultInfo2_TxtCompanyInn: this.currentState?.CompanyInnField.currentVal,
      ctrlLegalDefaultInfo2_TxtCompanyKpp: this.currentState?.CompanyKppField.currentVal,
      ctrlLegalDefaultInfo2_TxtCompanyName: this.currentState?.CompanyNameField.currentVal,
      ctrlLegalDefaultInfo2_TxtCompanyOgrn: this.currentState?.CompanyOgrnField.currentVal,
      ctrlLegalDefaultInfo2_TxtCompanyOkpo: this.currentState?.CompanyOkpoField.currentVal,
      ctrlPersonDefaultInfo1_CtrlFio: JSON.stringify(
        this.currentState?.FioPerson?.Value.ComplexValue,
      ),
      ctrlPersonDefaultInfo1_CtrlLivingPlace: JSON.stringify(
        this.currentState?.LivingPlace?.Value?.ComplexValue,
      ),
      ctrlContactPersons_Contacts: JSON.stringify(
        this.currentState?.ContactPersonsInfo?.Collection,
      ),
      ctrlPersonDefaultInfo1_DateBirthday: this.currentState?.DateBirthdayField?.currentVal,
      ctrlSubCat: this.currentState?.FinSubCategoryField.currentVal,
      ddlCategory: this.currentState?.CategoryField.currentVal,
      ddlClientsGroup: this.currentState?.ClientsGroupField.currentVal,
      ddlDeliveryType: this.currentState?.DeliveryTypeField.currentVal,
      ddlLegalStatus: this.currentState?.LegalStatusField.currentVal,
      infoAnketa: JSON.stringify(this.currentState?.AnketaPanel?.Value?.ComplexValue),
      infoBankPerson: JSON.stringify(this.currentState?.BankPersonInfo?.Value?.ComplexValue),
      infoBonusCard: JSON.stringify(this.currentState?.BonusCardInfo?.Value?.ComplexValue),
      lstCards: JSON.stringify(this.currentState?.BankCardsInfo?.Collection),
      infoDriverLicence: JSON.stringify(this.currentState?.DriverLicenceInfo?.Value?.ComplexValue),
      txtBonus: this.currentState?.BonusField.currentVal,
      txtCode1: this.currentState?.Code1Field.currentVal,
      txtCode2: this.currentState?.Code2Field.currentVal,
      txtCodeWord: this.currentState?.CodeWordField.currentVal,
      txtComment: this.currentState?.CommentField.currentVal,
      txtCompanyDefaultSignerLawBase:
        this.currentState?.CompanyDefaultSignerLawBaseField.currentVal,
      txtCompanyDefaultSignerPosition:
        this.currentState?.CompanyDefaultSignerPositionField.currentVal,
      txtCompanyMainActivity: this.currentState?.CompanyMainActivityField.currentVal,
      txtCompanyPlaceOKSMCode: this.currentState?.CompanyPlaceOKSMCodeField.currentVal,
      txtCreditRaiting: this.currentState?.CreditRaitingField.currentVal,
      txtDiscount: this.currentState?.DiscountField.currentVal,
      txtINN: this.currentState?.InnField.currentVal,
      txtIPDateReg: this.currentState?.IPDateRegField.currentVal,
      txtInitialBonuses: this.currentState?.InitialBonusesField.currentVal,
      txtInitialPersonalAccount: this.currentState?.InitialPersonalAccountField.currentVal,
      txtInitialProfit: this.currentState?.InitialProfitField.currentVal,
      txtIntegrationId: this.currentState?.IntegrationIdField.currentVal,
      txtMail: this.currentState?.MailField.currentVal,
      txtNotifyNumber: this.currentState?.NotifyNumberField.currentVal,
      txtOgrnIp: this.currentState?.OgrnIpField.currentVal,
      txtOkved: this.currentState?.OkvedField.currentVal,
      txtSingleContractDate: this.currentState?.SingleContractDateField.currentVal,
      txtSingleContractNumber: this.currentState?.SingleContractNumberField.currentVal,
      txtSingleContractTitle: this.currentState?.SingleContractTitleField.currentVal,
      txtSnils: this.currentState?.SnilsField.currentVal,
      InsertedExistClientAfterCheckPassport: this.AfterCheckPassport,
    } as IClientValidateVals
  }

  public async update() {
    return new Promise((resolve, reject) => {
      const state = cloneDeep(this.currentState)
      // ручками формируем значения для отправки обьекта из id
      function transformData(obj) {
        const result = {}

        // Извлекаем ключ и значение
        const key = obj.Code || obj.id // Можно адаптировать под разные поля
        if (!key) return result // Пропускаем, если ключа нет
        // Если Value отсутствует, преобразуем объект в строку
        result[key] = obj
        return result
      }

      function transformState(state) {
        const result = {}

        Object.entries(state).forEach(([key, value]) => {
          const transformed = transformData(value)

          // Если transformData вернул объект с новым ключом
          if (typeof transformed === 'object' && Object.keys(transformed).length === 1) {
            const [newKey, newValue] = Object.entries(transformed)[0]
            result[newKey] = 'this.currentState?.' + key + '.currentVal'
          } else {
            // Если transformData не преобразовал (нет Code или Id), сохраняем как есть
          }
        })

        return result
      }

      const Vals = this.getUpdateVals()
      if (!Vals) {
        reject('No data to update')
        return
      }

      ClientUpdate({ ObjectId: this.id < 0 ? -1 : this.id, Vals })
        .then((result) => {
          if (result?.data) {
            // If update is successful
            resolve(result.data)
          } else {
            reject('Update failed')
          }
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }
  public async Validate() {
    return new Promise((resolve, reject) => {
      const Vals = this.getUpdateVals()
      if (!Vals) {
        reject('No data to update')
        return
      }
      // Step 1: Validate the data
      ClientValidate({
        Vals,
        Id: this.id < 0 ? -1 : this.id,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('ClientAdd -> ClientValidate, error or no data', error)
            reject(error)
            return
          }
          if (!data.TotalOk) {
            const invalidFields = Object.values(data.Results)
              .filter((errorField) => {
                if (errorField.ErrorCode === -1) return false
                if (errorField.ErrorCode >= 0 && !errorField.IsRequired) return false
                return true
              })
              .reduce(
                (acc, errorField) => {
                  acc[errorField.FieldCode] = {
                    code: errorField.FieldCode,
                    reason: errorField.ErrorDesription,
                    title: errorField.FieldTitle,
                    error: errorField.ErrorCode,
                    isRequired: errorField.IsRequired,
                  }
                  return acc
                },
                {} as Record<
                  string,
                  {
                    code: string
                    reason: string
                    title: string
                    error: ValidErrorCodes
                    isRequired?: boolean
                  }
                >,
              )
            console.error('Error when validate', invalidFields)
            reject(invalidFields)
            return
          } else {
            resolve([])
            return
          }
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }
  public async CheckSameInnClients() {
    return new Promise((resolve, reject) => {
      const Vals = this.getUpdateVals()
      if (!Vals) {
        reject('No data to update')
        return
      }
      // Step 1: Validate the data
      ClientCheckSameInnClients({
        Vals,
        Id: this.id < 0 ? -1 : this.id,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('Client -> CheckSameInnClients, error or no data', error)
            reject(error)
            return
          }
          if (data.SameClientsExist) {
            console.error('Error when check', data.ClientsTable)
            resolve(data.ClientsTable)
            return
          } else {
            resolve(false)
            return
          }
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }
  public async CheckSamePassportClients() {
    return new Promise((resolve, reject) => {
      const Vals = this.getUpdateVals()
      if (!Vals) {
        reject('No data to update')
        return
      }
      // Step 1: Validate the data
      ClientCheckSamePassportClients({
        Vals,
        Id: this.id < 0 ? -1 : this.id,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('Client -> CheckSamePassportClients, error or no data', error)
            reject(error)
            return
          }
          if (data.SameClientsExist) {
            console.error('Error when check', data.ClientsTable)
            resolve(data.ClientsTable)
            return
          } else {
            resolve(false)
            return
          }
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }
}
