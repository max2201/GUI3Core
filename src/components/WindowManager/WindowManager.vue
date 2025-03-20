<template>
  <div class="window" :class="[isOpened && '_active', !isFlags && 'grid-3']" ref="windowRef">
    <template v-if="isOpened">
      <WindowTabs class="window__tabs" @click.prevent />
      <WindowHead :class="[WindowHeadClass, 'window__head']" @click.prevent />
      <WindowFlags v-if="isFlags" />
      <WindowContent :class="[WindowContentClass, 'window__content']" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import { findEventParentWithClass } from '@/core/utils/findEventParentWithClass'
import { WindowHeadClass, WindowContentClass } from '@/core/constants/GlobalClassNames'

const dialogStore = useWindowStore()
const { isOpened, tabs, activeTab } = storeToRefs(dialogStore)

const windowRef = ref(null)
const isFlags = computed(() => activeTab.value?.object.getCurrentState()?.Flags)
let lastEventTimestamp = 0
let lastEventX = 0
let lastEventY = 0
let timeout

const clickOutsideCallback = (event) => {
  const foundParentWithStopClass = findEventParentWithClass(
    event,
    StopClickOutsideClasses.windowManager,
  )
  if (foundParentWithStopClass) {
    return
  }

  const isClickOnTableTr = findEventParentWithClass(event, StopClickOutsideClasses.tableTr)

  if (
    isClickOnTableTr &&
    timeout &&
    (event.timeStamp - lastEventTimestamp) / 1000 < 0.5 &&
    event.x === lastEventX &&
    event.y === lastEventY
  ) {
    clearTimeout(timeout)
    return
  }

  lastEventTimestamp = event.timeStamp
  lastEventX = event.x
  lastEventY = event.y

  if (isClickOnTableTr) {
    timeout = setTimeout(() => {
      dialogStore.closeWindow()
    }, 500)
    return
  }
  if (event.target.classList.contains(StopClickOutsideClasses.pageBody)) {
    return
  }
  dialogStore.closeWindow()
}

onClickOutside(windowRef, clickOutsideCallback)

watch(
  () => tabs.value,
  (newTabs) => {
    if (!newTabs || newTabs.length === 0) {
      dialogStore.closeWindow()
    }
  },
)
</script>

<style lang="scss" scoped>
.window {
  position: fixed;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 38px 50px 44px 1fr;
  width: 1120px;
  height: calc(100vh - 55px);
  overflow: hidden;
  z-index: 9;
  top: 55px;
  right: 0px;
  bottom: 0;
  background: #ffffff;
  border-width: 0px 0px 0px 1px;
  border-style: solid;
  border-color: var(--color-border);
  border-radius: 5px 0 0 0;
  box-shadow: 0px 16px 30px rgba(7, 31, 45, 0.2);
  opacity: 0;
  transform: translate(30px, 0px);
  pointer-events: none;
  transition:
    transform 0.25s $ease,
    opacity 0.15s $ease;
  &.grid-3 {
    grid-template-rows: 38px 50px 1fr;
  }
  &._active {
    opacity: 1;
    transform: none;
    pointer-events: all;
  }
  &__tabs,
  &__head {
    flex: 0 0 auto;;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 38px 1fr;
    overflow: hidden;
  }
}

@media (max-width: 1200px) {
  .window {
    width: 800px;
  }
}
</style>
