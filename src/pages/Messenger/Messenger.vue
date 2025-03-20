<template>
  <div class="messenger">
    <div class="messenger__left-side">
      <div class="messenger__search">
        <UiInput1
          :model-value="searchValue"
          icon="search"
          icon-position="left"
          placeholder="Поиск..."
          clearable
          @update:model-value="onSearch"
        />
      </div>

      <div class="messenger__tabs">
        <UiInfinityTabs
            divided
            dark
            :tabs="leftMenuTabs"
            :active-tab-id="currentLeftMenuTabId"
            @tab-click="onChangeLeftMenuTabs"
            hide-overload
        />
        <div class="d-flex flex-align-center flex-justify-center">
          <UiButton :size="'small'" @click="startNewChat"> Новый чат</UiButton>
        </div>
      </div>

      <div class="messenger__chats">
        <div
          v-for="chat in showedChats"
          :key="chat.id"
          :class="[
            'messenger__chats__chat',
            { messenger__chats__chat_active: activeChatId === chat.id },
          ]"
          @click="onClickChatItem(chat.id)"
        >
          <div class="messenger__chats__chat__title">{{ chat.title }}</div>
          <div class="messenger__chats__chat__info">
            <div class="messenger__chats__chat__info__region">{{ chat.dateAndStatusText }}</div>
            <div class="messenger__chats__chat__info__badges">
              <UiBadges v-if="chat.badges && chat.badges.length" :badges="chat.badges" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="messenger__right-side">
      <Chat
        :chat-id="activeChatId"
        :channel-id="activeChat?.channelId"
        :dialog-client-id="activeChat?.dialogClientId"
        :chat-mode="activeChat?.mode"
        :show-loading="showChatLoading"
        :message-templates="messageTemplates"
        @start-dialog="onStartDialog"
        @take-dialog="onTakeDialog"
        @finish-dialog="onFinishDialog"
        @change-chat="onChangeCurrentChat"
        @close-chat="onCloseChat"
      />
    </div>

    <NewChatModal @create="onCreateNewChat" @already-exist="onSelectAlreadExistChat" />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { GetCurrentDialogs, StartDialog, TakeDialog, FinishDialog } from '@/core/api/dialogs.api'
import type { Chat } from '@/core/interface/Chat'
import { onUnmounted } from 'vue'
import type { IUserProfileDto } from '@/core/interface/Auth'
import { useToast } from 'vue-toastification/dist/index.mjs'

const toast = useToast()

const dialogsStore = useDialogStore()
const { myChats, otherChats, chatsOpenOrder } = storeToRefs(dialogsStore)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const route = useRoute()

const messageTemplates = computed(() => {
  return user.value?.ChatTemplates || []
})

let isFirstLoadDialogs = true

const getCurrentDialogs = (searchValue: string = '') => {
  GetCurrentDialogs(searchValue).then(({ data, error }) => {
    if (error) {
      toast.error('Ошибка при загрузке диалогов: ', error)
      return
    }

    if (!data) {
      toast.error('Ошибка при загрузке диалогов')
      return
    }

    const myChats = data.MyDialogs.map((dialog) =>
      dialogToChatModel({ dialog, user: user.value as IUserProfileDto }),
    )
    const otherChats = data.OtherDialogs.map((dialog) =>
      dialogToChatModel({ dialog, user: user.value as IUserProfileDto }),
    )

    dialogsStore.setChats(myChats, otherChats)

    if (isFirstLoadDialogs) {
      isFirstLoadDialogs = false

      const dialogInUrl = Number(route.query.dialog)

      if (!dialogInUrl) {
        return
      }

      if (myChats.find((chat) => chat.id === dialogInUrl)) {
        activeChatId.value = dialogInUrl
        return
      }

      if (otherChats.find((chat) => chat.id === dialogInUrl)) {
        activeChatId.value = dialogInUrl
        currentLeftMenuTabId.value = OtherChatsTabID
        return
      }

      router.replace({ query: {} })
    }
  })
}

getCurrentDialogs()

const updateCurrentDialogsIntervalID = setInterval(() => {
  getCurrentDialogs(searchValue.value)
}, 10000)

onUnmounted(() => {
  clearInterval(updateCurrentDialogsIntervalID)
})

const sharedModals = useSharedModalsStore()

const searchValue = ref('')

const onSearch = _.debounce((value: string) => {
  searchValue.value = value
  getCurrentDialogs(value)
}, 200)

const startNewChat = () => {
  sharedModals.setModal({
    name: 'new-chat-modal',
  })
}

const MyChatsTabID = 'my'
const OtherChatsTabID = 'other'

const leftMenuTabs = [
  {
    id: MyChatsTabID,
    title: 'Мои чаты',
  },
  {
    id: OtherChatsTabID,
    title: 'Другие',
  },
]

const currentLeftMenuTabId = ref(leftMenuTabs[0].id)
const onChangeLeftMenuTabs = ({ id }: { id: number }) => {
  getCurrentDialogs()
  currentLeftMenuTabId.value = id
}

const activeChatId = ref<null | number>(null)
const activeChat = computed(() => {
  if (!activeChatId.value) return

  return (
    myChats.value.find((chat) => chat.id === activeChatId.value) ||
    otherChats.value.find((chat) => chat.id === activeChatId.value)
  )
})

