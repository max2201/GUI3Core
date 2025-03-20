export enum FilesFilter {
  Group = 'group',
  Ungroup = 'ungroup',
  WithoutFolder = 'withoutfolder',
}

export interface FileFilterSettings {
  label: string
  value: string
}

export const BaseFilesFilters: FileFilterSettings[] = [
  {
    label: 'По папкам',
    value: FilesFilter.Group,
  },
  {
    label: 'Все файлы',
    value: FilesFilter.Ungroup,
  },
  {
    label: 'Файлы без папок',
    value: FilesFilter.WithoutFolder,
  },
]