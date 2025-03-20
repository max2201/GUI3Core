<template>
  <div ref="liteViewRef" class="lite-view-root">
    <div
      v-if="openedLiteView.type"
      class="lite-view"
      :class="[
        StopClickOutsideClasses.windowManager,
        StopClickOutsideClasses.headerTasks,
        StopClickOutsideClasses.headerNotification,
        StopClickOutsideClasses.universalWrapper,
      ]"
      :style="[
        {
          top: openedLiteView.top + 'px',
          left: openedLiteView.left + 'px',
          right: openedLiteView.right && openedLiteView.right + 'px',
          bottom: openedLiteView.bottom && openedLiteView.bottom + 'px',
          height: openedLiteView.height && openedLiteView.height + 'px',
          width: openedLiteView.width && openedLiteView.width + 'px',
        },
      ]"
    >
      <UiLoader :loading="loading" theme="page" />

      <div
        v-if="!loading"
        class="lite-view__header"
        :class="{
          'lite-view__header--call':
            openedLiteView.type === BaseObjectType.AICall ||
            openedLiteView.type === BaseObjectType.Call,
        }"
      >
        <div>
          <SvgIcon name="chevrons-right" :width="24" :height="24" is-link @click="onClickClose" />

          <span class="ml-2">
            {{ openedLiteView.title }}
          </span>
        </div>
        <div>
          <SvgIcon
            name="arrow-circle-right"
            :width="24"
            :height="24"
            is-link
            @click="onClickOpenFullView"
          />
        </div>
      </div>

      <CallLiteView
        v-if="openedLiteView.type === BaseObjectType.Call && liteViewData"
        :call-data="liteViewData"
      />
      <AICallLiteView
        v-else-if="openedLiteView.type === BaseObjectType.AICall && liteViewData"
        :call-data="liteViewData"
      />
      <LiteViewBody v-else :liteViewBlocks="liteViewBlocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { LiteViewArgs } from '@/core/interface/LiteView'
import type { IObjectDto, LiteViewBlockGroup } from '@/core/interface/Object'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import { GetObjectDto } from '@/core/api/object.api'
import { LiteViewBlockWidth, LiteViewBlocksGap, LiteViewPaddingWidth } from './constants'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { BaseObjectType } from '@/core/constants/BaseObjectType'

const loading = ref(true)
const DefaultViewState = Object.freeze({
  title: '',
  type: 0,
  id: 0,
})

const openedLiteView = reactive<{
  title: string
  type: number
  top?: number
  left?: number
  right?: number
  bottom?: number
  height?: number
  width?: number
  id: number
}>({
  title: DefaultViewState.title,
  type: DefaultViewState.type,
  top: undefined,
  left: undefined,
  right: undefined,
  bottom: undefined,
  height: undefined,
  width: undefined,
  id: DefaultViewState.id,
})

const liteViewBlocks = ref<LiteViewBlockGroup[]>([])
const liteViewData = ref<IObjectDto>()

const parseLiteViewBlockGroups = (blocks?: LiteViewBlockGroup[]) => {
  if (!blocks) return
  if (!Array.isArray(blocks)) return

  liteViewBlocks.value = blocks
}

const calcPosition = (initLeft: number, initTop: number) => {
  const viewWidth =
    liteViewBlocks.value.length * LiteViewBlockWidth +
    Math.trunc(liteViewBlocks.value.length / 2) * LiteViewBlocksGap +
    LiteViewPaddingWidth * 2

  const documentWidth = document.body.getBoundingClientRect().width

  if (viewWidth + initLeft > documentWidth) {
    openedLiteView.left = documentWidth - viewWidth
  } else {
    openedLiteView.left = initLeft
  }

  openedLiteView.top = initTop
}

const onOpenLiteView = async (args: LiteViewArgs) => {
  openedLiteView.id = args.objectId
  openedLiteView.type = args.baseObjectType
  openedLiteView.title = args.baseObjectName
  openedLiteView.left = args.left
  openedLiteView.top = args.top
  openedLiteView.right = args.right
  openedLiteView.bottom = args.bottom
  openedLiteView.width = args.width
  openedLiteView.height = args.height
  console.log('onOpenLiteView', args)

  await GetObjectDto({
    ObjectId: args.objectId,
    BaseObjectType: args.baseObjectType,
    DtoViewType: DtoObjectViewType.LiteView,
  }).then((result) => {
    if (!result) return
    liteViewData.value = result.data
    console.log('GetObjectDto result', !!result, result?.data?.LiteViewBlockGroups)
    parseLiteViewBlockGroups(result?.data?.LiteViewBlockGroups)
    if (args.left && args.top) {
      calcPosition(args.left, args.top)
    }
    openedLiteView.title = result.data?.WindowTitle

    loading.value = false
  })
}

EventBus.on(GlobalEvents.OpenLiteView, onOpenLiteView)

const closeLiteVIew = () => {
  loading.value = true
  openedLiteView.type = DefaultViewState.type
  openedLiteView.title = DefaultViewState.title
  openedLiteView.left = DefaultViewState.left
  openedLiteView.top = DefaultViewState.top
  openedLiteView.id = DefaultViewState.id
  liteViewBlocks.value = []
  liteViewData.value = null
}
EventBus.on(GlobalEvents.CloseLiteView, closeLiteVIew)

const liteViewRef = ref()
onClickOutside(liteViewRef, () => {
  closeLiteVIew()
})

const onClickClose = () => {
  closeLiteVIew()
}

const windowStore = useWindowStore()
const sharedModals = useSharedModalsStore()

const onClickOpenFullView = async () => {
  const object = createObjectInstance(openedLiteView.id, openedLiteView.type)
  await object.loadData()
  const currentRouteName = router.currentRoute.value.name as string
  if (currentRouteName === 'object-page') {
    const routeData = router.resolve({
      name: RouteNames[Routes.objectPage],
      params: {
        type: object.type,
        id: object.id,
      },
    })
    window.open(routeData.href, '_blank')
  } else {
    windowStore.addTab({
      id: object.id,
      title: object.rawData?.WindowTitle,
      type: object.type,
      data: object.rawData,
      object,
    })
  }
  closeLiteVIew()
}
</script>

<style scoped lang="scss">
.lite-view {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: var(--z-index-liteview);
  min-width: 420px;
  min-height: 200px;
  background-color: var(--component-background);
  box-shadow: -5px 4px 40px 0px #32517559;
}

.lite-view__header {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--component-green-background);
  color: var(--component-green-color);
  padding: 0 20px;

  > div {
    display: flex;
    align-items: center;
  }
  &--call {
    background-color: #b86fe4;
  }
}
</style>
