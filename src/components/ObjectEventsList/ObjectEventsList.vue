<template>
  <div
    v-if="isShowEventsList"
    ref="wrapperRef"
    :class="[
      'object-events-list-wrapper',
      StopClickOutsideClasses.windowManager,
      StopClickOutsideClasses.universalWrapper,
    ]"
  >
    <div class="object-events-list__header">
      <UiButton1
        @click="onClickClose"
        icon-left="chevrons-right"
        variant="text"
        :icon-size="24"
        theme="transparent"
      ></UiButton1>
      <span>Свернуть события</span>
      <ObjectEventsFilters :filters="filters" @change="onChangeFilters" />
    </div>

    <div class="object-events-list__actions-wrapper">
      <div class="object-events-list__actions">
        <div class="object-events-list__reminder">
          <div class="object-events-list__reminder__header">
            <UiButton1
              @click="onOpenCreateNoty"
              variant="text"
              icon-left="plus-circle"
              :icon-size="24"
              class="mr-2"
            ></UiButton1>
            <span class="mr-2">Напоминания</span>
            <UiCounter :value="2" />
            <UiButton1
              @click="openNotificationsModal"
              variant="text"
              theme="transparent"
              icon-left="arrow-right"
              :icon-size="24"
            ></UiButton1>
          </div>
          <div class="object-events-list__reminder__item background-red">
            <span>Подача документов</span>
            <div class="d-flex flex-align-center">
              <span class="color-red mr-1">06.11.2024</span>
              <SvgIcon :width="18" :height="18" name="alert" class="color-red" />
            </div>
          </div>
        </div>
        <div class="object-events-list__tasks">
          <div class="object-events-list__tasks__header">
            <UiButton1
              variant="text"
              icon-left="plus-circle"
              :icon-size="24"
              class="mr-2"
            ></UiButton1>
            <span class="mr-2">Задачи</span>
            <UiCounter :value="1" />
            <UiButton1
              variant="text"
              theme="transparent"
              icon-left="arrow-right"
              :icon-size="24"
            ></UiButton1>
          </div>
          <div class="object-events-list__tasks__item">
            <span>Утвердить новый договор</span>
            <span class="color-gray">06.11.2024</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="eventsWrapperDiv" class="object-events-list__items-wrapper">
      <UiLoader v-if="isLoadingEventsList" theme="page" loading not-transparent />
      <div v-if="isLoadingNewEvents" class="d-flex flex-align-center">
        <UiLoader loading />
      </div>

      <div v-if="objectEvents.length === 0" class="d-flex flex-justify-center p-5 color-gray">
        Событий нет
      </div>

      <ObjectEventItem
        v-for="(objectEvent, key) in objectEvents"
        :key="key"
        :object-event="objectEvent"
      />

      <div v-if="isLoadingOldEvents" class="d-flex flex-align-center">
        <UiLoader loading />
      </div>

      <div v-if="isLoadedLastOldMessage" class="d-flex flex-justify-center p-5 color-gray">
        Событий больше нет
      </div>
    </div>

    <div
      :class="[
        'object-events-list__button-up',
        {
          'object-events-list__button-up_show': isShowButtonUp,
        },
      ]"
      @click="scrollToUp"
    >
      Вверх
    </div>

    <div class="object-events-list__inputs">
      <UiMultilineInput
        flex-textarea
        :value="messageInputValue"
        :disabled="isSendMessageLoading"
        :files-count="loadedFilesCount"
        placeholder="Введите сообщение"
        image-input-icon
        files-multiple
        clearable
        @on-input="onInputMessageValue"
        @on-change="onChangeMessageValue"
        @on-enter="onSendTextMessage"
        @on-ctrl-enter="onCtrlEnterMessageValue"
        @select-files="onSelectFiles"
        @on-clear="clearLoadedFiles"
      />
      <UiButton1
        size="small"
        :loading="isSendMessageLoading"
        :disabled="!messageInputValue.trim().length && !loadedFiles?.length"
        class="object-events-list__button-send"
        icon-left="send"
        :icon-size="24"
        @click="onSendTextMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { onClickOutside } from '@vueuse/core'
import { onUnmounted, toRaw, unref } from 'vue'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import type { AggregatedEventType } from '@/core/constants/AggregatedEventType'
import type { IFileUploadResult } from '@/core/interface/Files'
import { usePostFiles } from '@/composables/use-post-files'
import { AddNotyModal } from '@/core/constants/ModalsNames'
import type { CreateNotificationModalParams } from '@/core/interface/CreateNotificationModalParams'
import { FreeModalTarget } from '@/core/interface/FreeModal'

