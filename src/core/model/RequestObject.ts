import type { IObjectFlag } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetObjectDto } from '@/core/api/object.api'
import type {
  IRequestDto,
  RequestNewContactsPayload,
  RequestReminderPayload,
} from '@/core/interface/Requests'
import type { ObjectStepsForm } from '@/composables/use-object-field-services'
import {
  AddRequests,
  AddRequestValidate,
  RequestGetSteps,
  RequestsUpdate,
  RequestsUpdateAdditionalData,
  RequestValidate,
  type RequestValidateVals,
  StepsValidate,
  type StepsValidateVals,
  ValidateStepsValidate,
} from '@/core/api/requests.api'
import { FieldGroupStates } from '@/core/constants/FieldGroupStates'

export class RequestObject extends BaseObject<IRequestDto> {
  public rawData?: IRequestDto
  public currentState?: IRequestDto
  private stepsState?: ObjectStepsForm
  private editTime?: string
  private reminder?: RequestReminderPayload
  private newContactForm?: RequestNewContactsPayload
  private Changes?: String
  public ModuleId = 'RequestsModule'
  constructor(id: number, objectDTO?: IRequestDto) {
    super(id, objectDTO)

    this.id = id
    this.type = BaseObjectType.Requst

    if (objectDTO) {
      this.rawData = cloneDeep(toRaw(unref(objectDTO)))
      this.currentState = reactive(cloneDeep(toRaw(unref(objectDTO))) as IRequestDto)
    }
  }

  public checkExist() {
    return Boolean(this.rawData)
  }

  public async loadData() {
    if (this.id < 0) {
      return GetObjectDto({
        ObjectId: -1,
        BaseObjectType: BaseObjectType.Requst,
        ModuleId: this.ModuleId,
        DtoViewType: DtoObjectViewType.PrimaryEdit,
        ReturnEmptyObject: true,
      }).then(({ data, error }) => {
        if (!data || error) {
          return
        }
        const modifiedData = {
          ...data,
          activeStepTabIndex: null,
          // Добавляю шагам свойство по которому определяется режим редактирования
          Steps: data?.Steps?.map((step) => {
            return { ...step, editable: step.FieldGroupState !== FieldGroupStates.EditSuccess }
          }),
        }
        this.rawData = modifiedData as IRequestDto
        this.currentState = reactive(cloneDeep(modifiedData as IRequestDto))
        return modifiedData
      })
    } else {
      return GetObjectDto({
        ObjectId: this.id,
        BaseObjectType: BaseObjectType.Requst,
        DtoViewType: this.id < 0 ? DtoObjectViewType.PrimaryEdit : DtoObjectViewType.PrimaryView,
      }).then(({ data, error }) => {
        if (!data || error) {
          return
        }
        const modifiedData = {
          ...data,
          activeStepTabIndex: null,
          // Добавляю шагам свойство по которому определяется режим редактирования
          Steps: data?.Steps?.map((step) => {
            return { ...step, editable: step.FieldGroupState !== FieldGroupStates.EditSuccess }
          }),
        }
        this.rawData = modifiedData as IRequestDto
        this.currentState = reactive(cloneDeep(modifiedData as IRequestDto))
        return modifiedData
      })
    }
  }

