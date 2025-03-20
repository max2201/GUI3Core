import { IUserAviableFilial } from './Auth' 

export interface CreateNotificationModalParams {
  creatorId: number
  creatorName: string
  selectedObjectID: number
  selectedObjectType: number
  fillials: IUserAviableFilial[]
}
