import type { IClient } from './Object'

export type SortingDirectionType = 'DESC' | 'ASC'

export interface ISelect {
  label: string
  value: string | number
}

export interface INavLink {
  to: string
  id: string
  viewId?: string
  fullViewId: string
  icon: string
  label: string
  isActive: boolean
  isFavorite: boolean
  isPassive?: boolean
}

export interface UiCallCard {
  id: number
  icon: string
  callType: string
  date: string
  time: string
  callerName: string
  callStatus: string
  phoneNumber: string
  actionType: string
  viewed: boolean
  bottom: string
  zIndex: number
}

export interface UiNotificationsBar {
  count: number
  type: number
  newCount: number
  iconType: string
}

export interface UiNotificationsGroupItem {
  id: number
  title: string
  day: string
  time: string
  author: string
  hintAuthor: string
  client: string
  clientData: IClient
  text?: string
  hintText?: string
  objectType?: number
  objectId?: number
  valueType?: number
  notificationType?: number
  groupType?: number
  quickDeleteAvailable: boolean
}
