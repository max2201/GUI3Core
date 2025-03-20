<template>
  <div
    ref="tabsRef"
    :class="[
      'tabs',
      {
        'tabs--dark': dark,
        tabs_with_left_arrow: showLeftArrow,
        tabs_with_right_arrow: showRightArrow,
        tabs_with_two_arrow: showBothArrow,
        'tabs--divided': divided,
        'tabs--hide-overload': hideOverload,
      },
    ]"
  >
    <div
      v-if="minShowedTab > 0"
      class="tabs__button tabs__left-arrows"
      @click="onClickLeftTabsButton"
    >
      <SvgIcon name="chevrons-left" />
      <span>{{ minShowedTab }}</span>
    </div>

    <div class="tabs__scroller">
      <div
        class="tabs__tab-wrapper"
        :class="{ 'tabs__tab-wrapper--showed': index >= minShowedTab && index <= maxShowedTab }"
        v-for="(tab, index) in tabs"
        :key="tab.id"
      >
        <slot name="tab" :tab="tab" :tab-index="index">
          <UiTab
            class="tabs__tab"
            :dark="dark"
            :transparent="dark || compact"
            :compact="dark || compact"
            :key="tab.id"
            :tab-index="index"
            :active="tab.id === activeTabId"
            :title="tab.title"
            @tab-click="onClickTab(tab)"
            @close-tab="onCloseTab(tab)"
            :color="tab.color"
            :closable="tab.closable"
          ></UiTab>
        </slot>
      </div>
    </div>
    <div
      v-if="maxShowedTab < tabs.length - 1"
      class="tabs__button tabs__right-arrows"
      @click="onClickRightTabsButton"
    >
      <span>{{ tabs.length - maxShowedTab }}</span>
      <SvgIcon name="chevrons-right" />
    </div>

    <div v-if="tabs.length > 1 && !hideOverload" class="tabs__dropdown-tab">
      <UiDropdown :stop-close-outside-class="stopClickOutsideDropdown" :counter-value="tabs.length">
        <template #content>
          <ul :class="['tabs__dropdown', stopClickOusideClass]">
            <li
              v-for="(tab, idx) in tabs"
              :key="idx"
              :class="[
                'tabs__dropdown-item',
                stopClickOusideClass,
                {
                  'tabs__dropdown-item_active': tab.id === activeTabId,
                },
              ]"
              @click="onClickTab(tab)"
            >
              <ObjectPanel
                :title="tab.title"
                :hide-color-mark="!tab.color"
                :badge-color="tab.color"
                :is-stared="tab.isFavorite"
                :classes-for-icons="[stopClickOutsideDropdown]"
                :show-star="tab.showStar"
                :show-close="tab.closable"
                @click-star="() => addObjectToFavorites(tab)"
                @close="() => onCloseTab(tab)"
              />
            </li>
          </ul>
        </template>
      </UiDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import type { InfinityTabsItem } from '@/core/interface/InfinityTabsItem'

const props = defineProps<{
  tabs: InfinityTabsItem[]
  activeTabId: number | string | null
  stopClickOusideClass?: string
  stopClickOutsideDropdown?: string
  divided?: boolean
  dark?: boolean
  compact?: boolean
  hideOverload?: boolean
}>()

const tabsRef = ref<HTMLDivElement | null>(null)
const limitOfShowedTabs = ref(0)
const minShowedTab = ref(0)
const maxShowedTab = ref(0)

const showLeftArrow = computed(
  () => minShowedTab.value > 0 && maxShowedTab.value >= props.tabs.length - 1,
)
const showRightArrow = computed(
  () => minShowedTab.value === 0 && maxShowedTab.value < props.tabs.length - 1,
)
const showBothArrow = computed(
  () => minShowedTab.value > 0 && maxShowedTab.value < props.tabs.length - 1,
)
const offsetForArrows = computed(() => {
  if (showBothArrow.value) return 28
  if (showLeftArrow.value || showRightArrow.value) return 14
  return 0
})

