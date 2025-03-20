<template>
  <div class="chat-messages">
    <div ref="messagesWrapperDiv" class="chat-messages-wrapper">
      <div v-if="!messagesGroupsByDate.length" class="chat-empty-wrapper">
        <div class="chat-empty">
          <SvgIcon name="chat-empty" class="chat-empty-icon" />
          <span>В чате пока нет сообщений.</span>
        </div>
      </div>

      <div class="chat-messages__history-loader">
        <UiLoader v-if="loadingMessagesHistory" theme="inline" loading />
      </div>

      <div v-if="showEndOfHistory" class="chat-messages-wrapper__end-of-history">
        Начало истории сообщения
      </div>

      <div
        v-for="(group, index) in messagesGroupsByDate"
        :key="index + '-group'"
        :class="[
          'chat-messages-wrapper__group',
          {
            'chat-messages-wrapper__group_my': !group.isClientMessages,
          },
        ]"
      >
        <div class="chat-messages-wrapper__group-info">
          {{ group.date }}, {{ group.time }}, {{ group.fullname }}
          <MessageStatusIcon :status="group.status" />
        </div>

        <template
          v-for="(message, index) in group.messages"
          :key="index + '-message-' + message.id"
        >
          <div v-if="message.showTime && index !== 0" class="chat-messages-wrapper__group-time">
            {{ message.time }}
          </div>
          <div
            :class="[
              'chat-messages-wrapper__message',
              {
                'chat-messages-wrapper__message_my': !group.isClientMessages,
              },
            ]"
          >
            <ChatMultipleMessage v-if="message.submessages" :messages="message.submessages" />
            <MessageContent v-else :message="message" />
          </div>
        </template>
      </div>
      <div
        v-if="loadingSendedMessage"
        class="chat-messages-wrapper__group chat-messages-wrapper__group_my chat-messages-wrapper__group_loader"
      >
        <div class="chat-messages-wrapper__message chat-messages-wrapper__message_loader">
          <UiLoader theme="inline" loading />
        </div>
      </div>
    </div>

    <div
      :class="[
        'chat-messages__button-down',
        {
          'chat-messages__button-down_show': isShowButtonDown,
        },
      ]"
      @click="scrollToBottom"
    >
      Вниз
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import type { IChatMessageGroup } from '@/core/interface/Chat'
import { onUnmounted } from 'vue'

const props = defineProps<{
  messagesGroupsByDate: IChatMessageGroup[]
  loadingMessagesHistory: boolean
  loadingSendedMessage: boolean
  showEndOfHistory?: boolean
}>()

const messagesWrapperDiv = ref<HTMLDivElement>()

let isChatHasMessages = false

const isShowButtonDown = ref(false)

let lastScrollDiff = 0
let lastScrollHeight = 0

const scrollToBottom = () => {
  if (!messagesWrapperDiv.value) return

  messagesWrapperDiv.value.scrollTo(
    0,
    messagesWrapperDiv.value.scrollHeight - messagesWrapperDiv.value.clientHeight
  )
  lastScrollDiff = 0
  lastScrollHeight = messagesWrapperDiv.value.scrollHeight
}

const checkShowButtonDown = _.debounce(() => {
  if (!messagesWrapperDiv.value) return

  lastScrollDiff =
    messagesWrapperDiv.value.scrollHeight -
    messagesWrapperDiv.value.clientHeight -
    messagesWrapperDiv.value.scrollTop
  lastScrollHeight = messagesWrapperDiv.value.scrollHeight

  if (
    messagesWrapperDiv.value.scrollHeight -
      messagesWrapperDiv.value.clientHeight -
      messagesWrapperDiv.value.scrollTop >
    20
  ) {
    isShowButtonDown.value = true
  } else {
    isShowButtonDown.value = false
  }
})