const objectEventListStore = useObjectEventListStore()
const {
  filters,
  isShowEventsList,
  objectEvents,
  isLoadingEventsList,
  isLoadingNewEvents,
  isLoadingOldEvents,
  isLoadedLastOldMessage,
  selectedObjectID,
  selectedObjectType,
} = storeToRefs(objectEventListStore)

const wrapperRef = ref(null)

const clickOutsideCallback = (event) => {
  const foundParentWithStopClass = findEventParentWithClass(
    event,
    StopClickOutsideClasses.objectEventsList,
  )
  if (foundParentWithStopClass) {
    return
  }

  objectEventListStore.closeObjectEventsList()
}

onClickOutside(wrapperRef, clickOutsideCallback)

const onClickClose = () => {
  objectEventListStore.closeObjectEventsList()
}

// -------------------------------------- filters

const onChangeFilters = (filters: AggregatedEventType[]) => {
  objectEventListStore.setFilters(unref(toRaw(filters)))
}

// -------------------------------------- message input

const messageInputValue = ref<string>('')

const onInputMessageValue = (value: string) => {
  messageInputValue.value = value
}

const isSendMessageLoading = ref(false)

const onChangeMessageValue = (value: string) => {
  messageInputValue.value = value
}

const onCtrlEnterMessageValue = (value: string) => {
  messageInputValue.value = value + '\n'
}

const loadedFiles = ref<any[] | undefined>()
const loadedFilesCount = computed(() => (loadedFiles.value ? loadedFiles.value.length : 0))

const clearLoadedFiles = () => {
  loadedFiles.value = undefined
}

const onSendTextMessage = () => {
  const MessageText = messageInputValue.value.trim()
  messageInputValue.value = ''

  objectEventListStore.addObjectEvent({
    MessageText,
    Images: loadedFiles.value,
  })

  clearLoadedFiles()
}

// ---------------------------------------------------------- Scroll watching

const eventsWrapperDiv = ref<HTMLDivElement>()

let isChatHasMessages = false

const isShowButtonUp = ref(false)

let lastScrollDiff = 0
let lastScrollHeight = 0

const scrollToUp = () => {
  if (!eventsWrapperDiv.value) return

  eventsWrapperDiv.value.scrollTo(0, 0)
  lastScrollDiff = 0
  lastScrollHeight = eventsWrapperDiv.value.scrollHeight
}

const checkShowButtonDown = _.debounce(() => {
  if (!eventsWrapperDiv.value) return

  lastScrollDiff =
    eventsWrapperDiv.value.scrollHeight -
    eventsWrapperDiv.value.clientHeight -
    eventsWrapperDiv.value.scrollTop
  lastScrollHeight = eventsWrapperDiv.value.scrollHeight

  isShowButtonUp.value = eventsWrapperDiv.value.scrollTop > 50
})

watch(
  () => objectEvents.value,
  () => {
    nextTick(() => {
      if (!eventsWrapperDiv.value) return

      if (lastScrollDiff === 0) {
        eventsWrapperDiv.value.scrollTo(0, 0)
      } else if (
        eventsWrapperDiv.value.scrollTop > 20 &&
        lastScrollHeight < eventsWrapperDiv.value.scrollHeight
      ) {
        eventsWrapperDiv.value.scrollTo(0, eventsWrapperDiv.value.scrollHeight - lastScrollHeight)
      } else {
        checkShowButtonDown()
      }
    })
  },
)

const onscrollMessagesWrapper = _.debounce(() => {
  if (!eventsWrapperDiv.value) return

  checkShowButtonDown()

  if (isLoadedLastOldMessage.value) {
    return
  }

  if (
    eventsWrapperDiv.value.scrollHeight -
      eventsWrapperDiv.value.scrollTop -
      eventsWrapperDiv.value.clientHeight <
    20
  ) {
    objectEventListStore.loadOldObjectEvents()
  }
}, 100)

let messageWrapperResizeObserver: ResizeObserver | undefined

const startWatchScroll = () => {
  if (!eventsWrapperDiv.value) {
    console.warn('Cant start watch scroll for messages wrapper - no wrapper div')
    return
  }

  if (messageWrapperResizeObserver) {
    endWatchSCroll()
  }

  eventsWrapperDiv.value.addEventListener('scroll', onscrollMessagesWrapper)

  messageWrapperResizeObserver = new ResizeObserver(checkShowButtonDown)
  messageWrapperResizeObserver.observe(eventsWrapperDiv.value)
}

const endWatchSCroll = () => {
  if (eventsWrapperDiv.value) {
    eventsWrapperDiv.value.removeEventListener('scroll', checkShowButtonDown)
  }

  if (messageWrapperResizeObserver) {
    messageWrapperResizeObserver.disconnect()
    messageWrapperResizeObserver = undefined
  }
}

