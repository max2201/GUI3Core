<template>
  <div v-if="props.chatId" class="chat">
    <div class="chat-tabs">
      <UiInfinityTabs
        :tabs="chatsTabs"
        :active-tab-id="currentChat?.id || null"
        @tab-click="onChatTabClick"
        @close-tab="onChatTabClose"
      />
    </div>

    <div class="chat-info">
      <UserSmallCard
        :fullname="currentChat?.title"
        :show-profile-link="false"
        class="chat-info__title"
      />
      <div class="chat-info__actions">
        <PhonesPanel :phones="currentChatPhones" show-call />
      </div>

      <div class="chat-info__links">
        <a v-if="!isShowChatInfo" href="#" @click.stop.prevent="onSwitchChatView"> Общие данные </a>
        <a v-else href="#" @click.stop.prevent="onSwitchChatView"> Вернуться в чат </a>
      </div>
    </div>

    <ChatMessagesWrapper
      v-show="!isShowChatInfo"
      :messages-groups-by-date="messagesGroupsByDate"
      :loading-messages-history="isDisableLoadHistory"
      :loading-sended-message="isSendMessageLoading"
      :show-end-of-history="currentChatState?.lastMessageLoaded && messagesGroupsByDate.length > 0"
      @load-history-messages="onLoadHistoryMessages"
    />

    <div v-show="!isShowChatInfo" class="chat-input-panel">
      <div class="chat-input-panel__inputs">
        <UiMultilineInput
          v-if="chatMode === ChatMode.active"
          :value="messageInputValue"
          :disabled="isSendMessageLoading || showLoading"
          :templates="messageTemplates"
          placeholder="Введите сообщение"
          image-input-icon
          @on-input="onInputMessageValue"
          @on-change="onChangeMessageValue"
          @on-enter="sendTextMessage"
          @on-ctrl-enter="onCtrlEnterMessageValue"
          @select-template="onSendMessageTemplate"
        />

        <UiButton
          v-if="chatMode === ChatMode.active"
          :size="'medium-small'"
          :loading="isSendMessageLoading"
          :disabled="showLoading || !messageInputValue.trim().length"
          class="button-send"
          icon-left="send"
          @click="sendTextMessage"
        />
      </div>

      <div>
        <UiButton
          v-if="chatMode === ChatMode.idle"
          :loading="showLoading"
          :size="'medium-small'"
          @click="startChat"
        >
          Начать чат
        </UiButton>
        <UiButton
          v-if="chatMode === ChatMode.notmy"
          :loading="showLoading"
          :size="'medium-small'"
          :theme="'secondary'"
          @click="getChat"
        >
          Забрать чат
        </UiButton>
        <UiButton
          v-if="chatMode === ChatMode.active"
          :loading="showLoading"
          :size="'medium-small'"
          :theme="'danger-outline'"
          @click="endChat"
        >
          Завершить чат
        </UiButton>
      </div>
    </div>

    <ChatInfo v-show="isShowChatInfo" />
  </div>

  <div v-else class="chat-empty-wrapper">
    <div class="chat-empty">
      <SvgIcon name="chats-empty" class="chat-empty-icon" />
      <span>Выберите в списке слева клиента, которому вы хотите написать сообщение.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import moment from 'moment'
import { onUnmounted } from 'vue'
import { MessageType, ReadStatus, type MessageTextContent } from '@/core/interface/MessageDTO'
import type { IChatMessageGroup, IChatMessage } from '@/core/interface/Chat'
import type { InfinityTabsItem } from '@/core/interface/InfinityTabsItem'
import { ChatMode } from '@/core/constants/ChatMode'
import { GetClientPhones } from '@/core/api/clients.api'
import {
  GetMessagesForClient,
  GetMessagesForDialog,
  SendMessage,
  GetMessagesState,
} from '@/core/api/dialogs.api'
import type { ChatState } from '@/core/store/dialogs.store'
import type { IChatTemplate } from '@/core/interface/Auth'
import { parseJson } from '@/core/utils/parseJson'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'

const readStatus = ReadStatus

const props = defineProps<{
  chatId: number | null
  dialogClientId?: number
  channelId?: string
  chatMode?: ChatMode
  showLoading: boolean
  messageTemplates: IChatTemplate[]
}>()

const dialogsStore = useDialogStore()
const { chats, chatsOpenOrder } = storeToRefs(dialogsStore)

const chatsTabs = computed(() => {
  const tabs = chatsOpenOrder.value
    .map((chatId) => {
      const chatState = chats.value[chatId]

      if (!chatState) return

      const chat = dialogsStore.chatById(chatState.chatId)

      if (!chat) return

      return {
        title: chat.title,
        id: chat.id,
        showStar: true,
        closable: true,
      }
    })
    .filter((chat) => chat) as InfinityTabsItem[]

  return tabs
})

