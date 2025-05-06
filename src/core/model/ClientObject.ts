import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetAsyncBlockInfo, GetObjectDto } from '@/core/api/object.api'
import type { IObjectFlag } from '@/core/interface/Object'
import type { IClientDto, IClientEditDto } from '@/core/interface/Client'
import { AddRequests } from '@/core/api/requests.api'

export class ClientObject extends BaseObject<IClientDto> {
  declare public rawData?: IClientDto
  declare public currentState?: IClientDto
  public isOnlyView: boolean
  public ModuleId = 'ClientsModule'

  constructor(id: number, objectDTO?: IClientDto) {
    super(id, objectDTO, BaseObjectType.Client)
    if (objectDTO) {
      this.rawData = cloneDeep(toRaw(unref(objectDTO)))
      this.currentState = reactive(cloneDeep(toRaw(unref(objectDTO))) as IClientDto)
    }
    this.isOnlyView = false
  }
  public setIsOnlyView(val: boolean) {
    this.isOnlyView = !val
  }
  public async loadData(isEdit?: boolean): Promise<IClientDto | undefined> {
    return GetObjectDto<IClientDto>({
      ObjectId: this.id,
      BaseObjectType: BaseObjectType.Client,
      DtoViewType: !isEdit ? DtoObjectViewType.PrimaryView : DtoObjectViewType.PrimaryEdit,
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error('ClientObject -> loadData -> Cannot load GetObjectDto', error)
        return
      }
      const modifiedData = {
        ...data,
        CommentField: {
          ...data?.CommentField,
          editing: false,
          initialValue: data?.CommentField?.currentVal,
        },
      }
      this.rawData = modifiedData as IClientDto
      this.currentState = reactive(cloneDeep(modifiedData) as IClientDto)
      return modifiedData as IClientDto
    })
  }

  public async loadAsyncBlockData(blockCode: string, ModuleId: string = ''): Promise<void> {
    if (this.currentState?.[blockCode]) {
      try {
        const { data, error } = await GetAsyncBlockInfo({
          BaseObjectId: this.currentState[blockCode].LinkedObjectId,
          ModuleId,
          BaseObjectType: this.currentState[blockCode].LinkedObjectType,
          BlockCode: this.currentState[blockCode].Code,
        })
        if (!data || error) {
          console.log('Error loading async block data:', error)
          return
        }
        Object.assign(this.currentState[blockCode], data)
      } catch (error) {
        console.error('Error loading async block info', error)
      }
    }
  }
  public async Create(newId: number) {
    return GetObjectDto<IClientDto>({
      ObjectId: newId,
      BaseObjectType: BaseObjectType.Client,
      DtoViewType: DtoObjectViewType.PrimaryView,
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error('ClientObject -> loadData -> Cannot load GetObjectDto', error)
        return
      }
      const modifiedData = {
        ...data,
        CommentField: {
          ...data?.CommentField,
          editing: false,
          initialValue: data?.CommentField?.currentVal,
        },
      }
      this.rawData = modifiedData as IClientDto
      this.currentState = reactive(cloneDeep(modifiedData) as IClientDto)
      return modifiedData as IClientDto
    })
  }
  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }
}
