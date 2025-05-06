import { BaseObjectType } from '../constants/BaseObjectType'
import { BaseObject } from '../model/BaseObject'
import type { IObjectDto } from './Object'
import type { LockingObject } from '@/core/interface/LockingObject'

export interface IOpenWindowTabPayload {
  id: number
  title: string
  color?: string
  type: BaseObjectType
  object: BaseObject<any>
}

export interface IWindowTab {
  id: number
  title: string
  color?: string
  type: BaseObjectType
  object: BaseObject<any>
  objectEdit?: BaseObject<any>
  contentTab: number
  editMode: boolean
}