const callShowedTabsBorders = () => {
  const indexOfActiveTab = props.tabs.findIndex((tab) => tab.id === props.activeTabId)
  if (indexOfActiveTab === -1 || !limitOfShowedTabs.value) return

  if (indexOfActiveTab >= minShowedTab.value && indexOfActiveTab <= maxShowedTab.value) return

  const halfOfLimit = Math.trunc(limitOfShowedTabs.value / 2)
  const hasRemainder = limitOfShowedTabs.value % 2
  const rightPlus = hasRemainder ? halfOfLimit + 1 : halfOfLimit

  if (
    minShowedTab.value <= indexOfActiveTab &&
    indexOfActiveTab <= maxShowedTab.value &&
    maxShowedTab.value - minShowedTab.value >= limitOfShowedTabs.value
  ) {
    return
  }

  if (indexOfActiveTab - halfOfLimit < 0 || indexOfActiveTab < limitOfShowedTabs.value - 1) {
    minShowedTab.value = 0
    maxShowedTab.value = limitOfShowedTabs.value - 1
    return
  }

  if (indexOfActiveTab - 1 + rightPlus > props.tabs.length) {
    maxShowedTab.value = props.tabs.length - 1
    minShowedTab.value = props.tabs.length - limitOfShowedTabs.value
    return
  }

  minShowedTab.value = indexOfActiveTab - halfOfLimit
  maxShowedTab.value = indexOfActiveTab + (rightPlus - 1)
}

let previosLeftShowedTab: null | number = null
let previosRightShowedTab: null | number = null
let skipFirstClick = false

const onDocumentClick = (e: MouseEvent) => {
  if (skipFirstClick) {
    skipFirstClick = false
    return
  }
  const tabElement = findEventParentWithClass(e, 'tabs__tab')

  if (tabElement) {
    const index = Number(tabElement.attributes.getNamedItem('tab-index')?.value)

    if (Number.isInteger(index)) {
      previosLeftShowedTab = null
      previosRightShowedTab = null
      document.removeEventListener('click', onDocumentClick)
      onClickTab(props.tabs[index])
    }

    return
  }

  minShowedTab.value = previosLeftShowedTab as number
  maxShowedTab.value = previosRightShowedTab as number
  previosLeftShowedTab = null
  previosRightShowedTab = null
  document.removeEventListener('click', onDocumentClick)
}

const setDocumentClickWatcher = () => {
  skipFirstClick = true
  document.removeEventListener('click', onDocumentClick)
  document.addEventListener('click', onDocumentClick)
}

const onClickLeftTabsButton = () => {
  const leftSpanBiggerLimit = minShowedTab.value - limitOfShowedTabs.value >= 0

  if (!previosLeftShowedTab) {
    previosLeftShowedTab = minShowedTab.value
    previosRightShowedTab = maxShowedTab.value
  }

  minShowedTab.value = leftSpanBiggerLimit ? minShowedTab.value - limitOfShowedTabs.value : 0
  maxShowedTab.value = leftSpanBiggerLimit
    ? maxShowedTab.value - limitOfShowedTabs.value
    : limitOfShowedTabs.value - 1

  setDocumentClickWatcher()
}

const onClickRightTabsButton = () => {
  const lastIndex = props.tabs.length - 1
  const rightSpanBiggerLimit = maxShowedTab.value + limitOfShowedTabs.value < lastIndex

  if (!previosLeftShowedTab) {
    previosLeftShowedTab = minShowedTab.value
    previosRightShowedTab = maxShowedTab.value
  }

  minShowedTab.value = rightSpanBiggerLimit
    ? minShowedTab.value + limitOfShowedTabs.value
    : lastIndex - (limitOfShowedTabs.value - 1)
  maxShowedTab.value = rightSpanBiggerLimit
    ? maxShowedTab.value + limitOfShowedTabs.value
    : lastIndex

  setDocumentClickWatcher()
}

watch(
  () => limitOfShowedTabs.value,
  () => {
    callShowedTabsBorders()
  },
  {
    immediate: true,
  },
)

const calcLimitOfShowedTabs = () => {
  if (!tabsRef.value) return

  const width = tabsRef.value.getBoundingClientRect().width - (50 + offsetForArrows.value)
  limitOfShowedTabs.value = Math.trunc(width / 154) + 1
}

const onScrollerResizerEvent = () => {
  calcLimitOfShowedTabs()
}

let tabsScrollerResizeObersever: ResizeObserver | null = null

