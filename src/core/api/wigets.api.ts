import type { IApiResponse } from '@/core/interface/Api'
import type { MetricEditDto, MetricGroupDto, MetricWidgetDto } from '@/core/interface/Dashboard'

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

export const GetWidgetEdit = async (payload: { groupId: number; widgetGuid: string }) => {
  const { groupId, widgetGuid } = payload
  const { data, error }: IApiResponse<MetricGroupDto> = await useApi('Metric.GetEditWidget', {
    body: {
      LongParamValue: groupId,
      StringParamValue: widgetGuid,
    },
  })

  return { data, error }
}

export const ValidateSaveWidgetSettings = async (payload: {
  MetricGroupId: number
  WidgetGuid: string
}) => {
  const { MetricGroupId, WidgetGuid } = payload
  const { data, error }: IApiResponse<MetricGroupDto> = await useApi('Metric.GetEditWidget', {
    body: {
      LongParamValue: groupId,
      StringParamValue: widgetGuid,
    },
  })

  return { data, error }
}

export const SaveWidgetSettings = async (payload: MetricEditDto) => {
  // const { groupId, widgetGuid } = payload
  await useApi('Metric.Validate', {
    body: {
      OperationCode: 'Metric.SaveWidget',
      Vals: {
        ...payload,
      },
    },
  })
  const { data, error }: IApiResponse<MetricEditDto> = await useApi('Metric.SaveWidget', {
    body: {
      OperationCode: 'Metric.SaveWidget',
      Vals: {
        ...payload,
      },
    },
  })

  return { data, error }
}
export const DeleteWidget = async (payload: { groupId: number; widgetGuid: string }) => {
  const { groupId, widgetGuid } = payload
  const { data, error }: IApiResponse<MetricGroupDto> = await useApi('Metric.DeleteWidget', {
    body: {
      OperationCode: 'Metric.DeleteWidget',
      Vals: {
        WidgetGroupId: groupId,
        WidgetGuid: widgetGuid,
      },
    },
  })

  return { data, error }
}

export const GetWidgetView = async (payload: {
  WidgetGroupId: number
  WidgetGuid: string
  ddlPeriodType?: string
  ctrlPeriodShiftSize?: string
  ddlPeriodStepSize?: number
  ddlGroupings?: string
  ddlAggType?: string
  ddlAggColumn?: string
  txtSqlFunction?: string
  chbCompareWithPreviousPeriod?: string
  Filter?: string
  PageSize?: number
  PageNumber?: number
  SortColumn?: string
  SortMode?: string
}) => {
  const {
    WidgetGroupId,
    WidgetGuid,
    ddlPeriodType,
    ctrlPeriodShiftSize,
    ddlPeriodStepSize,
    ddlGroupings,
    ddlAggType,
    ddlAggColumn,
    txtSqlFunction,
    chbCompareWithPreviousPeriod,
    Filter,
    PageSize,
    PageNumber,
    SortColumn,
    SortMode,
  } = payload
  const { data, error }: IApiResponse<MetricGroupDto> = await useApi('Metric.GetViewWidgetData', {
    body: {
      OperationCode: 'Metric.GetViewWidgetData',
      Vals: {
        WidgetGroupId,
        WidgetGuid,
        ddlPeriodType,
        ctrlPeriodShiftSize,
        ddlPeriodStepSize,
        ddlGroupings,
        ddlAggType,
        ddlAggColumn,
        txtSqlFunction,
        chbCompareWithPreviousPeriod,
        Filter,
        PageSize,
        PageNumber,
        SortColumn,
        SortMode,
      },
    },
  })

  return { data, error }
}
