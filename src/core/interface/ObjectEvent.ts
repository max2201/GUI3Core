import type { IFileUploadResult } from '@/core/interface/Files'

export interface IObjectEvent {
  MasterObjectType: number
  MasterObjectId: number
  SlaveObjectType: number
  SlaveObjectId: string
  SlaveObjectTitle: string
  IsImportant: boolean
  NotFound: boolean
  SubTasks: any[]
  Loaded: boolean
  Id: number
  ClientId: string // uuid
  SystemId: number
  Object1: number
  Object2: number
  Object3: number
  Title: string
  ParentId: number
  CreationTime: string // date
  State: number
  ResultState: number
  StartTime: string // date
  EndTime: string // date
  TimerTime: string // date
  CurrentSeconds: number
  AproximateSeconds: number
  FactSeconds: number
  OwnerId: number
  OwnerTitle: string
  EmployeeId: number
  EmployeeTitle: string
  Description: string // JSON
  ResultComment: string
  LastError: string
  ErrorTrace: string
}

export interface IObjectEventFieldChange {
  FiledGroupName: string
  FiledName: string
  OldValue: any
  NewValue: any
  OldShortValue: string
  NewShortValue: string
}

export interface IObjectEventDescription {
  Changes?: IObjectEventFieldChange[]
  IsActive?: boolean
  Message?: string
  MessageText?: string
  Text?: string
  Notification?: any
  Images?: IFileUploadResult[]
  Id?: number
  SlaveObject1Type?: number
  LinkedObjectType?: number
  OpenedObjectType?: number
  ClientCode?: number
  ClientName?: string
  RequestCode?: number
  RequestName?: string
  ContractCode?: number
  ContractName?: string
  Flags?: any[]
  UserCode?: number
  UserName?: string
  ModeratorCode?: number
  ModeratorName?: string
  CallRecordStr?: string
  CallSubjectStr?: string
  CallSubject?: number
  ExternalNumber?: string
  FromNumber?: {
    extension: string
    number: string
    line_number: string
    taken_from_call_id: string
  }
  ToNumber?: {
    extension: string
    number: string
    line_number: string
    taken_from_call_id: string
  }
  CallState?: number
  CallStateProcessed?: number
  CallDirection?: number
  CreatedDateTime?: string
  AppearedDateTime?: string
  ConnectedDateTime?: any
  DisconnectedDateTime?: string
  TalkDuration?: string
  Comment?: string
}
