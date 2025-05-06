import type { IModuleGroupDto } from './Module'

export interface DictionariesItem {
  Title: string
  IsSystem: boolean
  Code: string
  ColorCode: string
  Index: number
  LeftBorder: number
  RightBorder: number
  Value1: any
  Value2: any
  Value3: any
  Value4: any
}

export interface Dictionary {
  Title: string
  IsSystem: boolean
  Code: string
  Values: DictionariesItem[]
}
export interface OksmListItem {
  Code: string
  Name: string
  Summary: string
  Summary2: string
}
export interface VirtualDictionaries {
  OksmList?: OksmListItem[]
}
type CardType = Record<number, string>
export interface IEnumDictionaries {
  CardType?: CardType
}
export interface FileFolder {
  ParentBaseObjectType: number
  EnabledForRoles: any[] // ?
  Title: string
  FolderCode: string
  RequiredDogClosingDocs: boolean
}

export interface IConfigurationDTO {
  VirtualDictionaries: VirtualDictionaries
  EnumDictionaries: IEnumDictionaries
  SystemType: number
  ModuleGroups: IModuleGroupDto[]
  BaseObjectsColors: { [key: string]: string }
  Dictionaries: Dictionary[]
  SystemColors: { [key: string]: string }
  RegKey: string
  FileFolders: Record<number, FileFolder[]>
  DocServerUrl: string
  TableSettings: any
}
