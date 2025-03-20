import type { IObjectDto } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'
import { reactive, toRaw, unref } from 'vue'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { BaseObject } from './BaseObject'
import { GetAsyncBlockInfo, GetObjectDto } from '@/core/api/object.api'
import type { IObjectFlag } from '@/core/interface/Object'
import {
  GetDtoObjectsForCustomTable,
  type GetDtoObjectsForCustomTablePayload,
} from '@/core/api/modules.api'
import { TelephonyModuleId } from '@/core/constants/ModuleId'

export class CallObject extends BaseObject {
  public ModuleId = TelephonyModuleId

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
      BaseObjectType: BaseObjectType.Call,
      ModuleId: this.ModuleId,
      DtoViewType: DtoObjectViewType.PrimaryView,
    }).then(async ({ data, error }) => {
      if (!data || error) {
        console.error('CallObject -> loadInfo -> Cant load GetObjectDto', error)
        return
      }
      // модифицирую поле комментария свойством по которому отслеживается режим редактирования
      const modifiedData = {
        ...data,
        ModeratorComment: {
          ...data?.ModeratorComment,
          editing: false,
          initialValue: data?.ModeratorComment?.Value,
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

  public async loadTableData(datasetMeta) {
    if (this.currentState) {
      try {
        const { data, error } = await GetDtoObjectsForCustomTable({
          BaseObjectId: this.currentState.TableCloseCalls.ContextObjectId,
          ViewId: this.currentState.TableCloseCalls.ViewId,
          PageSize: datasetMeta.limit,
          PageNumber: datasetMeta.page,
          SortColumn: datasetMeta.sort.id,
          SortMode: datasetMeta.sort.dir === 'DESC' ? 1 : 0,
        } as GetDtoObjectsForCustomTablePayload)

        if (!data || error) {
          console.log('Ошибка при загрузке дополнительной информации: ', error)
          return
        }
        this.currentState.TableCloseCalls.CurrentRows = data.Rows

        datasetMeta.count = data.TotalCount
      } catch (error) {
        console.error('Error loading table data', error)
      }
    }
  }

  public getCurrentState(): IObjectDto | null {
    return this.currentState || null
  }

  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }
}
