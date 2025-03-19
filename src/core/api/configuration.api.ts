import type { IApiResponse } from '@/core/interface/Api'
import type { IConfigurationDTO } from '@/core/interface/Configuration'

// GetConfiguration
export const GetConfiguration = async () => {
  const { data, error }: IApiResponse<IConfigurationDTO> = await useApi('System.GetConfiguration')

  return { data, error }
}