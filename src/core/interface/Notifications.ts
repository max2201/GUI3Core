export interface INotification {
  Id: number
  Header: string
  Time: string
  TimeString: string
  QuikDeleteAvailable: false
  OnlyTimeString: string
  OnlyDeltaString: string
  DataValueType: number
  UserName: string
  Client: {
    BaseObjectId: number
    BaseObjectDate: string
    BaseObjectType: number
    BaseObjectName: string
  }
  LinkedObject: {
    BaseObjectId: number
    BaseObjectDate: string
    BaseObjectType: number
    BaseObjectName: string
  }
  Comment: string
  GroupType: number
  NotificationType: number
}