const updateTabsScrollerResizer = () => {
  const tabsScrollerDiv = tabsRef.value
  if (!tabsScrollerDiv) {
    tabsScrollerResizeObersever?.disconnect()
    return
  }

  tabsScrollerResizeObersever = new ResizeObserver(onScrollerResizerEvent)
  tabsScrollerResizeObersever.observe(tabsScrollerDiv)
}

watch(
  () => props.tabs,
  (newValue, oldValue) => {
    if (_.isEqual(oldValue, newValue)) {
      return
    }

    if (newValue.length === 2) {
      nextTick(() => {
        callShowedTabsBorders()
        calcLimitOfShowedTabs()
        updateTabsScrollerResizer()
      })
    } else {
      callShowedTabsBorders()
      calcLimitOfShowedTabs()
      updateTabsScrollerResizer()
    }
  },
)

onMounted(() => {
  nextTick(() => {
    callShowedTabsBorders()
    calcLimitOfShowedTabs()
    updateTabsScrollerResizer()
    maxShowedTab.value = limitOfShowedTabs.value - 1
  })
})

watch(
  () => props.activeTabId,
  () => {
    callShowedTabsBorders()
  },
)

const emit = defineEmits(['tab-click', 'close-tab', 'add-to-favorites'])

const onClickTab = (tab: InfinityTabsItem) => {
  emit('tab-click', tab)
}

const onCloseTab = (tab: InfinityTabsItem) => {
  emit('close-tab', tab)
}

const addObjectToFavorites = (tab: InfinityTabsItem) => {
  emit('add-to-favorites', tab)
}
</script>

<style lang="scss" scoped>
.tabs {
  $this: &;
  display: grid;
  grid-template-columns: auto 50px;
  border-radius: 5px 0 0 0;

  &--hide-overload {
    grid-template-columns: auto;
  }

  &__tab-wrapper {
    display: none;

    &--showed {
      display: inline-flex;
    }
  }

  &__scroller {
    display: flex;
    overflow: hidden;
    background: var(--color-background);
  }

  &--divided {
    #{$this}__scroller {
      padding: 0 24px;
      gap: 24px;
    }
  }

  &--dark {
    #{$this}__scroller {
      background: var(--header-background);
    }
  }

  &__left-arrows {
    border-radius: 5px 0 0 0;
  }

  &__right-arrows {
    border-radius: 0 5px 0 0;
  }

  &_with_left_arrow {
    grid-template-columns: 35px auto 50px;
  }

  &_with_right_arrow {
    grid-template-columns: auto 35px 50px;
  }

  &_with_two_arrow {
    grid-template-columns: 35px auto 35px 50px;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background);
    color: var(--color-gray);
    border: 1px solid var(--color-border);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
      background-color: var(--component-background);
    }
  }

  &__dropdown-tab {
    position: relative;
    border: 1px solid var(--color-border);
    border-radius: 5px 5px 0 0;
    cursor: pointer;
    transition: background-color 0.25s $ease;
    user-select: none;
    font-size: var(--font-size-24);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-gray);
    background: var(--color-background);
    padding: 0;
    width: 50px;
    min-width: 50px;
    height: 38px;
    z-index: 3;

    &:hover {
      background-color: var(--component-background);
    }
  }

  &__dropdown-button {
    height: 36px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.tabs__dropdown {
  flex: 1 1 auto;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background);
  max-height: 70vh;
  overflow-y: auto;
  z-index: var(--z-index-tabs);

  li.tabs__dropdown-item {
    display: grid;
    grid-template-columns: auto;
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-14);
    line-height: calc(17 / 14);
    cursor: pointer;
    background-color: var(--color-background);
    width: 100%;

    &:hover {
      background-color: var(--component-background);
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.tabs__dropdown li.tabs__dropdown-item :deep(.object-panel-component) {
  color: var(--color-font-2);
}

.tabs__dropdown li.tabs__dropdown-item_active :deep(.object-panel-component) {
  background-color: var(--color-bg-active-10alpha);
}

.tabs__dropdown :deep(.object-panel-component:hover) {
  border-color: transparent;
  background-color: var(--color-background);
}

.v-popper {
  flex: 0 0 auto;
}

:deep(.dropdown-component) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > .dropdown-component__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
