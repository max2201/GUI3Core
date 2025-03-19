import type { IApiResponse } from '@/core/interface/Api'
import type { IDialogDTO } from '@/core/interface/DialogDTO'
import type { MessageDTO } from '@/core/interface/MessageDTO'
import type { IDialogChannel } from '@/core/interface/DialogChannel'

export const GetDialogsChannels = async () => {
  const { data, error }: IApiResponse<IDialogChannel[]> = await useApi('Dialogs.GetChannels')

  return { data, error }
}

export const CreateNewDialog = async (payload: {
  ClientId: number
  ChannelId: string
  PhoneIndex: number
}) => {
  const { ClientId, ChannelId, PhoneIndex } = payload
  const { data, error }: IApiResponse<IDialogDTO> = await useApi('Dialogs.CreateNewDialog', {
    body: {
      ClientId,
      ChannelId,
      PhoneIndex,
    },
  })

  return { data, error }
}

interface ICurrentDialogsResponse {
  MyDialogs: IDialogDTO[]
  OtherDialogs: IDialogDTO[]
}

export const GetCurrentDialogs = async (filterValue: string = '') => {
  const { data, error }: IApiResponse<ICurrentDialogsResponse> = await useApi(
    'Dialogs.GetCurrentDialogs',
    {
      body: {
        Filter: filterValue,
      },
    }
  )

  return { data, error }
}

export const GetMessagesForClient = async (payload: {
  ChannelId: string
  DialogClientId: number
  PageSize: number
  PageNumber: number
}) => {
  const { ChannelId, DialogClientId, PageSize, PageNumber } = payload

  const { data, error }: IApiResponse<MessageDTO[]> = await useApi('Dialogs.GetMessagesForClient', {
    body: {
      ChannelId,
      DialogClientId,
      PageSize,
      PageNumber,
    },
  })

  return { data, error }
}

export const GetMessagesForDialog = async (payload: {
  DialogId: number
  MarkAsRead: boolean
  MessagesAfterId: number
}) => {
  const { DialogId, MarkAsRead, MessagesAfterId } = payload

  const { data, error }: IApiResponse<MessageDTO[]> = await useApi('Dialogs.GetMessagesForDialog', {
    body: {
      DialogId,
      MarkAsRead,
      MessagesAfterId,
    },
  })

  return { data, error }
}

export const SendMessage = async (payload: {
  LongParamValue: number // Chat ID
  StringParamValue?: string // Text
  TemplateId?: number // Chat template id
}) => {
  const { LongParamValue, StringParamValue, TemplateId } = payload

  const { data, error }: IApiResponse<ICurrentDialogsResponse> = await useApi(
    'Dialogs.SendMessage',
    {
      body: {
        LongParamValue,
        StringParamValue,
        LongParamValue2: TemplateId,
      },
    }
  )

  return { data, error }
}

export const StartDialog = async (payload: {
  LongParamValue: number // Chat ID
}) => {
  const { LongParamValue } = payload

  const { data, error }: IApiResponse<ICurrentDialogsResponse> = await useApi(
    'Dialogs.StartDialog',
    {
      body: {
        LongParamValue,
      },
    }
  )

  return { data, error }
}

export const TakeDialog = async (payload: {
  LongParamValue: number // Chat ID
}) => {
  const { LongParamValue } = payload

  const { data, error }: IApiResponse<IDialogDTO> = await useApi('Dialogs.TakeDialog', {
    body: {
      LongParamValue,
    },
  })

  return { data, error }
}

export const FinishDialog = async (payload: {
  LongParamValue: number // Chat ID
}) => {
  const { LongParamValue } = payload

  const { data, error }: IApiResponse<IDialogDTO> = await useApi('Dialogs.FinishDialog', {
    body: {
      LongParamValue,
    },
  })

  return { data, error }
}

export const GetMessagesState = async (payload: {
  LongParamIds: number[] // Messages IDs
}) => {
  const { LongParamIds } = payload

  const { data, error }: IApiResponse<Array<{ Id: number; ReadStatus: any }>> = await useApi(
    'Dialogs.GetMessagesState',
    {
      body: {
        LongParamIds,
      },
    }
  )

  return { data, error }
}

export const GetCountUnreadMessagesForUser = async () => {
  const { data, error }: IApiResponse<{ LongParamValue: number }> = await useApi(
    'Dialogs.GetCountUnreadMessagesForUser'
  )

  return { data, error }
}

interface CheckChatAccessibleResult {
  IsChatAccessible: boolean
  ActiveCount: number
  InActiveCount: number
}

export const CheckChatAccessible = async () => {
  const { data, error }: IApiResponse<CheckChatAccessibleResult> = await useApi(
    'Dialogs.CheckChatAccessible'
  )

  return { data, error }
}
