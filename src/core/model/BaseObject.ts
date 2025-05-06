import { reactive, toRaw, unref } from 'vue'
import { cloneDeep } from 'lodash'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { VerifyAccess } from '@/core/api/access.api'
import { LockObject, ReleaseObject, VerifyLock } from '@/core/api/locking.api'
import { GetObjectDto } from '@/core/api/object.api'
import { AccessVerifyOperationType } from '@/core/constants/AccessVerifyOperationType'
import type { BaseObjectType } from '@/core/constants/BaseObjectType'
import type { IObjectDto, IObjectFlag } from '@/core/interface/Object'
import { FieldGroupStates } from '@/core/constants/FieldGroupStates'
import type { IRequestDto } from '@/core/interface/Requests'
import { RequestsModuleId } from '@/core/constants/ModuleId'

export class BaseObject<T extends IObjectDto> {
  id: number
  type: BaseObjectType

  public rawData?: T
  public currentState?: T

  private isAllowForEdit = false

  constructor(id: number, objectDTO?: T, type?: BaseObjectType) {
    this.id = id
    this.type = objectDTO?.BaseObjectType || type || 0

    if (objectDTO) {
      this.rawData = cloneDeep(toRaw(unref(objectDTO)))
      this.currentState = reactive(cloneDeep(toRaw(unref(objectDTO))) as T)
    }
  }

  get isAllowedForEdit() {
    return this.isAllowForEdit
  }

  public checkExist() {
    return Boolean(this.rawData)
  }

  public checkAccess(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      VerifyAccess({
        TypeOperation: AccessVerifyOperationType.Modify,
        Id: this.id,
        BaseObjectType: this.type,
      })
        .then((verifyResult) => {
          if (!verifyResult?.data || !verifyResult.data.SuccessVerify) {
            this.isAllowForEdit = false
            reject('Ошибка: ' + verifyResult.data?.ErrorMessage)
            return
          }

          this.isAllowForEdit = true
          resolve(true)
        })
        .catch(() => {
          this.isAllowForEdit = false
          reject('Ошибка при попытке проверить доступ')
        })
    })
  }

  public async loadData(): Promise<T | undefined> {
    if (this.id < 0) {
      return GetObjectDto({
        ObjectId: -1,
        BaseObjectType: this.type,
        ModuleId: RequestsModuleId,
        DtoViewType: DtoObjectViewType.PrimaryEdit,
        ReturnEmptyObject: true,
      }).then(({ data, error }) => {
        if (!data || error) {
          console.error('BaseObject -> loadData -> Cannot load GetObjectDto', error)
          return
        }
        this.rawData = data as T
        this.currentState = reactive(cloneDeep(data) as T)

        return data as T
      })
    }
    return GetObjectDto({
      ObjectId: this.id,
      BaseObjectType: this.type,
      DtoViewType: DtoObjectViewType.PrimaryView,
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error('BaseObject -> loadData -> Cannot load GetObjectDto', error)
        return
      }
      this.rawData = data as T
      this.currentState = reactive(cloneDeep(data) as T)

      return data as T
    })
  }

  public async applyChanges(changes: Partial<T>): Promise<void> {
    return new Promise((resolve) => resolve())
  }

  public getCurrentState(): T | null {
    return this.currentState || null
  }

  public getFlags(): IObjectFlag[] {
    return this.currentState?.Flags || []
  }

  public release(): void {
    ReleaseObject({
      LockedObjectId: this.id,
      LockedObjectType: this.type,
    })
  }

  public setFlags(newFlags: IObjectFlag[] | null): void {
    if (this.currentState) {
      this.currentState.Flags = newFlags
    }
  }

  public async lockObject(forceLock: boolean = false): Promise<void> {
    return await LockObject({
      LockedObjectId: this.id,
      LockedObjectType: this.type,
      ForceLock: forceLock,
    })
  }

  public async verifyLockObject(): Promise<void> {
    return await VerifyLock({
      LockedObjectId: this.id,
      LockedObjectType: this.type,
    })
  }

  public async releaseObject(): Promise<void> {
    return await ReleaseObject({
      LockedObjectId: this.id,
      LockedObjectType: this.type,
    })
  }
}