const currentChatState = ref<ChatState>()

const currentChat = computed(() => {
  if (!currentChatState.value) return

  const chat = dialogsStore.chatById(currentChatState.value.chatId)

  return chat
})

watch(
  () => currentChat.value,
  (chat, oldChat) => {
    if (!chat || chat.id === oldChat?.id) return

    if (isShowChatInfo.value) {
      onSwitchChatView()
    }

    GetClientPhones(chat.dialogClientId).then(({ data }) => {
      if (!data) return

      chat.contactNumbers = [...data]
    })
  }
)

const currentChatPhones = computed(
  () =>
    currentChat.value?.contactNumbers.map((number) => ({
      Title: '',
      Phone: number,
    })) || []
)

const isShowChatInfo = ref(false)

const messagesByDate = computed(() => {
  if (!currentChatState.value?.messages) return []

  const messagesCopy = [...currentChatState.value.messages]

  return messagesCopy.reverse()
})

const TimeTemplate = DefaultDatetimeFormat
const messagesGroupsByDate = computed<IChatMessageGroup[]>(() => {
  const messages = messagesByDate.value
  let lastDate = messages?.[0]?.CreationTime.split(' ')[0] || ''
  let oneHourStartTime = moment(messages?.[0]?.CreationTime, TimeTemplate)

  let messageGroups = messages.reduce((acc, message) => {
    const [messageDate, messageTimeFull] = message.CreationTime.split(' ')
    const messageTime = messageTimeFull.split(':').slice(0, 2).join(':')
    const creationTimeMoment = moment(message.CreationTime, TimeTemplate)
    const showTime = creationTimeMoment.isAfter(oneHourStartTime, 'hour')

    if (showTime) {
      oneHourStartTime = creationTimeMoment
    }

    let parsedJsonText: MessageTextContent[] | undefined

    if (
      [
        MessageType.ImageFileLink,
        MessageType.AudioFileLink,
        MessageType.DocumentFileLink,
        MessageType.VideoFileLink,
      ].includes(message.MessageType)
    ) {
      parsedJsonText = parseJson<MessageTextContent[]>(message.MessageText)
    }

    let comment = ''

    if (parsedJsonText) {
      const comments: string[] = []

      parsedJsonText.forEach((parsedContent) => {
        if (parsedContent.Comment) {
          comments.push(parsedContent.Comment)
        }
      })

      if (comments.length) {
        comment = comments.join('. ') + '.'
      }
    }

    const messageValue: IChatMessage = {
      id: message.MessageId,
      type: message.MessageType,
      text: message.MessageText,
      comment,
      owner: message.OwnerId,
      date: messageDate,
      time: messageTime,
      showTime,
      status: message.ReadStatus,
      parsedJsonText,
    }

    const lastGroup = acc[acc.length - 1]

    if (
      lastDate === messageDate &&
      lastGroup &&
      lastGroup.isClientMessages === message.IsClientMessage &&
      messageValue.status === lastGroup.status
    ) {
      const lastMessageInGroup = lastGroup.messages[lastGroup.messages.length - 1]
      const isFileMessage = [
        MessageType.ImageFileLink,
        MessageType.AudioFileLink,
        MessageType.DocumentFileLink,
        MessageType.VideoFileLink,
      ].includes(lastMessageInGroup.type)

      if (
        isFileMessage &&
        messageValue.type === lastMessageInGroup.type &&
        !lastMessageInGroup.comment &&
        !messageValue.comment &&
        !showTime
      ) {
        if (lastMessageInGroup.submessages) {
          lastMessageInGroup.submessages.push(messageValue)
        } else {
          lastMessageInGroup.submessages = [lastMessageInGroup, messageValue]
        }

        return acc
      }

      lastGroup.messages.push(messageValue)
      return acc
    }

    messageValue.showTime = true

    lastDate = messageDate
    acc.push({
      isClientMessages: message.IsClientMessage,
      date: lastDate,
      time: messageTime,
      fullname: message.IsClientMessage ? message.DialogClientFio : message.OwnerTitle,
      owner: message.OwnerId,
      status: message.ReadStatus,
      messages: [messageValue],
    })

    return acc
  }, [] as IChatMessageGroup[])

  return messageGroups
})

let currentTimerId: null | number = null
const TimeoutUpdateMessagesMS = 5000

const toast = useToast()

