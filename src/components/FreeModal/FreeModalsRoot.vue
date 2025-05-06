<template>
  <div ref="freeModalRef" class="free-modal-root">
    <div
      v-if="openedFreeModal.target"
      class="free-modal"
      :class="[
        StopClickOutsideClasses.windowManager,
        StopClickOutsideClasses.headerTasks,
        StopClickOutsideClasses.headerNotification,
        StopClickOutsideClasses.universalWrapper,
      ]"
      :style="[
        {
          top: openedFreeModal.top + 'px',
          left: openedFreeModal.left + 'px',
          right: openedFreeModal.right && openedFreeModal.right + 'px',
          bottom: openedFreeModal.bottom && openedFreeModal.bottom + 'px',
          height: openedFreeModal.height && openedFreeModal.height + 'px',
          width: openedFreeModal.width && openedFreeModal.width + 'px',
        },
        openedFreeModal.options?.styles?.window,
      ]"
    >
      <div class="free-modal__header" :style="openedFreeModal.options?.styles?.header">
        <!--        <div>-->
        <SvgIcon
          :style="openedFreeModal.options?.styles?.headerCloseIcon"
          :name="openedFreeModal.options?.headerCloseIcon || 'chevrons-right'"
          :width="24"
          :height="24"
          is-link
          @click="onClickClose"
        />

        <span>
          {{ openedFreeModal.title }}
        </span>
        <!--        </div>-->
      </div>

      <ClientEditForm
        v-if="openedFreeModal.target === FreeModalTarget.EditClient"
        :object="openedFreeModal.object as IObjectDto"
        @close="onCloseModal"
      />

      <ObjectNotifications
        v-if="openedFreeModal.target === FreeModalTarget.ObjectNotifications"
        :object="openedFreeModal.object"
        @close="onCloseModal"
      />

      <LiteViewBody
        v-if="openedFreeModal.target === FreeModalTarget.MetaDataGroups"
        :lite-view-blocks="openedFreeModal.object"
      />

      <WidgetEdit
        v-if="openedFreeModal.target === FreeModalTarget.WidgetEdit"
        :widget-params="openedFreeModal.object"
        @close="onCloseModal"
      ></WidgetEdit>

      <WidgetView
        v-if="openedFreeModal.target === FreeModalTarget.WidgetView"
        :widget-params="openedFreeModal.object"
        @close="onCloseModal"
      ></WidgetView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { FreeModalArgs } from '@/core/interface/FreeModal'
import { FreeModalTarget } from '@/core/interface/FreeModal'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import ObjectNotifications from '../Notifications/ObjectNotifications.vue'
import type { IObjectDto } from '@/core/interface/Object'
import { findEventParentWithClass } from '@/core/utils/findEventParentWithClass'

const DefaultViewState = Object.freeze({
  title: '',
  type: 0,
  id: 0,
})

const openedFreeModal = reactive<{
  id: number
  title: string
  target: FreeModalTarget | null
  width: number
  top?: number
  left?: number
  object: any
  right?: number
  bottom?: number
  height?: number
  callback?: (args?: any) => void
  options?: {
    styles?: {
      header?: any
      window?: any
      headerCloseIcon?: any
    }
    headerCloseIcon: string
  } | null
}>({
  id: DefaultViewState.id,
  title: DefaultViewState.title,
  target: null,
  object: null,
  height: undefined,
  width: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  callback: undefined,
  options: null,
})

const calcPosition = (initLeft: number, initTop: number, width: number) => {
  const documentWidth = document.body.getBoundingClientRect().width

  if (width + initLeft > documentWidth) {
    openedFreeModal.left = documentWidth - width
  } else {
    openedFreeModal.left = initLeft
  }

  openedFreeModal.top = initTop
}

const onOpenFreeModal = (args: FreeModalArgs) => {
  openedFreeModal.id = args.objectId
  openedFreeModal.target = args.target
  openedFreeModal.object = args.object
  openedFreeModal.title = args.title
  openedFreeModal.left = args.left
  openedFreeModal.top = args.top
  openedFreeModal.right = args.right
  openedFreeModal.bottom = args.bottom
  openedFreeModal.width = args.width
  openedFreeModal.height = args.height
  openedFreeModal.callback = args.callback
  openedFreeModal.options = args.options

  calcPosition(args.left, args.top, args.width)
}

EventBus.on(GlobalEvents.OpenFreeModal, onOpenFreeModal)

const closeModal = () => {
  openedFreeModal.target = DefaultViewState.target
  openedFreeModal.object = undefined
  openedFreeModal.title = DefaultViewState.title
  openedFreeModal.left = DefaultViewState.left
  openedFreeModal.top = DefaultViewState.top
  openedFreeModal.id = DefaultViewState.id
}

const freeModalRef = ref()
onClickOutside(freeModalRef, (event) => {
  const foundParentWithStopClass = findEventParentWithClass(
    event,
    StopClickOutsideClasses.universalWrapper,
  )

  if (foundParentWithStopClass) {
    return
  }
  closeModal()
})

const onClickClose = () => {
  closeModal()
}

const onCloseModal = (payload: any) => {
  if (typeof openedFreeModal.callback === 'function') {
    openedFreeModal.callback(payload)
  }

  closeModal()
}
</script>

<style scoped lang="scss">
.free-modal {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 42px auto;
  overflow: hidden;
  position: fixed;
  z-index: var(--z-index-liteview);
  min-width: 420px;
  min-height: 200px;
  background-color: var(--component-background);
  box-shadow: -5px 4px 40px 0px #32517559;
}

.free-modal__header {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--color-bg-active);
  color: var(--component-green-color);
  padding: 0 20px;
  gap: 4px;
}
</style>