const unwatchFirstPaintMessages = watch(
  () => objectEvents.value,
  () => {
    nextTick(() => {
      if (!eventsWrapperDiv.value) return

      eventsWrapperDiv.value.scrollTop = eventsWrapperDiv.value.scrollHeight
      unwatchFirstPaintMessages()

      if (!isChatHasMessages) {
        isChatHasMessages = true
        setTimeout(startWatchScroll, 0)
      }
    })
  },
)

watch(
  () => isShowEventsList.value,
  (value) => {
    if (value) {
      nextTick(() => {
        if (!eventsWrapperDiv.value || !isChatHasMessages) return
        startWatchScroll()
      })
    } else {
      onChangeMessageValue('')
      endWatchSCroll()
      clearLoadedFiles()
    }
  },
)

onMounted(() => {
  if (!eventsWrapperDiv.value || !isChatHasMessages) return

  startWatchScroll()
})

onUnmounted(() => {
  endWatchSCroll()
  clearLoadedFiles()
})

// ----------------------------------- work with files

const { postFiles } = usePostFiles()

const onSelectFiles = (files: File[]) => {
  const requests = [] as Promise<any>[]

  files.forEach((file) => {
    requests.push(postFiles(file))
  })

  const successFiles: IFileUploadResult[] = []

  Promise.allSettled(requests).then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        successFiles.push(result.value)
      }
    })

    loadedFiles.value = successFiles
  })
}

const sharedModals = useSharedModalsStore()
const authStore = useAuthStore()

const onOpenCreateNoty = () => {
  if (!selectedObjectID.value || !selectedObjectType.value) return

  sharedModals.setModal({
    name: AddNotyModal,
    params: {
      creatorName: authStore.user!.CurrentUserName,
      creatorId: authStore.user!.CurrentUserId,
      selectedObjectID: selectedObjectID.value,
      selectedObjectType: selectedObjectType.value,
      fillials: authStore.user!.AviableFilials,
    } as CreateNotificationModalParams,
  })
}

const openNotificationsModal = () => {
  if (!selectedObjectID.value || !selectedObjectType.value) return

  EventBus.emit(GlobalEvents.OpenFreeModal, {
    target: FreeModalTarget.ObjectNotifications,
    object: {
      BaseObjectId: selectedObjectID.value,
      BaseObjectType: selectedObjectType.value,
    },
    title: 'Напоминания',
    top: 92,
    left: document.body.clientWidth - 690,
    height: 720,
    width: 690,
  })
}
</script>

<style lang="scss" scoped>
.object-events-list-wrapper {
  display: grid;
  position: fixed;
  grid-template-columns: 100%;
  grid-template-rows: 46px 106px auto min-content;
  width: 690px;
  height: calc(100vh - 154px);
  top: 94px;
  right: 0;
  background-color: var(--color-background);
  z-index: var(--z-index-event-list);
  border-left: 1px solid var(--color-border);
  box-shadow: -5px 4px 20px 0px rgba(0, 0, 0, 0.15);
}

.object-events-list {
  display: grid;
  height: 690px;
  grid-template-columns: 100%;
  grid-template-rows: 46px 106px auto 66px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 46px;
    width: 100%;
    padding: 0 21px;
    border-bottom: 1px solid var(--color-border);
  }

  &__actions-wrapper {
    display: block;
    width: 100%;
    height: 106px;
    padding: 0 24px;
    background-color: var(--component-background);
  }

  &__actions {
    display: grid;
    width: 100%;
    height: 96px;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    border-bottom: 1px solid var(--color-border);
  }

  &__tasks,
  &__reminder {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 35px 45px;
    gap: 5px;
    padding: 6px 0;

    &__header {
      display: flex;
      align-items: center;
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 6px 9px;
      background-color: var(--color-background);
    }
  }

  &__reminder__item {
    background-color: var(--component-danger-background);
  }

  &__items-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 10px 24px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--component-background);

    > div:not(:last-child) {
      border-bottom: 1px solid var(--color-border);
    }
  }

  &__button-send {
    margin-top: auto;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &__inputs {
    display: grid;
    grid-template-columns: 610px 32px;
    align-items: center;
    height: auto;
    width: 100%;
    border-top: 1px solid var(--color-border);
    padding: 15px 24px;

    :v-deep .input {
      width: 610px;
    }

    :deep(.input__input ) {
      border-top-right-radius: unset;
      border-bottom-right-radius: unset;
    }

    :deep(.input__textarea ) {
      position: static;
    }

    :deep(button.button ) {
      border-bottom-left-radius: unset;
      border-top-left-radius: unset;
    }
  }

  &__button-up {
    display: block;
    position: absolute;
    left: calc(50% - 50px);
    top: 160px;
    opacity: 0;
    transition: opacity 0.2s ease;
    padding: 4px 24px;
    border-radius: 10px;
    border: var(--border-default);
    background-color: var(--color-background);

    &_show {
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
</style>