const updateLastMessages = (payload: {
  ChatId: number
  DialogId: number
  MarkAsRead: boolean
  MessagesAfterId: number
}) => {
  return new Promise<void>((resolve, reject) => {
    GetMessagesForDialog({
      DialogId: payload.DialogId,
      MarkAsRead: payload.MarkAsRead,
      MessagesAfterId: payload.MessagesAfterId,
    })
      .then(({ data, error }) => {
        if (error) {
          toast.error('Ошибка при попытке получить сообщения: ' + error)
          return
        }

        if (!data) {
          toast.error('Ошибка при попытке получить сообщения: пустой ответ')
          return
        }

        dialogsStore.addNewMessagesForChat(payload.ChatId, data)
        resolve()
      })
      .catch((e: any) => {
        reject(e)
      })
  })
}

const updateCurrentMessages = (isFirstStart = false) => {
  if (!currentTimerId && !isFirstStart) {
    return
  }

  if (!currentTimerId && isFirstStart) {
    currentTimerId = Number(
      setTimeout(() => {
        updateCurrentMessages()
      }, TimeoutUpdateMessagesMS)
    )
    return
  }

  const currentChatId = currentChat.value?.id
  const DialogId = currentChat.value?.dialogDTO.DialogId

  if (!currentChatId || !DialogId || !messagesByDate.value.length) return

  const lastMessageId = messagesByDate.value[messagesByDate.value.length - 1].Id

  updateLastMessages({
    ChatId: currentChatId,
    DialogId,
    MarkAsRead: props.chatMode === ChatMode.active,
    MessagesAfterId: lastMessageId,
  }).finally(() => {
    currentTimerId = Number(
      setTimeout(() => {
        updateCurrentMessages()
      }, TimeoutUpdateMessagesMS)
    )
  })
}

const setTimerForLoadNewMessages = () => {
  if (currentTimerId) {
    clearTimeout(currentTimerId)
  }

  updateCurrentMessages(true)
}

const currentMessagesPage = ref(1)

watch(
  () => props.chatId,
  () => {
    const chatId = props.chatId
    const dialogClientId = props.dialogClientId
    const channelId = props.channelId

    if (!chatId || !channelId || !dialogClientId) {
      currentChatState.value = undefined
      return
    }

    if (!chats.value[chatId]) {
      currentMessagesPage.value = 1
      // New chat open - need load messages

      GetMessagesForClient({
        ChannelId: channelId,
        DialogClientId: dialogClientId,
        PageSize: 20, //  For first load is constant
        PageNumber: currentMessagesPage.value,
      }).then(({ data, error }) => {
        if (error) {
          toast.error('Ошибка при попытке получить сообщения: ' + error)
          return
        }

        if (!data) {
          toast.error('Ошибка при попытке получить сообщения: пустой ответ')
          return
        }

        const chatState = {
          chatId,
          channelId,
          messages: data,
          lastMessageLoaded: false,
        }

        dialogsStore.setChatState(chatId, chatState)
        currentChatState.value = chatState
        setTimerForLoadNewMessages()
      })

      return
    }

    currentChatState.value = chats.value[chatId]
    setTimerForLoadNewMessages()
  }
)

const emits = defineEmits([
  'start-dialog',
  'take-dialog',
  'finish-dialog',
  'change-chat',
  'close-chat',
])

const startChat = () => {
  emits('start-dialog')
}

const getChat = () => {
  emits('take-dialog')
}

const endChat = () => {
  emits('finish-dialog')
}

const messageInputValue = ref<string>('')

const onInputMessageValue = (value: string) => {
  messageInputValue.value = value
}

const isSendMessageLoading = ref(false)

const sendMessage = (payload: {
  chatId: number
  dialogId: number
  messageValue?: string
  templateId?: number
}) => {
  isSendMessageLoading.value = true

  SendMessage({
    LongParamValue: payload.chatId,
    StringParamValue: payload.messageValue,
    TemplateId: payload.templateId,
  })
    .then(({ data, error }) => {
      if (error) {
        toast.error('Ошибка при попытке отправить сообщения: ' + error)
        return
      }

      if (!data) {
        toast.error('Ошибка при попытке отправить сообщения')
        return
      }

      const lastMessageId = messagesByDate.value[messagesByDate.value.length - 1].Id

      updateLastMessages({
        ChatId: payload.chatId,
        DialogId: payload.dialogId,
        MarkAsRead: true,
        MessagesAfterId: lastMessageId,
      }).finally(() => {
        nextTick(() => {
          isSendMessageLoading.value = false
        })
      })
    })
    .catch(() => {
      isSendMessageLoading.value = false
    })
}

const sendTextMessage = () => {
  if (!messageInputValue.value.trim().length) return

  const messageValue = messageInputValue.value
  messageInputValue.value = ''

  const chatId = props.chatId
  if (!chatId) return

  const currentChatId = currentChat.value?.id
  const DialogId = currentChat.value?.dialogDTO.DialogId

  if (!DialogId || !currentChatId) return

  sendMessage({
    chatId,
    dialogId: DialogId,
    messageValue,
  })
}

