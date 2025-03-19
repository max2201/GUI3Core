import _ from 'lodash'
import type { IApiResponse } from '@/core/interface/Api'
import type { LockingObject } from '@/core/interface/LockingObject'

interface ILockObjectPayload {
  LockedObjectId: number
  LockedObjectType: number
  ForceLock?: boolean
}

interface ILockObjectResponse {
  SelfLockingSuccessful: boolean
  LockingObject?: LockingObject
  Error: string
}

export const LockObject = async (payload: ILockObjectPayload) => {
  const { data, error }: IApiResponse<ILockObjectResponse> = await useApi('LockingApi.LockObject', {
    body: {
      ...payload,
    },
  })

  return { data, error }
}

interface IReleaseObjectPayload {
  LockedObjectId: number
  LockedObjectType: number
}

export const ReleaseObject = async (payload: IReleaseObjectPayload) => {
  const { data, error }: IApiResponse<any> = await useApi('LockingApi.ReleaseObject', {
    body: {
      ...payload,
    },
  })

  return { data, error }
}

interface IVerifyLockPayload {
  LockedObjectId: number
  LockedObjectType: number
}

interface VerifyResult {
  VerifySuccessful: boolean
  LockingObject: LockingObject
  Error: string
}

export const VerifyLock = async (payload: IVerifyLockPayload) => {
  const { data, error }: IApiResponse<VerifyResult> = await useApi('LockingApi.VerifyLock', {
    body: {
      ...payload,
    },
  })

  return { data, error }
}
