import type { IApiResponse } from '@/core/interface/Api'
import type { UserSimple } from '@/core/interface/User'

export interface IGetUsersPayload {
  ids?: number[]
  searchIds?: number[]
}

export const GetUsers = async (payload: IGetUsersPayload) => {
  const { ids, searchIds } = payload

  const { data, error }: IApiResponse<UserSimple[]> = await useApi('Users.GetUsers', {
    body: {
      LongParamIds: ids || [],
      StringParamIds: searchIds || null,
    },
  })

  return { data, error }
}