const onChangeMessageValue = (value: string) => {
  messageInputValue.value = value
}

const onCtrlEnterMessageValue = (value: string) => {
  messageInputValue.value = value + '\n'
}

const onSendMessageTemplate = (template: IChatTemplate) => {
  const dialogId = currentChat.value?.dialogDTO.DialogId
  if (!props.chatId || !dialogId) return

  sendMessage({
    chatId: props.chatId,
    dialogId,
    templateId: template.BaseObjectId,
  })
}

const onChatTabClick = (tab) => {
  emits('change-chat', tab.id)
}

const onChatTabClose = (tab) => {
  emits('close-chat', tab.id)
}

const updateMessagesState = () => {
  return new Promise<void>((resolve, reject) => {
    const chatId = props.chatId

    if (!chatId) return

    const messages = currentChatState.value?.messages || []

    const messageIdsWithNonEndStatus = messages
      .filter((m) => {
        if ([ReadStatus.Sended, ReadStatus.Recieved].includes(m.ReadStatus)) {
          return true
        }

        if (m.ReadStatus === ReadStatus.Idle && !m.IsClientMessage) {
          return true
        }
      })
      .map((m) => m.Id)

    if (!messageIdsWithNonEndStatus.length) {
      resolve()
      return
    }

    GetMessagesState({ LongParamIds: messageIdsWithNonEndStatus })
      .then(({ data }) => {
        if (!data || chatId !== props.chatId) return

        dialogsStore.updateMessagesStates(chatId, data)
      })
      .finally(() => {
        resolve()
      })
  })
}

const updateMessageStateIntervalID = setInterval(updateMessagesState, 5000)
onUnmounted(() => {
  clearInterval(updateMessageStateIntervalID)
})

let isDisableLoadHistory = ref(false)

const onLoadHistoryMessages = _.debounce(() => {
  if (isDisableLoadHistory.value) return

  const chatId = props.chatId
  const channelId = props.channelId
  const dialogClientId = props.dialogClientId

  if (!chatId || !channelId || !dialogClientId || chats.value[chatId].lastMessageLoaded) return

  isDisableLoadHistory.value = true
  currentMessagesPage.value = currentMessagesPage.value + 1

  GetMessagesForClient({
    ChannelId: channelId,
    DialogClientId: dialogClientId,
    PageSize: 20, //  For first load is constant
    PageNumber: currentMessagesPage.value,
  })
    .then(({ data, error }) => {
      if (error) {
        toast.error('Ошибка при попытке получить сообщения: ' + error)
        return
      }

      if (!data) {
        toast.error('Ошибка при попытке отправить сообщения')
        return
      }

      if (data.length === 0) {
        chats.value[chatId].lastMessageLoaded = true
        return
      }

      dialogsStore.addChatHistoryMessages(chatId, data)
    })
    .catch(() => {
      currentMessagesPage.value = currentMessagesPage.value - 1
    })
    .finally(() => {
      isDisableLoadHistory.value = false
    })
}, 100)

const onSwitchChatView = () => {
  isShowChatInfo.value = !isShowChatInfo.value
}
</script>

<style scoped lang="scss">
.chat-empty-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;

  > span {
    text-align: center;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-16);
    line-height: 150%;
    color: var(--color-font-disabled);
  }
}

.chat-empty-icon {
  width: 167px;
  height: 178px;
  color: white;
}

.chat {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 36px 60px auto 66px;
  height: 100%;
  overflow: hidden;

  &-tabs {
  }

  &-info {
    display: grid;
    width: 100%;
    grid-template-columns: 400px 330px auto;
    grid-template-rows: 60px;
    align-items: center;
    padding: 0 30px;
    gap: 16px;
    box-shadow: 0px 8px 20px 0px rgba(6, 28, 40, 0.22);
    z-index: 1;
    background-color: var(--color-background);

    &__title {
      overflow: hidden;
      width: 400px;
    }

    &__actions {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 0 18px;
      height: 60px;

      &::before {
        @include block-vertical-seporator;
      }
    }

    &__links {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 0 18px;
      height: 60px;

      &::before {
        @include block-vertical-seporator;
      }

      > a {
        text-decoration: underline dashed;
      }
    }
  }

  &-input-panel {
    display: grid;
    grid-template-columns: auto max-content;
    grid-template-rows: 66px;
    grid-gap: 20px;
    width: 100%;
    padding: 16px 32px;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-background);
    z-index: 1;

    :deep(button.button-send) {
      color: var(--color-font-invert);
    }

    &__inputs {
      display: grid;
      grid-template-columns: auto 32px;
      grid-gap: 0;

      :deep(.input__input ) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      :deep(.button ) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    > div {
      height: 34px;
    }
  }
}
</style>
