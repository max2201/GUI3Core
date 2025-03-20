export interface MessageTextContent {
  Comment: string;
  OriginalName: string;
  Url: string
  ContentType: number;
}

export enum ReadStatus {
  Idle = 0, // Написано и отправлено клиентом (аналого Входящее) - статус конечный
  Sended = 1, // Отправлено
  Recieved = 2, // Доставлено, не прочитано
  Readed = 3, // Прочитано клиентом - статус конечный
  Inbound = 4 // Входящее - статус конечный
}

export enum MessageType {
  None = 0,
  Comment = 1,
  Sms = 2,
  Mail = 3,
  Message = 4,
  Error = 5,
  Warning = 6,
  InCall = 7,
  OutCall = 8,
  JSonImagesMessage = 9,
  JSonChangesHistoryItem = 10,
  TpsEvent = 11,
  ImageFileLink = 12,
  AudioFileLink = 13,
  VideoFileLink = 14,
  DocumentFileLink = 15
}

export interface MessageDTO {
  Id: number;
  DialogId: number;
  ChannelId: string;
  MessageId: string;
  MessageText: string; // JSON string
  DialogClientId: number;
  DialogClientFio: string;
  IsUnread: boolean;
  MessageType: MessageType;
  ReadStatus: ReadStatus;
  FilialId: number;
  IsClientMessage: boolean;
  CreationTime: string;
  OwnerId: number;
  OwnerTitle: string;
}