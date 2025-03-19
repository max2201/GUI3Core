import type { IApiResponse } from '@/core/interface/Api'
import type {MetricGroupDto, MetricWidgetDto} from '@/core/interface/Dashboard'

export const GetUserGroupList = async (loadAllMetrics?: boolean) => {
  const { data, error }: IApiResponse<MetricGroupDto[]> = await useApi('Metric.GetUserGroupList', {
    body: {
      BoolParamValue: loadAllMetrics,
    },
  })

  return { data, error }
}

export const GetGroupData = async (groupId: number) => {
  const { data, error }: IApiResponse<MetricGroupDto> = await useApi('Metric.GetGroupData', {
    body: {
      LongParamValue: groupId,
    },
  })

  return { data, error }
}
export const GetWidgetData = async (payload: {
  groupId: number
  widgetGuid: string
  compareType?: number
  detailingType?: string
}) => {
  const { groupId, widgetGuid, compareType, detailingType } = payload
  const { data, error }: IApiResponse<MetricWidgetDto> = await useApi('Metric.GetWidgetData', {
    body: {
      LongParamValue: groupId,
      StringParamValue: widgetGuid,
      LongParamValue2: compareType || -1,
      StringParamValue2: detailingType || '',
    },
  })

  return { data, error }
}