const onClickChatItem = (chatId: number) => {
  activeChatId.value = chatId
  router.replace({ query: { dialog: chatId } })
}

const onChangeCurrentChat = (chatId: number) => {
  activeChatId.value = chatId
  router.replace({ query: { dialog: chatId } })
}

const onCloseChat = (chatId: number) => {
  dialogsStore.removeChatFromOrder(chatId)
  activeChatId.value = chatsOpenOrder.value[0]
  router.replace({ query: { dialog: chatsOpenOrder.value[0] } })
}

const showedChats = computed(() => {
  if (currentLeftMenuTabId.value === MyChatsTabID) {
    return myChats.value
  }

  if (currentLeftMenuTabId.value === OtherChatsTabID) {
    return otherChats.value
  }

  return []
})

const onCreateNewChat = (chat: Chat) => {
  dialogsStore.addMyChat(chat)
  activeChatId.value = chat.id
  router.replace({ query: { dialog: chat.id } })
}

const showChatLoading = ref(false)

const onStartDialog = () => {
  if (!activeChatId.value) return

  showChatLoading.value = true
  StartDialog({ LongParamValue: activeChatId.value })
    .then(({ data, error }) => {
      if (error) {
        toast.error('Ошибка при старте диалога: ', error)
        return
      }

      if (!data) {
        toast.error('Ошибка при старте диалога')
        return
      }
    })
    .finally(() => {
      showChatLoading.value = false
    })
}

const onTakeDialog = () => {
  if (!activeChatId.value) return

  showChatLoading.value = true

  TakeDialog({ LongParamValue: activeChatId.value })
    .then(({ data, error }) => {
      if (error) {
        toast.error('Ошибка при попытке забрать диалог: ', error)
        return
      }

      if (!data) {
        toast.error('Ошибка при попытке забрать диалог')
        return
      }

      if (!user.value) return

      dialogsStore.addMyChat(
        dialogToChatModel({
          dialog: data,
          user: user.value,
        }),
      )
    })
    .finally(() => {
      currentLeftMenuTabId.value = MyChatsTabID
      showChatLoading.value = false
    })
}

const onFinishDialog = () => {
  if (!activeChatId.value || !user.value) return
  const userValue = user.value
  const chatId = activeChatId.value

  showChatLoading.value = true
  FinishDialog({ LongParamValue: chatId })
    .then(({ data, error }) => {
      if (error) {
        // TODO handle error
        return
      }

      if (!data) {
        // TODO hadle empty data
        return
      }

      const chat = dialogToChatModel({
        user: userValue,
        dialog: data,
      })

      dialogsStore.updateChat(chat)
    })
    .finally(() => {
      showChatLoading.value = false
    })
}

const onSelectAlreadExistChat = (dialogId: number) => {
  const chatExistInMyChats = myChats.value.find((chat) => chat.id === dialogId)

  if (chatExistInMyChats) {
    activeChatId.value = dialogId
    router.replace({ query: { dialog: dialogId } })
    return
  }

  const chatExistInOthersChat = otherChats.value.find((chat) => chat.id === dialogId)

  if (chatExistInOthersChat) {
    currentLeftMenuTabId.value = OtherChatsTabID
    activeChatId.value = dialogId
    router.replace({ query: { dialog: dialogId } })
    return
  }

  console.error('Try set active not loaded chat!', dialogId)
}
</script>

<style scoped lang="scss">
.messenger {
  display: grid;
  grid-template-columns: 430px calc(100vw - 430px);
  grid-template-rows: calc(100vh - 50px);

  &__left-side {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 64px 42px auto;
  }

  &__right-side {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
    box-shadow: 0px 16px 30px 0px #071f2d33;
  }

  &__search {
    padding: 20px 20px 12px;
  }

  &__tabs {
    display: grid;
    grid-template-columns: auto 106px;
    grid-template-rows: 1fr;
    padding: 0 20px 0 0;
    background: var(--header-background);
  }

  &__chats {
    display: flex;
    flex-direction: column;
    padding: 20px 0 0;
    background-color: var(--color-background);

    &__chat {
      height: 61px;
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 18px 18px;
      grid-gap: 2px;
      border-top: 1px solid var(--color-border);
      padding: 12px 20px;

      &:last-child {
        border-bottom: 1px solid var(--color-border);
      }

      &:hover {
        cursor: pointer;
        background-color: var(--component-hover);
      }

      &_active {
        background: var(--component-background);
        z-index: 1;
      }

      &__title {
        color: var(--color-font);
        font-size: var(--font-size-14);
        font-weight: var(--font-weight-600);
        line-height: 120%;
      }

      &__info {
        display: grid;
        grid-template-columns: minmax(50px, 270px) minmax(50px, 150px);
        grid-template-rows: 1fr;

        &__region {
          text-overflow: ellipsis;
          overflow: hidden;
          word-wrap: break-word;
          white-space: nowrap;
        }

        &__date {
          display: flex;
          align-items: center;
          color: var(--text-grey, #8990a2);
          font-size: var(--font-size-standart);
          font-weight: var(--font-weight-400);
        }

        &__badges {
          display: flex;
          align-items: center;
          justify-content: end;
        }
      }
    }
  }
}
</style>
