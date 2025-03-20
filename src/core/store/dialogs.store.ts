import _ from 'lodash'
import { reactive } from 'vue'
import type { Chat } from '@/core/interface/Chat'
import type { ReadStatus, MessageDTO } from '@/core/interface/MessageDTO'
import { ChatMode } from '@/core/constants/ChatMode'

export interface ChatState {
  chatId: number
  channelId: string
  messages: MessageDTO[]
  lastMessageLoaded: boolean
}

interface ChatsState {
  [chatId: number]: ChatState
}

export const useDialogStore = defineStore('dialogs', () => {
  const myChats = ref<Chat[]>([])
  const otherChats = ref<Chat[]>([])

  const setChats = (newMyChats: Chat[], newOtherChats: Chat[]) => {
    if (!myChats.value.length) {
      myChats.value = _.cloneDeep(newMyChats)
    } else {
      const oldMyChatsIds = myChats.value.reduce((acc, chat) => {
        acc[chat.id] = chat
        return acc
      }, {})

      newMyChats.forEach((newChat, index) => {
        const indexOfExistChat = myChats.value.findIndex((c) => c.id === newChat.id)

        if (indexOfExistChat === -1) {
          myChats.value.splice(index, 0, newChat)
          return
        }

        myChats.value[indexOfExistChat].badges = newChat.badges
        myChats.value[indexOfExistChat].dateAndStatusText = newChat.dateAndStatusText
        myChats.value[indexOfExistChat].mode = newChat.mode
        myChats.value[indexOfExistChat].title = newChat.title

        delete oldMyChatsIds[newChat.id]
      })

      Object.keys(oldMyChatsIds).forEach((id) => {
        const index = myChats.value.findIndex((c) => c.id === Number(id))

        if (index === -1) return

        myChats.value.splice(index, 1)
      })
    }

    if (!otherChats.value.length) {
      otherChats.value = _.cloneDeep(newOtherChats)
    } else {
      const oldOtherChatsIds = otherChats.value.reduce((acc, chat) => {
        acc[chat.id] = chat
        return acc
      }, {})

      newOtherChats.forEach((newChat, index) => {
        const indexOfExistChat = otherChats.value.findIndex((c) => c.id === newChat.id)

        if (indexOfExistChat === -1) {
          otherChats.value.splice(index, 0, newChat)
          return
        }

        otherChats.value[indexOfExistChat].badges = newChat.badges
        otherChats.value[indexOfExistChat].dateAndStatusText = newChat.dateAndStatusText
        otherChats.value[indexOfExistChat].mode = newChat.mode
        otherChats.value[indexOfExistChat].title = newChat.title

        delete oldOtherChatsIds[newChat.id]
      })

      Object.keys(oldOtherChatsIds).forEach((id) => {
        const index = otherChats.value.findIndex((c) => c.id === Number(id))

        if (index === -1) return

        otherChats.value.splice(index, 1)
      })
    }
  }

  const updateChat = (chat: Chat) => {
    const indexInMyChats = myChats.value.findIndex((mychat) => mychat.id === chat.id)

    if (indexInMyChats !== -1) {
      myChats.value.splice(indexInMyChats, 1, _.cloneDeep(chat))
      return
    }

    const indexInOtherChats = otherChats.value.findIndex((mychat) => mychat.id === chat.id)

    if (indexInOtherChats !== -1) {
      otherChats.value.splice(indexInOtherChats, 1, _.cloneDeep(chat))
      return
    }
  }

  const addMyChat = (chat: Chat) => {
    myChats.value.push(_.cloneDeep(chat))

    const indexInOtherChats = otherChats.value.findIndex((mychat) => mychat.id === chat.id)

    if (indexInOtherChats !== -1) {
      otherChats.value.splice(indexInOtherChats, 1)
      return
    }
  }

  const chats = reactive<ChatsState>({})
  const chatsOpenOrder = ref<number[]>([])

  const setChatState = (chatId: number, chatState: ChatState) => {
    chats[chatId] = chatState

    const indexInOrder = chatsOpenOrder.value.findIndex((chatIdInOrder) => chatIdInOrder === chatId)

    if (indexInOrder !== -1) {
      return
    }

    chatsOpenOrder.value.push(chatId)
  }

  const removeChatFromOrder = (chatId: number) => {
    const indexInOrder = chatsOpenOrder.value.indexOf(chatId)

    if (indexInOrder === -1) return

    chatsOpenOrder.value.splice(indexInOrder, 1)
  }

  const removeChatState = (chatId: number) => {
    delete chats[chatId]
  }

  const chatById = (chatId: number) => {
    const mychat = myChats.value.find((c) => c.id === chatId)

    if (mychat) {
      return mychat
    }

    const otherchat = otherChats.value.find((c) => c.id === chatId)

    return otherchat
  }

  const addNewMessagesForChat = (chatId: number, messages: MessageDTO[]) => {
    if (!chats[chatId]) {
      console.error('addNewMessagesForChat -> Not found chat by chatId')
      return
    }

    const existMessagesIds = chats[chatId].messages.reduce((acc, message) => {
      acc[message.Id] = message
      return acc
    }, {} as { [id: number]: MessageDTO })

    messages.reverse().forEach((newMessage) => {
      if (existMessagesIds[newMessage.Id]) return

      chats[chatId].messages.unshift(_.cloneDeep(newMessage))
    })
  }

  const updateMessagesStates = (
    chatId: number,
    updates: Array<{ Id: number; ReadStatus: ReadStatus }>
  ) => {
    if (!chats[chatId]) return

    const updatesByMessageId = updates.reduce((acc, update) => {
      acc[update.Id] = update.ReadStatus
      return acc
    }, {} as { [key: number]: ReadStatus })

    chats[chatId].messages.forEach((message) => {
      if (updatesByMessageId[message.Id]) {
        message.ReadStatus = updatesByMessageId[message.Id]
      }
    })
  }

  const addChatHistoryMessages = (chatId: number, messages: MessageDTO[]) => {
    if (!chats[chatId]) return

    chats[chatId].messages.push(...messages)
  }

  return {
    myChats,
    otherChats,
    setChats,
    updateChat,
    addMyChat,
    chats,
    chatsOpenOrder,
    setChatState,
    removeChatState,
    chatById,
    addNewMessagesForChat,
    updateMessagesStates,
    addChatHistoryMessages,
    removeChatFromOrder,
  }
})
