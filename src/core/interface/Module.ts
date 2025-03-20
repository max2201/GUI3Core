import type { IModuleFilter, IUserAvailableModule, IGroupActionInfo } from './Auth'

export interface IModuleGroupDto {
  Title: string
  Id: string
  Modules: IModuleDto[]
}

export interface IModuleDto {
  Title: string
  Id: string
  IsTableModule: boolean
  DefaultSortColumn: string
  DefaultSortDirection: number
  Columns: IModuleColumnDto[] | null
  PrimaryColor: string
  SecondaryColor: string
  UseAsBaseTypeModule: boolean
  BaseObjectType: number
  KanbanViews?: any
}

export interface IModuleColumnDto {
  Title: string
  Id: string
  Width: number
  SortProperty: string
  // IsBasicColumn: boolean
  IsUsage: boolean
  SortedDirection: number
}

// dataset dto's

export interface IModuleDatasetDto {
  Rows: IRowDto[]
  TotalCount: number
}

export interface IRowDto {
  Id: number
  Title: string
  Color: string
  Cells: ICellDto[]
}

export interface ICellDto {
  ColumnId: string
  Value: null | string
  TextColor: string
  BackColor: string
  CellType: number
}

export interface CardViewCellProps {
  Title: string
  Value: string
  IsBold?: boolean
  CustomColor?: string
  SystemColor?: number
}

export interface ISummaryField {
  Key: string
  Value: string
}

export interface ILocalStorageModule {
  id: string
  userModule: IUserAvailableModule
}

export interface IModuleStateColumn {
  Id: string
  IsColorForAllRow: boolean
  Position: number
  Title: string
  Width: number
}

export type IModuleSavedFilters = { [filterId: string]: string }

export interface IModuleState {
  CurrentColumns: IModuleStateColumn[]
  Filter: IModuleFilter
  Id: string
  PageNumber: number
  PageSize: number
  SortedColumn: string
  SortedDirection: number
  TabName: string
  ViewId: string
  ModuleFilterCollection: IModuleSavedFilters
  AvailableGroupActions: IGroupActionInfo[]
  AvailableContextView: boolean
}

export interface IModuleGroupOperations {
  BoolValue?: boolean
  LinkValue?: string
  ResultDescription?: string
  ResultDialogTitle?: string
  TableValue?: IUserAvailableModule[]
}
