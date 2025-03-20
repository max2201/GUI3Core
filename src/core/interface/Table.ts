import type { SortingDirectionType } from '@/core/interface/Ui'
import type { ISelect } from './Ui'
import type { IClient } from './Object'
import type { TableCellTypes } from '../constants/TableCellTypes'

export interface ITableDatasetMeta {
  page: number
  count: number | null
  limit: number
  sort: {
    id: string | null
    dir: SortingDirectionType
  }
  isContextView: boolean
}

export interface ITableCell {
  id: string
  value: string | IClient | null
  type: TableCellTypes
  width: number
  presentation: ITableCellPresentation
}

export interface ITableRow {
  id: number
  title: string
  color: string
  cells: ITableCell[]
}
export interface ITableRow {
  id: number
  title: string
  color: string
  cells: ITableCell[]
}
export interface ITableCellHead {
  id: string
  width: number
  label: string
  icon?: string
  sort?: string
  sortDir?: SortingDirectionType
}

export interface ITableCellPresentation {
  background: string
  text: string
}

export interface ITableCellFlag {
  Color: string
  Title: string
}

export interface ITableDetail {
  label: string
  value?: string | null
  description?: string | null
  widget?: {
    id: string
    data: any
  }
}

export interface ITableFilter {
  txtSmartFilter: string | null
  fields: ITableFilterField[]
}

export interface ITableFilterField {
  id: string
  value: any | string | ISelect
}
