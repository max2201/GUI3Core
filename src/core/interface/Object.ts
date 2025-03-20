import type { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import type { RecognitionResult } from '@/core/constants/RecognitionResult'
import type { ITableRow } from '@/core/interface/Table'
import type { GroupViewTypes } from '@/core/constants/GroupViewTypes'
import { PassportTypes } from '@/core/constants/PassportTypes'

export interface IPhoneCell {
  Title: string
  Phone: string
}

export interface SimpleColoredObjectDto {
  Title: string
  Code: string
  Value: string
  CustomColor: string
  IsBold: boolean
  SystemColor: number
}

export interface ExtendedSimpleColoredObjectDto extends SimpleColoredObjectDto {
  FieldType: number
  Detailing: string
  ColSpan: number
}

export interface IClient {
  BaseObjectId: number
  BaseObjectDate: string
  BaseObjectName: string
  BaseObjectType: number
}

export interface IObjectFlag {
  Title: string
  Color: string
  TemplateId: number
  Code: string
  UserId: number
  UserName: string
  AddingTime: string
  Comment: string
}

export enum ViewFieldTypes {
  Untyped = -1,
  // Простая панель с данными, заголовок + текстовое значение с цветовой разметкой
  SimpleView = 0,
  // Отображение клиента, не путать с обычным отображением базового объекта (вьюха будет другая)
  ClientView = 1,
  // Уведомление
  Notification = 2,
  // Блок обратной связи (телефония, цап, смс и т.д.)
  CallBackBlock = 3,
  // Флаги базового объекта
  Flags = 4,
  // Комментарий
  Comment = 5,
  // Панель отображения базового объекта (клиент, договор и т.д.)
  BaseObjectView = 6,
  // Панель отобажения LiteView блока
  BaseObjectLiteView = 7,
  // Нужен для отображения сводки по объекту. Значение идет под названием панели
  SummaryInfo = 8,
  /// <summary>
  /// Заголовок, значение с цветовой разметкой и подробный текст детализация, который будет открываться по клику.
  /// Например в блоке анализа звонка ИИ
  /// </summary>
  SimpleWithTextDetail = 9,
  /// <summary>
  /// Иконка
  /// </summary>
  Icon = 10,
  /// <summary>
  /// Текст и процент и подробная детализация - основной
  /// </summary>
  TextPercentAndDetailMain = 11,
  /// <summary>
  /// Текст и процент и подробная детализация - для доп.вопросов
  /// </summary>
  TextPercentAndDetailAdditional = 12,
  /// <summary>
  /// Комментарий для лидера разговора в анализе ИИ
  /// </summary>
  CommentLeader = 13,
  /// <summary>
  /// Похож на простой вид, но с икнокой перед Value
  /// </summary>
  SimpleWithIcon = 14,
}

export interface ContextBlockField {
  Title: string
  Code: string
  Value: any
  CustomColor: string
  SystemColor: number
  IsBold: boolean
  FieldType: ViewFieldTypes
  ColSpan: number
}

export interface ContextBlockGroup {
  Code: string
  Title: string
  Fields: ContextBlockField[]
}

export interface LiteViewBlockField {
  Title: string
  Value: string
  Code?: string
  CustomColor?: string
  SystemColor?: number
  IsBold?: boolean
  FieldType: number
  ColSpan?: number
}
export interface DetailingBlockField {
  Title: string
  Value: string
  Code?: string
  CustomColor?: string
  SystemColor?: number
  IsBold?: boolean
  FieldType: number
  ColSpan?: number
  Detailing: string
}

export interface IBaseGroupType {
  Code: string
  Title: string
  HideTitle: boolean
  AggregateValue: string
  Detailing: string
  GroupType: GroupViewTypes
  Fields: unknown
  LinkedBaseObject: null
}

export interface LiteViewBlockGroup {
  Code: string
  Title: string
  Fields: LiteViewBlockField[]
}

export interface ImageInfo {
  fileId: string
  fileError: string
  url: string
  originalName: string
  MimeType: string
  surl: string
  murl: string
  folder: string
  isFolder: string
}

export interface ImagesContaner {
  ObjectId: string
  ObjectType: string
  Images: ImageInfo[]
}

export enum RequestObjectStepFieldType {
  input = 'input',
  text = 'text',
  dropdown = 'dropdown',
}

export const isRequestObjectStepFieldType = (value: string) => {
  return Boolean(RequestObjectStepFieldType[value])
}

export interface IObjectStepField {
  Title: string
  Code: string
  FieldType: RequestObjectStepFieldType | string
  Lng: string
  AviableValues: string
  DamagesValue: string
  ComplexType: string
  ComplexValue: null | any
  Size: number
  IsRequired: boolean
  IsNextProcess: boolean
  IsControl: boolean
  Disabled: boolean
  IsFill: boolean
  Order: number
  Up: boolean
  MacroFieldType: number
  Value: string
  LFOV: boolean
  SubFields?: IObjectStepField[]
  Validator?: string
  DamageValue?: string
}

export interface IUiObjectStepField extends IObjectStepField {
  UiId: string
  error?: boolean
}

export interface IObjectStep {
  Title: string
  Code: string
  Order: number
  ColorCode: string
  IsSecurity: boolean
  CNAF: boolean
  LastUserCode: string
  LastUserName: string
  LastChangedDate: string
  CustomUserRoles: string[]
  Fields: IObjectStepField[]
  FieldGroupState: number
  IsReadyToNextStep: boolean
  editable?: boolean
}

export interface IObjectTableColumn {
  Id: string
  IsColorForAllRow: boolean
  Title: string
  Position: number
  Width: number
  SortProperty: string
}

export interface IObjectTable {
  Id: string
  TabName: string
  ViewId: string
  FullViewId: string
  ContextObjectId: number
  LinkedObjectsType: number
  PageSize: number
  PageNumber: number
  SortedColumn: string
  SortedDirection: number
  CurrentColumns: IObjectTableColumn[]
  CurrentRows: ITableRow[]
  Filter: null
  ModuleFilterCollection: Record<string, any>
}

export interface IObjectDto {
  WindowTitle: string
  BaseObjectId: number
  BaseObjectDate: string
  BaseObjectType: number
  BaseObjectName: string
  DtoViewType: DtoObjectViewType
  Phones: IPhoneCell[]
  Flags: IObjectFlag[] | null
  ContextBlockGroups?: ContextBlockGroup[]
  LiteViewBlockGroups?: LiteViewBlockGroup[]
  Client?: IClient
  Images?: ImagesContaner
  PrimaryBlockGroups?: LiteViewBlockGroup[]
  Steps?: IObjectStep[]
  Tables?: IObjectTable[]
}

export interface IFIOValue {
  Source: string
  Result: string
  ResultGenitive: string
  ResultDative: string
  ResultAblative: string
  LastName: string
  FirstName: string
  MiddleName: string | null
  Gender: number
  RecognitionResult: number
}

export interface IAddressValue {
  region_kladr_id: null | string
  okato: null | string
  region_fias_id: null | string
  area_fias_id: null | string
  city_fias_id: null | string
  street_fias_id: null | string
  house_fias_id: null | string
  settlement_fias_id: null | string
  source: null | string
  result: null | string
  postal_code: null | string
  country: null | string
  country_iso_code: null | string
  federal_district: null | string
  region: null | string
  region_type: null | string
  region_type_full: null | string
  area: null | string
  area_type: null | string
  area_type_full: null | string
  city_area: null | string
  city_district: null | string
  city: null | string
  city_type: null | string
  city_type_full: null | string
  settlement: null | string
  settlement_type: null | string
  settlement_type_full: null | string
  street: null | string
  street_type: null | string
  street_type_full: null | string
  house: null | string
  house_type: null | string
  house_type_full: null | string
  block: null | string
  block_type: null | string
  block_type_full: null | string
  flat_area: null | string
  flat_price: null | string
  flat_type_full: null | string
  flat: null | string
  geo_lat: null | string
  geo_lon: null | string
  qc: null | string
  GeoLink: null | string
  Geo: null | string
  ObjectType: null | string
  ValidationStatus: RecognitionResult
  ValidationStatusString: null | string
  DisplayAddress: string
}

export interface IPassportRf {
  Series: string
  Number: string
  IssuedPlaceNo: string
  IssuedDate: string
  IsFullData: boolean
  IssuedPlace: string
  Birthplace: string
  BirthplaceOKCMCode: string
  BirthplaceOKATOCode: string
  RegisterAddress: IAddressValue
}
export interface IPassportResidence {
  Number: string
  IsFullData: boolean
  IssuedPlace: string
  Birthplace: string
  BirthplaceOKCMCode: string
  BirthplaceOKATOCode: string
  RegistryDate: string
  ExpirationDate: string
  Citizenship: string
  RegisterAddress: IAddressValue
}
export interface IPassportForegin {
  Number: string
  IsFullData: boolean
  IssuedPlace: string
  Birthplace: string
  BirthplaceOKCMCode: string
  BirthplaceOKATOCode: string
  RegistryDate: string
  ExpirationDate: string
  Citizenship: string
  RegisterAddress: IAddressValue
}
export interface IPassportData {
  DocumentType: PassportTypes
  PassportRf?: IPassportRf
  PassportResidence?: IPassportResidence
  PassportForegin?: IPassportForegin
}
