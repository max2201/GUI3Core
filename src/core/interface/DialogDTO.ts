import type { ChangedDialogReasonTypes } from '@/core/constants/ChangedDialogReasonTypes'

interface IUnreadMetaInfo {
  DialogId: number;
  CreationTime: string;
  Count: number;
}

export interface IDialogDTO {
  DialogId: number; // id текущего диалога
  ChangedReason: ChangedDialogReasonTypes;
  DialogClientId: number; // id диалога (для всех пользователй, по ней храняться сообщения)
  DialogClientFio: string;
  Channel: string;
  ChannelId: string;
  ClientAccount: string;
  ClientUsername: string;
  IsFinihed: boolean;
  ContractId: number;
  RequestId: number;
  FilialId: number;
  EmployeeId: number;
  EmployeeTitle: string;
  LabelClient: string;
  LabelInfo: string;
  UnreadMetaInfo: IUnreadMetaInfo;
  LabelUnread: string;
  LastMessageTime: string;
  AlreadyExists: boolean;
}