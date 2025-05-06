import type {
  DetailingBlockField,
  IBaseGroupType,
  IClient,
  IMetaDataGroup,
  IObjectDto,
  IObjectTable,
  LiteViewBlockField,
} from './Object'
import type { ObjectField } from './ObjectFields'
import type { IClientContact } from '@/core/interface/ClientContact'
import type { IModuleState } from '@/core/interface/Module'
import { CommandTypes } from '@/core/constants/CommandTypes'
import type { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'

interface Agreement {
  Id: string
  TypeAgreement: number
  AgreementTitle: string
  CompanyId: number
  DateFrom: string // Формат: "DD.MM.YYYY HH:mm:ss"
  DateTo: string // Формат: "DD.MM.YYYY HH:mm:ss"
  Active: boolean
  ManagerId: number
  DogNumber: string
  DogId: number
  ESignId: string
}

interface AgreementsData {
  EmptyObject: Agreement
  Collection: Agreement[]
}
interface AdditionalInfo {
  IsOwnWill: boolean
  IsCivilService: boolean
  IsPublicPeople: boolean
  SourceAboutCompany: string
  IsFirstCompanyContact: boolean
  SecondaryContactReason: string
  IsConsentSurvey: boolean
  IsExistsAuto: boolean
  IsExistsRealty: boolean
  SummaryProfit: number
  SummaryExpenses: number
}
interface Card {
  CardType: number
  ClearingNumber: string
  DisplayNumber: string
  ClientName: string
  IsNotUsing: boolean
  ValidDate: string // Формат: "DD.MM.YYYY HH:mm:ss"
  BankName: string
  IsMainCard: boolean
}

export interface ICardsData {
  EmptyObject: Card
  Collection: Card[]
}
interface ICommand {
  BaseObjectId: number
  BaseObjectType: number
  CommandType: CommandTypes
  CustomView: string
  DtoViewType: DtoObjectViewType
  ModuleId: string
  Title: string
}
export interface ClientPanel extends DetailingBlockField {
  Command?: ICommand
  Value?: any
}
export interface ClientGroupPanel extends IBaseGroupType {
  Command: ICommand
  Fields: ClientPanel[]
}
export interface IPrimaryCurrentClientAccount extends IBaseGroupType {
  Code: string
  DataLoaded: boolean
  LinkedObjectId: number
  LinkedObjectType: number
  MetaInfo?: any
  Title: string
  Groups: ClientGroupPanel[]
}
interface Phone {
  Title: string
  OriginalPhone: string
  DisplayPhone: string
  Comment: string
  IsInternational: boolean
  IsNotification: boolean
  IsMain: boolean
}

interface Client {
  ClientCode: number
  ClientName: string
  FirstPhone: Phone | null
  Type: string
  AddInfo: string
}

export interface IContactPersonsInfo {
  EmptyObject: Client
  Collection: Client[]
}
export interface IPhones {
  EmptyObject: Phone
  Collection: Phone[]
}
export interface Contract {
  Id: string
  SignDate: string | null // Формат: "DD.MM.YYYY HH:mm:ss" или null
  ContractVersion: string | null
  ContractUrl: string | null
  KeyTransport: string | null
  UserSignKey: string | null
  UserSignHash: string | null
  CompanyId: number
}

export interface IContractsData {
  EmptyObject: Contract
  Collection: Contract[]
}
interface ITokens {
  CompanyId: number
  CompanyName: string
  RecurentCode: string
  ServiceCode: string
  Token: string
}
export interface IServiceTokens {
  EmptyObject: ITokens
  Collection: ITokens[]
}
export interface IClientDto extends IObjectDto {
  AdditionalTables: IModuleState[]
  AgreementsInfo: AgreementsData
  Anketa: AdditionalInfo
  BankCardsInfo: ICardsData
  ClientBalancePanel: ClientPanel
  ClientDebetPanel: ClientPanel
  ClientDiscountGroup: ClientGroupPanel
  CommentField: ObjectField
  ContactPersonsInfo: IContactPersonsInfo
  DefaultPaymentCategoryField: ObjectField
  DefaultSubCategoryField: ObjectField
  ESignsInfo: IContractsData
  NotificationsBlockGroup: ClientGroupPanel
  PrimaryBlockGroup: ClientGroupPanel
  Phones: IPhones
  PhotoUrl: string
  CustomCodeGroups: ClientGroupPanel
  PrimaryCurrentClientAccount: IPrimaryCurrentClientAccount
  PrimaryClientMetrics: IPrimaryCurrentClientAccount
  PromoCodeField: ObjectField
  ReverseContactPersonsInfo: IContactPersonsInfo
  ServiceTokens: IServiceTokens
  Tables: IObjectTable[]
}
export interface IClientEditDto extends IObjectDto {
  LegalStatusField: ObjectField
  CategoryField: ObjectField
  LegalTypeField: ObjectField
  CompanyNameField: ObjectField
  CompanyInnField: ObjectField
  CompanyKppField: ObjectField
  CompanyDateRegistrationField: ObjectField
  CompanyOgrnField: ObjectField
  CompanyOkpoField: ObjectField
  CeoPositionField: ObjectField
  MailField: ObjectField
  NotifyNumberField: ObjectField
  DeliveryTypeField: ObjectField
  DateBirthdayField: ObjectField
  AgreeDogovorMessagesField: ObjectField
  AgreeReklamaMessagesField: ObjectField
  DocumentTypeField: ObjectField
  ClientsGroupField: ObjectField
  ApiDisabledField: ObjectField
  BanField: ObjectField
  SexField: ObjectField
  EnabledBonusField: ObjectField
  MobileAppExistsField: ObjectField
  RepairTypeField: ObjectField
  NoMailField: ObjectField
  FinCategoryField: ObjectField
  BonusField: ObjectField
  Code1Field: ObjectField
  Code2Field: ObjectField
  CodeWordField: ObjectField
  OgrnIpField: ObjectField
  InnField: ObjectField
  OkvedField: ObjectField
  SingleContractDateField: ObjectField
  SingleContractNumberField: ObjectField
  SingleContractTitleField: ObjectField
  SnilsField: ObjectField
  CompanyAddress: ClientPanel
  Anketa: AdditionalInfo
  BankCardsInfo: ICardsData
  PhotoId: string
  ClientDocument: any
  ClientDebetPanel: ClientPanel
  ClientDiscountGroup: ClientGroupPanel
  CommentField: ObjectField
  ContactPersonsInfo: IContactPersonsInfo
  DefaultPaymentCategoryField: ObjectField
  DefaultSubCategoryField: ObjectField
  ESignsInfo: IContractsData
  NotificationsBlockGroup: ClientGroupPanel
  PrimaryBlockGroup: ClientGroupPanel
  Phones: IPhones
  PhotoUrl: string
  CustomCodeGroups: ClientGroupPanel
  PrimaryCurrentClientAccount: IPrimaryCurrentClientAccount
  PrimaryClientMetrics: IPrimaryCurrentClientAccount
  PromoCodeField: ObjectField
  ReverseContactPersonsInfo: IContactPersonsInfo
  ServiceTokens: IServiceTokens
  Tables: IObjectTable[]
}
