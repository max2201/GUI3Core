import type { IObjectDto } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetObjectDto } from '@/core/api/object.api'
import type { IObjectFlag } from '@/core/interface/Object'

export class ClientObject extends BaseObject {
  constructor(id: number, objectDTO?: IObjectDto) {
    super(id, objectDTO)
    this.id = id
    this.type = BaseObjectType.Client

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
      BaseObjectType: BaseObjectType.Client,
      DtoViewType: DtoObjectViewType.PrimaryView,
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error('ClientObject -> loadInfo -> Cant load GetObjectDto', error)
        return
      }
      // модифицирую поле комментария свойством по которому отслеживается режим редактирования... TODO:в клиенте нужно переделать на бэке это поле
      const modifiedData = {
        ...data,
        CommentField: {
          ...data?.CommentField,
          editing: false,
          initialValue: data?.CommentField?.currentVal,
        },
      }
      this.rawData = modifiedData
      this.currentState = reactive(cloneDeep(modifiedData))
      return modifiedData
    })
  }

  public getCurrentState(): IObjectDto | null {
    return this.currentState || null
  }

  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }
}
