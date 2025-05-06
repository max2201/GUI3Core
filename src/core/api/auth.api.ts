import type { IApiResponse } from '@/core/interface/Api'
import type { ILoginDto } from '@/core/interface/Auth'
import type { Layout } from 'grid-layout-plus'

// Login
export interface ILoginPayload {
  Login: string
  Password: string
}

export const AuthLogin = async (req: ILoginPayload) => {
  const { data, error }: IApiResponse<ILoginDto> = await useApi('UserProfile.Login', {
    body: { ...req, Ip: '127.0.0.1' },
  })

  return { data, error }
}

// Recover
export interface IRecoverPayload {
  Login: string
}

export const AuthRecover = async (req: IRecoverPayload) => {
  const { data, error }: IApiResponse<ILoginDto> = await useApi('Recover', {
    body: { ...req },
  })

  return { data, error }
}

// Logout
export const AuthLogout = async () => {
  const { data, error }: IApiResponse<{}> = await useApi('UserProfile.Logout', {
    body: {},
  })

  return { data, error }
}

// ChangeUserFilial
export interface IChangeUserFiliPayload {
  LongParamValue: number
}

export const ChangeUserFilial = async (req: IChangeUserFiliPayload) => {
  const { data, error }: IApiResponse<{}> = await useApi('UserProfile.ChangeFilial', {
    body: { ...req },
  })

  return { data, error }
}

export const UpdateUserDashboardLayoutItems = async (LayoutItems: Layout) => {
  const { data, error }: IApiResponse<Layout> = await useApi('UserProfile.UpdateLayoutItems', {
    body: { LayoutItems },
  })

  return { data, error }
}
