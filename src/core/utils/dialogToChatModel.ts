import type { IDialogDTO } from "@/core/interface/DialogDTO"
import type { Chat } from "@/core/interface/Chat"
import { ChatMode } from "@/core/constants/ChatMode"
import type { IUserProfileDto } from "@/core/interface/Auth"

const getChatMode = (dialog: IDialogDTO, user: IUserProfileDto) => {
  if (dialog.EmployeeId === -1) {
    return ChatMode.idle
  }

  if (dialog.EmployeeId === user.CurrentUserId) {
    return ChatMode.active
  }

  return ChatMode.notmy
}

export const dialogToChatModel = (params: {
  dialog: IDialogDTO,
  user: IUserProfileDto,
  contactNumbers?: string[]
}) => {
  const { dialog, user, contactNumbers } = params

  const badges = [] as any

  if (dialog.LabelUnread) {
    const [messagesCount, time] = dialog.LabelUnread.split(', ')
    const [timeValue] = time?.split(' ') || []
    const isNormalTime = timeValue ? Number(timeValue) < 10 : false
    const isDangerTime = timeValue ? Number(timeValue) >= 10 : false

    if (time) {
      badges.push({
        value: time,
        passive: true,
        success: isNormalTime,
        danger: isDangerTime,
      })
    }

    if (messagesCount) {
      badges.push({
        value: messagesCount,
        passive: true,
        success: isNormalTime,
        danger: isDangerTime,
      })
    }
  }

  return {
    id: dialog.DialogId,
    channelId: dialog.ChannelId,
    dialogClientId: dialog.DialogClientId,
    title: dialog.LabelClient,
    region: user.AviableFilials.find(fillial => fillial.ID === dialog.FilialId)?.ShortTitle || '',
    dateAndStatusText: dialog.LabelInfo,
    badges,
    mode: getChatMode(dialog, user),
    contactNumbers: contactNumbers || [],
    dialogDTO: dialog,
  } as Chat
}