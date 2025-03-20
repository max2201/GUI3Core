import type { IObjectDto } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetAsyncBlockInfo, GetObjectDto } from '@/core/api/object.api'
import type { IObjectFlag } from '@/core/interface/Object'
import { CallUpdate, CallValidate } from '@/core/api/calls.api'
import type { RequestReminderPayload } from '@/core/interface/Requests'
import type { CallValidateVals } from '@/core/api/calls.api'

export class CallEditObject extends BaseObject {
  private reminder?: RequestReminderPayload
  public ModuleId = 'TelephonyModule'

  constructor(id: number, objectDTO?: IObjectDto) {
    super(id, objectDTO)
    this.id = id
    this.type = BaseObjectType.Call

    if (objectDTO) {
      this.rawData = cloneDeep(toRaw(unref(objectDTO)))
      this.currentState = reactive(cloneDeep(toRaw(unref(objectDTO))) as IObjectDto)
    }
  }

  public checkExist() {
    return Boolean(this.rawData)
  }

  public async loadData() {
    return GetObjectDto({
      ObjectId: this.id,
      ModuleId: this.ModuleId,
      BaseObjectType: BaseObjectType.Call,
      DtoViewType: DtoObjectViewType.PrimaryEdit,
    }).then(async ({ data, error }) => {
      if (!data || error) {
        console.error('CallObject -> loadInfo -> Cant load GetObjectDto', error)
        return
      }
      // модифицирую поле комментария свойством по которому отслеживается режим редактирования
      const modifiedData = {
        ...data,
        ClientComment: {
          ...data?.ClientComment,
          editing: false,
          initialValue: data?.ClientComment?.Value,
        },
      }
      this.rawData = modifiedData
      this.currentState = reactive(cloneDeep(modifiedData))
      return modifiedData
    })
  }

  public async loadAsyncBlockData(blockCode: string, ModuleId: string = '') {
    if (this.currentState?.[blockCode]) {
      try {
        const { data, error } = await GetAsyncBlockInfo({
          BaseObjectId: this.currentState[blockCode].LinkedObjectId,
          ModuleId,
          BaseObjectType: this.currentState[blockCode].LinkedObjectType,
          BlockCode: this.currentState[blockCode].Code,
        })
        if (!data || error) {
          console.log('Ошибка при загрузке дополнительной информации: ', error)
          return
        }
        Object.assign(this.currentState[blockCode], data)
      } catch (error) {
        console.error('Error loading async block info', error)
      }
    }
  }

  public getCurrentState(): IObjectDto | null {
    return this.currentState || null
  }

  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }

  private getUpdateVals() {
    const authStore = useAuthStore()
    const { user } = storeToRefs(authStore)

    const linkedObjects = this.currentState!.AdditionalInfo.DataLoaded
      ? this.currentState!.AdditionalInfo.Groups.reduce((acc, group) => {
          acc[group.Code] = group.LinkedBaseObject?.BaseObjectId
            ? group.LinkedBaseObject.BaseObjectId
            : undefined

          return acc
        }, {})
      : undefined

    return {
      // комментарий
      txtComment: this.currentState!.Comment.currentVal,
      // Предмет разговора
      CallSubject: this.currentState!.CallSubject.currentVal,
      // напоминание
      ctrlRemindersPanel_Checked: this.reminder?.Checked || false, // галочка что включено создание напоминания
      ctrlRemindersPanel_IsExactTime: this.reminder?.IsExactTime || false, // флаг, что передается точное время напоминания
      ctrlRemindersPanel_dtExact: this.reminder?.dtExact || undefined, // точное время напоминания
      ctrlRemindersPanel_dateRemind: this.reminder?.dateRemind || undefined, // дата напоминания (при режиме с задержкой)
      ctrlRemindersPanel_ddlTimeRemind: this.reminder?.ddlTimeRemind || undefined, // задержка (при режиме с задержкой)
      ctrlRemindersPanel_UsersIds: this.reminder?.UsersIds || undefined, // список id получателей уведомления
      ctrlRemindersPanel_RolesIds: this.reminder?.RolesIds || undefined, // список id ролей получателей уведомления
      // Клиент
      chbNotClient: false,

      infoClient_ClientID: this.currentState!.Client?.BaseObjectId,
      infoClient_ClientName: this.currentState!.Client?.BaseObjectName,
      infoClient_ClientType: this.currentState!.Client?.BaseObjectType,
      linkedClient_DisplayName: this.currentState!.Client?.BaseObjectName,
      linkedClient_ID: this.currentState!.Client?.BaseObjectId,
      // Контакт
      InfoContact_ClientID: undefined,
      InfoContact_ClientName: undefined,
      InfoContact_ClientType: undefined,
      // Телефоны
      ctrlPhones_ContactPersons: '[]',
      ctrlPhones_ResultPhones: this.currentState!.ClientPhonesJson,
      //   Заявка\договор
      CurrentRequestId: linkedObjects?.Request || undefined,
      CurrentContractId: linkedObjects?.Contract || undefined,
      IsProcessRequest: !!linkedObjects?.Request,

      FilialCode: user.value?.CurrentFilial, //текущий филиал
      // Флаги
      FlagsChanged: false,
      ctrlEventManager_Flags: undefined,

      chbProcessAllLinkedCalls: false,
      isManualClosing: true,
    } as CallValidateVals
  }

  public async update() {
    return new Promise((resolve, reject) => {
      const Vals = this.getUpdateVals()

      CallValidate({
        ObjectId: this.id,
        Vals,
      })
        .then(({ data, error }) => {
          if (!data || error) {
            console.error('CallEditPage -> CallValidate, error or no data', error)
            reject([])
            return
          }

          if (!data.TotalOk) {
            console.error('Error when validate', data)
            Object.values(data.Results).forEach((errorField) => {
              if (errorField.ErrorCode === -1) return
              if (errorField.ErrorCode === 1 && !errorField.IsRequired) return

              console.log(
                errorField.IsRequired,
                errorField.FieldCode,
                '\n',
                errorField.FieldTitle,
                ':',
                errorField.ErrorCode,
                '\n',
                errorField.Value,
                '\n',
                errorField.ErrorDesription,
                '\n',
              )
            })
            reject(Object.values(data.Results))
            return
          }

          CallUpdate({
            ObjectId: this.id,
            BaseObjectType: this.type,
            Vals,
          })
            .then(({ data: updateData, error: updateError }) => {
              if (!updateData || updateError) {
                console.error('CallEditPage -> CallUpdate, error or no data', updateError)
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
        .catch(() => {
          reject([])
        })
    })
  }

  public setReminder(reminder?: RequestReminderPayload) {
    this.reminder = reminder
  }
}
