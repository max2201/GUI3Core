import type { ChatMode } from "@/core/constants/ChatMode"
import type { IDialogDTO } from "./DialogDTO"
import type { MessageTextContent, MessageType, ReadStatus } from "./MessageDTO"

export interface ChatBadge {
  value: string
  danger: boolean
  iconBefore: string
  passive: boolean
}

export interface Chat {
  id: number
  dialogClientId: number;
  channelId: string;
  title: string
  region: string
  dateAndStatusText: string
  badges: ChatBadge[]
  mode: ChatMode
  contactNumbers: string[]
  dialogDTO: IDialogDTO
}

export interface IChatMessage {
  id: string;
  type: MessageType;
  text: string;
  owner: number;
  date: string;
  time: string;
  showTime: boolean
  status: ReadStatus;
  submessages?: IChatMessage[];
  comment?: string;
  parsedJsonText?: MessageTextContent[];
}

export interface IChatMessageGroup {
  isClientMessages: boolean;
  date: string;
  time: string;
  status: ReadStatus;
  fullname: string;
  owner: number;
  messages: IChatMessage[];
}