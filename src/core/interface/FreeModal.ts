export enum FreeModalTarget {
  EditClient = 'EditClient',
  NewRequest = 'NewRequest',
  ObjectNotifications = 'ObjectNotifications',
  MetaDataGroups = 'MetaDataGroups',
}

export interface FreeModalArgs {
  target: FreeModalTarget
  object: any
  title: string
  top: number
  left: number
  width: number
  height?: number
  e?: MouseEvent
  callback?: (args?: any) => void
}
