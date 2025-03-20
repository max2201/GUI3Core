<template>
  <UiModal :name="NewChatModalName" size="normal" is-form @close="onCloseModal">
    <div class="new-chat-modal">
      <h3 class="new-chat-modal__title">Добавление нового чата</h3>

      <div class="new-chat-modal__contact">
        <UiSearchableSelect
          :value="newChatForm.contact"
          :options="contacts"
          :loading="isShowContactsLoading"
          option-label-key="BaseObjectName"
          option-value-key="nameForSelectValue"
          label="Контакт"
          @on-select="onSelectContact"
          @search="onSearchContact"
        />
      </div>

      <div class="new-chat-modal__number">
        <UiSelect1
          v-model="newChatForm.number"
          :options="contactNumbers"
          :disabled="!contactNumbers.length"
          select-label="Контактный номер"
          label=""
        />
      </div>
      <div class="new-chat-modal__channel">
        <UiSelect1
          v-model="newChatForm.channel"
          :options="channels"
          :disabled="!channels.length"
          label="title"
          select-label="Канал общения"
        />
      </div>
      <div class="new-chat-modal__start">
        <UiSelect1
          v-model="newChatForm.startTemplate"
          :options="startTemplates"
          :disabled="!newChatForm.number && !newChatForm.channel"
          select-label="Как начать чат"
        />
      </div>
    </div>

    <template #buttons>
      <div class="new-chat-modal__buttons">
        <div></div>
        <div>
          <UiButton1
            :loading="loadingCreateChat"
            :disabled="isDisableCreateChat"
            @click="handleCreateChat"
          >
            Сохранить
          </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { reactive, unref } from 'vue'
import type { IClientContact } from '@/core/interface/ClientContact'
import { NewChatModalName } from '@/core/constants/NewChatModalName'
import { CreateNewDialog, GetDialogsChannels } from '@/core/api/dialogs.api'
import type { IDialogChannel } from '@/core/interface/DialogChannel'
import { GetClientAutoCompleteList, GetClientPhones } from '@/core/api/clients.api'
import { dialogToChatModel } from '@/core/utils/dialogToChatModel'
import { useToast } from 'vue-toastification/dist/index.mjs'

interface IExtendedClientContact extends IClientContact {
  nameForSelectValue: string
}

const contacts = ref<IExtendedClientContact[]>([])
const contactNumbers = ref<string[]>([])

interface ExtendedIDialogChannel extends IDialogChannel {
  title: string
  value: number
}

const channels = ref<ExtendedIDialogChannel[]>([])
const startTemplates = ref<any[]>([
  {
    label: 'без сообщений',
    value: 0,
  },
])

const newChatForm = reactive<{
  contact: IClientContact | null
  number: any
  channel: IDialogChannel | null
  startTemplate: any
}>({
  contact: null,
  number: null,
  channel: null,
  startTemplate: startTemplates.value[0],
})

const onSelectContact = (value: IClientContact) => {
  newChatForm.contact = value || null

  if (!value) {
    newChatForm.number = null
    contactNumbers.value = []
    return
  }

  GetClientPhones(value.Id).then(({ data }) => {
    if (!data) return

    contactNumbers.value = [...data]

    if (contactNumbers.value.length) {
      newChatForm.number = contactNumbers.value[0]
    }
  })
}

const isShowContactsLoading = ref(false)

const onSearchContact = (value: string) => {
  if (value.charAt(value.length - 1) !== ' ') {
    return
  }

  isShowContactsLoading.value = true

  GetClientAutoCompleteList(value)
    .then(({ data }) => {
      if (!data) return

      contacts.value =
        [...data].map((contact) => {
          return {
            ...contact,
            nameForSelectValue: contact.BaseObjectName.split(',').join(' ,') + ' ',
          }
        }) || []
    })
    .finally(() => {
      isShowContactsLoading.value = false
    })
}

const loadingCreateChat = ref(false)

const isDisableCreateChat = computed(() => {
  return false
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const dialogsStore = useDialogStore()
const sharedModals = useSharedModalsStore()

const emit = defineEmits(['create', 'alreadyExist'])

const toast = useToast()

const handleCreateChat = () => {
  const ClientId = newChatForm.contact?.Id
  const ChannelId = newChatForm.channel?.channelId

  if (!ClientId || !ChannelId) return

  loadingCreateChat.value = true

  CreateNewDialog({
    ClientId,
    ChannelId,
    PhoneIndex: contactNumbers.value.findIndex((num) => num === newChatForm.number),
  })
    .then(({ data, error }) => {
      if (error) {
        toast.error('Ошибка при попытке создать диалог: ' + error)

        return
      }

      if (!data) {
        toast.error('Ошибка при попытке создать диалог')
        return
      }

      if (!user.value) return

      if (data.AlreadyExists) {
        emit('alreadyExist', data.DialogId)
        clearForm()
        sharedModals.closeModal()
        return
      }

      const chat = dialogToChatModel({
        user: user.value,
        dialog: data,
        contactNumbers: contactNumbers.value,
      })

      emit('create', chat)
      clearForm()
      sharedModals.closeModal()
    })
    .finally(() => {
      loadingCreateChat.value = false
    })
}

GetDialogsChannels().then(({ data }) => {
  if (!data) {
    return
  }

  channels.value =
    data?.map((channel) => {
      return {
        ...unref(channel),
        title: `${channel.plainId} (${channel.transport})`,
        value: channel.id,
      } as ExtendedIDialogChannel
    }) || []

  if (channels.value.length) {
    newChatForm.channel = channels.value[0]
  }
})

const clearForm = () => {
  newChatForm.contact = null
  newChatForm.number = null

  contacts.value = []
  contactNumbers.value = []
}

const onCloseModal = () => {
  clearForm()
}
</script>

<style lang="scss" scoped>
.new-chat-modal {
  display: grid;
  grid-template-columns: repeat(3, calc(33% - 5px));
  grid-template-rows: 21px 52px 52px;
  grid-gap: 16px;
  grid-template-areas:
    'title title title'
    'contact contact contact'
    'number channel start';
}

.new-chat-modal__title {
  grid-area: title;
}
.new-chat-modal__contact {
  grid-area: contact;
}
.new-chat-modal__number {
  grid-area: number;
}
.new-chat-modal__channel {
  grid-area: channel;
}
.new-chat-modal__start {
  grid-area: start;
}

.new-chat-modal__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
