import type { IObjectFlag } from './Object'
import type { IModuleStateColumn, IRowDto } from '@/core/interface/Module'

export interface ILoginDto {
  UserProfile: IUserProfileDto
}

export interface ModuleDictionaryValue {
  Title: string
  IsSystem: boolean
  Code: string
  ColorCode: string
  Index: number
  LeftBorder: number
  RightBorder: number
  Value1: string | number
  Value2: string | number
  Value3: string | number
  Value4: string | number
}

export interface IAvailableDictionary {
  Code: string
  IsSystem: boolean
  Title: string
  Values: ModuleDictionaryValue[]
}
export enum GroupActionResultTypes {
  Untyped = -1,
  Table = 0,
  Bool = 1,
  Link = 2,
}
export interface IGroupActionInfo {
  Title: string
  Icon: string
  Operation: string
  IsCodeConfirmation: boolean
  GroupActionResultTypes: GroupActionResultTypes
  SystemColor: number
}
export interface IUserAvailableModule {
  Id: string
  FullViewId: string
  ViewId: string
  TabName: string
  PageSize: number
  SortedColumn: string
  SortedDirection: number
  CurrentColumns: IModuleStateColumn[]
  CurrentRows: IRowDto[]
  Filter: IModuleFilter | null
  AvailableDictionaries: IAvailableDictionary[]
  AvailableGroupActions: IGroupActionInfo[]
  AvailableContextView: boolean
}

export interface IChatTemplate {
  BaseObjectType: number
  BaseObjectId: number
  BaseObjectName: string
  BaseObjectDate: string
}

export interface IUserProfileDto {
  OrganizationId: number
  PartnerCode: string
  CurrentUserId: number
  CurrentUserLogin: string
  CurrentUserToken: string
  CurrentUserName: string
  CurrentFilial: number
  CurrentFilialTitle: string
  PersonalDataAccessLevel: number
  ClientsDataReadingAcessLevel: number
  ContractsDataReadingAcessLevel: number
  ContractsFinancialDataAccessLevel: number
  Roles: IRole[]
  RoleIds: string[]
  AdditionalFilials: number[]
  AdditionalSettings: IUserAdditionalSettings
  AviableFilials: IUserAviableFilial[]
  AvaiableFilialsIds: number[]
  AvailableCreationOperations: IUserAvailableCreationOperation[]
  ChatTemplates: IChatTemplate[]
  AvailableModules: IUserAvailableModule[]
  IpAddress: string
  UserFlags: { [key: number]: IObjectFlag[] }
}

export interface FavoriteObject {
  ModuleId: string
  Object: {
    Id: number
    BaseObjectDate: string
    BaseObjectName: string
    BaseObjectType: number
  }
}

export interface IUserAdditionalSettings {
  SaveTelephonySettingsInProfile: boolean
  TelephonyInternalNumber: string
  TelephonyEmployeeId: string
  TelephonyVirtualNumber: string
  TelephonyBeelineSubId: string
  FavoritesModules: string[]
  FavoritesObjects: FavoriteObject[]
}

export interface CurrentColumn {
  Id: string
  Title: string
  Position: number
  Width: number
}

export interface IModuleFilter {
  SmartFilterValue: string
  PrimaryFields: IModuleFilterField[]
  SecondaryFields: IModuleFilterField[]
  FilterId: number | string
  FilterName: string
}

export interface IModuleFilterField {
  id: string
  title: string
  disabled: boolean
  type: FilterFieldTypes
  values: IModuleFilterFieldValue[] | null
  currentVal: string
  defaultVal: string
  subItems: IModuleFilterField[] | null
}

export enum FilterFieldTypes {
  Untyped = 0,
  Text = 1,
  Combobox = 2,
  Date = 3,
  CheckedList = 4,
  FilialsList = 5,
  FilialsCheckedList = 6,
  CheckBox = 7,
  Flags = 8,
  CompanyList = 9,
}

export interface IModuleFilterFieldValue {
  Value: string
  Title: string
}

export interface IUserAviableFilial {
  ID: number
  Title: string
  FilialPrefix: string
  ShortTitle: string
  City: string
  StructName: string
  FilialRegionName: string
  AviableCompaniesIds: number[]
  AviableAllCompanies: boolean
}

export interface IUserAvailableCreationOperation {
  Icon: string
  ModuleId: string
  ObjectType: number
  Title: string
}

export interface IRole {
  Id: string
  RoleName: string
  SettingsManagmentPermitted: boolean
  RolesManagmentPermitted: boolean
  UsersManagmentPermitted: boolean
  UsersManagmentAccessLevel: number
  AllFilialsAccessLevel: number
  PersonalDataAccessLevel: number
  AllModulesAccessPermitted: boolean
  NotificationsManagmentPermitted: boolean
}