  public getCurrentState(): IRequestDto | null {
    return this.currentState || null
  }

  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }

  public getStepsFormState() {
    return this.stepsState || null
  }

  public setStepsFormState(form: Record<string, any>) {
    this.stepsState = cloneDeep(toRaw(unref(form)))
  }

  public setReminder(reminder?: RequestReminderPayload) {
    this.reminder = reminder
  }
  public setChanges(changes?: string) {
    this.Changes = changes
  }
  public startEditTime(time: string) {
    if (!this.editTime) {
      this.editTime = time
    }
  }

  public stopEditTime() {
    this.editTime = undefined
  }

  private getUpdateVals(stepsValue: string) {
    return {
      callFromWin: false, // вызов из win формы
      infoClient_Client: this.currentState?.Client.BaseObjectId, // заменить на состояние из формы клиента
      infoClient_ClientName: this.currentState!.BaseObjectName, // заменить на состояние из формы клиента
      infoContact_Client: this.currentState?.Client.BaseObjectId || 63441, // id клиента из контрола контакта (который показывается если не является клиентом)
      infoContact_ClientName: this.currentState?.Client.BaseObjectName || '', // имя клиента из контрола контакта (который показывается если не является клиентом)
      infoPartnerState: '[{"PartnerTitle":"источник 1","StringState":"тест"}]', // список данных партнера через PartnerRequestState
      ddlWorkingState: this.currentState!.WorkingStateField.currentVal, // текущий результат
      ddlSource: this.currentState!.SourceField.currentVal, // источник заявки
      ddlFilials: this.currentState!.FilialField.currentVal,
      ddlCanceledText: this.currentState!.RefuseStateField.currentVal, // детализация результата
      txtComment: this.currentState!.CommentField.currentVal, // комментарий
      ctrlPromoCode: this.currentState!.PromocodeField.currentVal,
      txtSourceDetail: this.currentState!.SourceDetailField.currentVal, // детализация источника
      infoSessionId: this.currentState!.SessionField.currentVal, // id сессии
      chbNotClient: false, // галочка, что не является клиентом
      contactsPhones_ResultPhones: null, // телефоны контакта через Phones (который показывается если не является клиентом)
      contactsPhones_ContactPersons: null, // контакты из контрола телефонов контакта через список ContactPerson (который показывается если не является клиентом)
      ctrlPhones_ResultPhones: null, // телефоны клиента через Phones
      ctrlPhones_ContactPersons: null, // контакты из контрола телефонов клиента через список ContactPerson
      stepsPanel_Groups: stepsValue, // список динамических полей через FieldGroupDTO
      Changes: this.Changes || '{}', // список изменений из формы слияния (это пока не реализовано, надо передать пустой список или пустую строку)
      OpeneDateTime: this.editTime, // время когда была открыта форма заявки
      ddlUsers: this.currentState!.ResponsibleUsersField.currentVal, // id ответственных
      ctrlLocationOfClient: JSON.stringify(this.currentState?.ClientLocation || {}), // местоположение клиента через LocationInfo
      ctrlRemindersPanel_Checked: this.reminder?.Checked || false, // галочка что включено создание напоминания
      ctrlRemindersPanel_IsExactTime: this.reminder?.IsExactTime || false, // флаг, что передается точное время напоминания
      ctrlRemindersPanel_dtExact: this.reminder?.dtExact || null, // точное время напоминания
      ctrlRemindersPanel_dateRemind: this.reminder?.dateRemind || null, // дата напоминания (при режиме с задержкой)
      ctrlRemindersPanel_ddlTimeRemind: this.reminder?.ddlTimeRemind || null, // задержка (при режиме с задержкой)
      ctrlRemindersPanel_UsersIds: this.reminder?.UsersIds || null, // список id получателей уведомления
      ctrlRemindersPanel_RolesIds: this.reminder?.RolesIds || null, // список id ролей получателей уведомления
    } as RequestValidateVals
  }
  private getCreateVals(stepsValue: string) {
    return {
      callFromWin: false, // вызов из win формы
      infoClient_Client: this?.newContactForm?.contact?.Id,
      infoClient_ClientName: '',
      infoContact_ClientName: '',
      infoContact_Client: -1, // id клиента из контрола контакта (который показывается если не является клиентом)
      infoPartnerState: '[{"PartnerTitle":"источник 1","StringState":"тест"}]', // список данных партнера через PartnerRequestState
      ddlWorkingState: this.currentState?.WorkingStateField.currentVal || -1, // текущий результат
      ddlSource: this.currentState?.SourceField.currentVal || '', // источник заявки
      ddlFilials: this.currentState?.FilialField.currentVal || '',
      ddlCanceledText: this.currentState!.RefuseStateField.currentVal || '', // детализация результата
      txtComment: this.currentState!.CommentField.currentVal, // комментарий
      txtSourceDetail: this.currentState!.SourceDetailField.currentVal || '', // детализация источника
      ddlRequestType: this.currentState!.RequestTypeField?.currentVal || '',
      chbNotClient: false, // галочка, что не является клиентом
      contactsPhones_ResultPhones: null, // телефоны контакта через Phones (который показывается если не является клиентом)
      contactsPhones_ContactPersons: null, // контакты из контрола телефонов контакта через список ContactPerson (который показывается если не является клиентом)
      ctrlPhones_ResultPhones: null, // телефоны клиента через Phones
      ctrlPhones_ContactPersons: null, // контакты из контрола телефонов клиента через список ContactPerson
      stepsPanel_Groups: stepsValue, // список динамических полей через FieldGroupDTO
      Changes: this.Changes || '{}', // список изменений из формы слияния (это пока не реализовано, надо передать пустой список или пустую строку)
      OpeneDateTime: this.editTime,
      ctrlLocationOfClient: JSON.stringify(this.currentState?.ClientLocation || {}), // местоположение клиента через LocationInfo
      ctrlRemindersPanel_Checked: this.reminder?.Checked || false, // галочка что включено создание напоминания
      ctrlRemindersPanel_IsExactTime: this.reminder?.IsExactTime || false, // флаг, что передается точное время напоминания
      ctrlRemindersPanel_dtExact: this.reminder?.dtExact || null, // точное время напоминания
      ctrlRemindersPanel_dateRemind: this.reminder?.dateRemind || null, // дата напоминания (при режиме с задержкой)
      ctrlRemindersPanel_ddlTimeRemind: this.reminder?.ddlTimeRemind || null, // задержка (при режиме с задержкой)
      ctrlRemindersPanel_UsersIds: this.reminder?.UsersIds || null, // список id получателей уведомления
      ctrlRemindersPanel_RolesIds: this.reminder?.RolesIds || null, // список id ролей получателей уведомления
    } as RequestValidateVals
  }
  // TODO: Оптимизировать и  добавить валидацию
  public async UpdateAdditionalData(Vals) {
    return new Promise((resolve, reject) => {
      RequestsUpdateAdditionalData({
        ObjectId: this.id,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error(
              'RequestMainPage -> RequestsUpdateAdditionalData, error or no data',
              error,
            )
            reject([])
            return
          }

          this.rawData = toRaw(this.currentState)
          resolve(this.currentState)
        })
        .catch(() => {
          reject([])
        })
    })
  }
  public async GetSteps(Vals) {
    return new Promise((resolve, reject) => {
      RequestGetSteps({
        ObjectId: this.id,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('GetSteps -> GetSteps, error or no data', error)
            reject([])
            return
          }
          this.currentState.Steps = data
          this.rawData.Steps = data
          resolve(this.currentState)
        })
        .catch(() => {
          reject([])
        })
    })
  }
  public async ValidateRequest(stepsValue?: string) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const vals = this.getUpdateVals(steps)
      const Vals: StepsValidateVals = vals as RequestValidateVals
      RequestValidate({
        ObjectId: -1,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('RequestMainPage -> RequestsValidate, error or no data', error)
            reject([])
            return
          }
          if (!data.TotalOk) {
            const invalidFields = Object.values(data.Results)
              .filter((errorField) => {
                if (errorField.ErrorCode === -1) return false
                if (errorField.ErrorCode === 1 && !errorField.IsRequired) return false
                return true
              })
              .reduce(
                (acc, errorField) => {
                  acc[errorField.FieldCode] = {
                    code: errorField.FieldCode,
                    reason: errorField.ErrorDesription,
                    title: errorField.FieldTitle,
                  }
                  return acc
                },
                {} as Record<string, { code: string; reason: string }>,
              )
            console.error('Error when validate', invalidFields)
            reject(invalidFields)
            return
          } else {
            resolve([])
            return
          }
        })
        .catch(() => {
          reject([])
          return
        })
    })
  }
  public async ValidateStepsValidate(stepsValue?: string, validateFirstStep: boolean = false) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const vals = this.getCreateVals(steps)
      const Vals: StepsValidateVals = vals as RequestValidateVals
      Vals.validateFirstStep = validateFirstStep
      ValidateStepsValidate({
        ObjectId: -1,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('RequestMainPage -> RequestsValidate, error or no data', error)
            reject([])
            return
          }
          if (!data.TotalOk) {
            const invalidFields = Object.values(data.Results)
              .filter((errorField) => {
                if (errorField.ErrorCode === -1) return false
                if (errorField.ErrorCode === 1 && !errorField.IsRequired) return false
                return true
              })
              .reduce(
                (acc, errorField) => {
                  acc[errorField.FieldCode] = {
                    code: errorField.FieldCode,
                    reason: errorField.ErrorDesription,
                    title: errorField.FieldTitle,
                  }
                  return acc
                },
                {} as Record<string, { code: string; reason: string }>,
              )
            console.error('Error when validate', invalidFields)
            reject(invalidFields)
            return
          } else {
            resolve([])
            return
          }
        })
        .catch(() => {
          reject([])
          return
        })
    })
  }
  public async update(stepsValue?: string) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const Vals = this.getUpdateVals(steps)

      RequestsUpdate({
        ObjectId: this.id,
        BaseObjectType: this.type,
        Vals,
      })
        .then(({ data: updateData, error: updateError }) => {
          if (!updateData || updateError) {
            console.error('RequestMainPage -> RequestsUpdate, error or no data', updateError)
            reject([])
            return
          }

          this.rawData = toRaw(this.currentState)
          resolve(this.currentState)
        })
        .catch(() => {
          reject([])
        })
    })
  }
  public async Create(stepsValue?: string) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const Vals = this.getCreateVals(steps)

      AddRequests({
        ObjectId: this.id,
        BaseObjectType: this.type,
        Vals,
      })
        .then(({ data: updateData, error: updateError }) => {
          if (!updateData || updateError) {
            console.error('RequestMainPage -> RequestsUpdate, error or no data', updateError)
            reject([])
            return
          }
          this.id = updateData.id
          resolve(updateData)
        })
        .catch(() => {
          reject([])
        })
    })
  }
  public async validateSteps(stepsValue?: string, validateFirstStep: boolean = false) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const vals = this.getCreateVals(steps)
      const Vals: StepsValidateVals = vals as RequestValidateVals
      Vals.validateFirstStep = validateFirstStep
      StepsValidate({
        ObjectId: -1,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('RequestMainPage -> RequestsValidate, error or no data', error)
            reject(error)
            return
          }
          if (data.ErrorFieldCodes.length > 0) {
            console.error('Error when validate', data)
            resolve(data)
            return
          } else resolve(data)
        })
        .catch(() => {
          reject([])
          return
        })
    })
  }
  public async validateCreate(stepsValue?: string) {
    return new Promise((resolve, reject) => {
      const steps = stepsValue || JSON.stringify(this.rawData?.Steps)
      const Vals = this.getCreateVals(steps)
      AddRequestValidate({
        ObjectId: -1,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('RequestMainPage -> RequestsValidate, error or no data', error)
            reject([])
            return
          }
          if (!data.TotalOk) {
            const invalidFields = Object.values(data.Results)
              .filter((errorField) => {
                if (errorField.ErrorCode === -1) return false
                if (errorField.ErrorCode === 1 && !errorField.IsRequired) return false
                return true
              })
              .reduce(
                (acc, errorField) => {
                  acc[errorField.FieldCode] = {
                    code: errorField.FieldCode,
                    reason: errorField.ErrorDesription,
                    title: errorField.FieldTitle,
                  }
                  return acc
                },
                {} as Record<string, { code: string; reason: string }>,
              )
            console.error('Error when validate', invalidFields)
            reject(invalidFields)
            return
          } else {
            resolve([])
            return
          }
        })
        .catch(() => {
          reject([])
          return
        })
    })
  }
}