watch(
  () => props.messagesGroupsByDate,
  () => {
    nextTick(() => {
      if (!messagesWrapperDiv.value) return

      if (lastScrollDiff === 0) {
        messagesWrapperDiv.value.scrollTo(
          0,
          messagesWrapperDiv.value.scrollHeight - messagesWrapperDiv.value.clientHeight
        )
      } else if (
        messagesWrapperDiv.value.scrollTop === 0 &&
        lastScrollHeight < messagesWrapperDiv.value.scrollHeight
      ) {
        messagesWrapperDiv.value.scrollTo(
          0,
          messagesWrapperDiv.value.scrollHeight - lastScrollHeight
        )
      } else {
        checkShowButtonDown()
      }
    })
  }
)

const emits = defineEmits(['load-history-messages'])

const onscrollMessagesWrapper = _.debounce(() => {
  if (!messagesWrapperDiv.value) return

  checkShowButtonDown()

  if (messagesWrapperDiv.value.scrollTop < 20) {
    emits('load-history-messages')
  }
}, 100)

let messageWrapperResizeObserver: ResizeObserver

const startWatchScroll = () => {
  if (!messagesWrapperDiv.value) {
    console.warn('Can\'t start watch scroll for messages wrapper - no wrapper div')
    return
  }

  messagesWrapperDiv.value.addEventListener('scroll', onscrollMessagesWrapper)

  messageWrapperResizeObserver = new ResizeObserver(checkShowButtonDown)
  messageWrapperResizeObserver.observe(messagesWrapperDiv.value)
}

const endWatchSCroll = () => {
  if (messagesWrapperDiv.value) {
    messagesWrapperDiv.value.removeEventListener('scroll', checkShowButtonDown)
  }

  if (messageWrapperResizeObserver) {
    messageWrapperResizeObserver.disconnect()
  }
}

const unwatchFirstPaintMessages = watch(
  () => props.messagesGroupsByDate,
  () => {
    nextTick(() => {
      if (!messagesWrapperDiv.value) return

      messagesWrapperDiv.value.scrollTop = messagesWrapperDiv.value.scrollHeight
      unwatchFirstPaintMessages()

      if (!isChatHasMessages) {
        isChatHasMessages = true
        setTimeout(startWatchScroll, 0)
      }
    })
  }
)

onMounted(() => {
  if (!messagesWrapperDiv.value || !isChatHasMessages) return

  startWatchScroll()
})

onUnmounted(() => {
  endWatchSCroll()
})
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

.chat-messages {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;

  &__history-loader {
    display: block;
    width: 100%;

    .loader {
      margin: auto;
      width: fit-content;
    }
  }

  &__button-down {
    display: block;
    position: absolute;
    bottom: -40px;
    left: calc(50% - 50px);
    opacity: 0;
    transition: all 0.2s ease;
    padding: 4px 24px;
    border-radius: 10px;
    border: var(--border-default);
    background-color: var(--color-background);

    &_show {
      bottom: 15px;
      opacity: 1;

      &:hover {
        cursor: pointer;
      }
    }

    &:hover {
      border-color: var(--color-primary-hover);
      background-color: var(--color-primary-hover);
    }
  }
}

.chat-messages-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 39px 0 13px;
  background-color: var(--component-background);
  overflow-y: auto;
  white-space: break-spaces;

  &__group {
    display: flex;
    gap: 4px;
    flex-direction: column;
    width: 100%;
    padding: 0 32px;

    &-info,
    &-time {
      display: flex;
      align-items: center;
      color: var(--color-gray);
      font-size: var(--font-size-14);
    }

    &_my {
      align-items: flex-end;
    }
  }

  &__message {
    border-radius: 5px;
    width: fit-content;
    max-width: 88%;
    padding: 16px;
    background-color: var(--color-primary-selected);
    word-wrap: break-word;

    &_my {
      background-color: var(--color-background);
    }

    &_loader {
      padding: 0 16px 4px;
      background-color: transparent;
    }
  }

  &__end-of-history {
    display: inline-block;
    align-self: center;
    border-radius: 5px;
    color: var(--color-font-disabled);
  }
}
</style>
