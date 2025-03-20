import type {
  ExtendedSimpleColoredObjectDto,
  IClient,
  IObjectDto,
  LiteViewBlockField,
} from './Object'
import type { ObjectField } from './ObjectFields'
import type { IClientContact } from '@/core/interface/ClientContact'

export interface IMetaDataGroup {
  Code: string
  Title: string
  HideTitle: boolean
  AggregateValue: string
  Detailing: string
  GroupType: number
  Fields: LiteViewBlockField[]
  LinkedBaseObject: null
}

export interface IContactGroup {
  Code: string
  Title: string
  Fields: LiteViewBlockField[]
}

export interface StatisticPanel {
  Title: string
  Code: string
  Value: string
  CustomColor: string
  SystemColor: number
  IsBold: false
  FieldType: number
  Detailing: string
  ColSpan: number
}

export interface ClientMetricGroup {
  Title: string
  HideTitle: boolean
  Code: string
  Detailing: string
  AggregateValue: string
  GroupType: number
  Fields: ExtendedSimpleColoredObjectDto[]
  LinkedBaseObject: null
}

export interface PrimaryClientMetrics {
  Title: string
  Code: string
  DataLoaded: boolean
  LinkedObjectId: number
  LinkedObjectType: number
  Groups: ClientMetricGroup[]
}

export interface ClientLocation {
  SubjectCode: number | null
  SubjectName: string | null
  RegionCode: number | null
  RegionName: string | null
  RegionTz: number | null
  City: string | null
}

export enum TimeReminderGroup {
  time_reminder_great_now = 'time_reminder_great_now',
  time_reminder_less_now = 'time_reminder_less_now',
}

export enum RecipientReminderGroup {
  users_reminder = 'users_reminder',
  roles_reminder = 'roles_reminder',
}
export interface IExtendedClientContact extends IClientContact {
  nameForSelectValue: string
}
export interface IRequestDto extends IObjectDto {
  activeStepTabIndex?: number
  DealProfitPanel: StatisticPanel
  DealSumPanel: StatisticPanel
  DealProfitPercent: number
  FilialField: ObjectField
  Client: IClient
  ClientLocation: ClientLocation
  ClientTime: string
  ContactGroups: IContactGroup[]
  MetaDataGroups: IMetaDataGroup[]
  MetaDataPercent: number
  UserIds: number[]
  SessionField: ObjectField
  WorkingStateField: ObjectField
  RefuseStateField: ObjectField
  SourceField: ObjectField
  RequestTypeField?: ObjectField
  SourceDetailField: ObjectField
  PromocodeField: ObjectField
  RecipientReminderField: ObjectField
  CommentField: ObjectField
  PrimaryClientMetricts: PrimaryClientMetrics
  PartnerField: ObjectField
  ResponsibleUsersField: ObjectField
  TimeReminderField: ObjectField
}

export interface RequestReminderPayload {
  Checked: boolean
  IsExactTime: boolean
  dtExact: string
  dateRemind: string
  ddlTimeRemind: string
  UsersIds: string
  RolesIds: string
}
export interface RequestNewContactsPayload {
  contact: IClientContact | null
  number: string | null
  error: string | null
}
