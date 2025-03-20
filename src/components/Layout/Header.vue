<template>
  <header class="header" :class="[ui.sidebarOpened && '_sidebar_opened']" ref="headerRef">
    <div class="header__wrapper">
      <RouterLink to="/desktop/MetricsModuleId">
        <div class="header__logo">
          <div class="header__logo-wrapper">
            <img src="@/assets/img/logo.svg" alt="logo" />
          </div>
        </div>
      </RouterLink>

      <div class="header__navi">
        <div class="nav">
          <ul class="nav__menu" ref="headerMenu">
            <li v-for="(link, idx) in menuVisible" :key="idx">
              <RouterLink :to="link.to">
                {{ link.label }}
                <UiBookmarkIcon
                  v-if="link.isActive && !link.isPassive"
                  :active="link.isFavorite"
                  class="nav__menu__bookmark ml-2"
                  @click="() => handleToggleFavoriteModule(link)"
                />
              </RouterLink>
            </li>
          </ul>

          <VDropdown :distance="2">
            <div class="nav__more" :class="[menuHidden.length === 0 && '_empty']">
              <SvgIcon name="nav-dots-hoizontal" />
            </div>

            <template #popper>
              <ul class="nav__dropdown">
                <li v-for="(link, idx) in menuHidden" :key="idx">
                  <RouterLink :to="link.to">{{ link.label }}</RouterLink>
                </li>
              </ul>
            </template>
          </VDropdown>
        </div>

        <div class="header__actions" v-if="user">
          <VDropdown :distance="0" :triggers="[]" :shown="fillialsDropdownOpen" :autoHide="false">
            <div
              class="header__drop"
              ref="fillialsDropdownRef"
              @click="fillialsDropdownOpen = !fillialsDropdownOpen"
            >
              <SvgIcon name="building" />
              <span class="header__drop-value">
                <span>{{ user?.CurrentFilialTitle }}</span>
                <SvgIcon name="chevron-down" />
              </span>
            </div>

            <template #popper>
              <div class="header__drop-nav drop">
                <div class="drop__title">Выберите ваш филиал</div>
                <ul class="drop__list">
                  <li v-for="filial in user?.AviableFilials" :key="filial.ID">
                    <a href="#" @click="() => authStore.changeFilial(filial.ID)">
                      {{ filial.Title }}
                    </a>
                  </li>
                </ul>
              </div>
            </template>
          </VDropdown>

          <VDropdown :distance="0" :triggers="[]" :shown="userDropdownOpen" :autoHide="false">
            <div
              class="header__drop _user"
              v-if="user"
              ref="userDropdownRef"
              @click="userDropdownOpen = !userDropdownOpen"
            >
              <SvgIcon name="user" />
              <span class="header__drop-value">
                {{ user.CurrentUserName }}
              </span>
            </div>

            <template #popper>
              <div class="header__drop-nav drop">
                <div class="drop__title">Профиль</div>
                <ul class="drop__list">
                  <li>
                    <a href="#" @click="authStore.logout">Выйти</a>
                  </li>
                  <li>
                    <RouterLink to="/settings">Настройки</RouterLink>
                  </li>
                </ul>
              </div>
            </template>
          </VDropdown>

          <div
            class="messanger-container"
            :class="[
              StopClickOutsideClasses.windowManager,
              {
                'messenger-disabled': !isMessengerAvailable,
                'messenger-warning': isMessengerHasProblems,
              },
            ]"
            @click.stop="openMessneger"
          >
            <SvgIcon name="messenger" class="action-icon" />
            <span :style="{ opacity: isMessengerAvailable ? 1 : 0 }">{{
              unreadMessagesCount
            }}</span>
          </div>

          <div
            v-if="currentPageShowNotifications"
            ref="notificationsContainer"
            class="notification-container"
            :class="[StopClickOutsideClasses.windowManager]"
          >
            <headerNotificationsIconsBar />
            <div
              v-if="notifications.showNotificationsOnHeader"
              :class="[notifications.showNotificationsOnHeader && '_opened']"
              :style="`right: ${notifications.marginRightNotificationsBlock}`"
              class="header-notifications"
            >
              <headerNotifications component-type="headerNotifications" />
            </div>
          </div>

          <div
            v-if="currentPageShowTasks"
            ref="tasksContainer"
            class="tasks-container"
            :class="[StopClickOutsideClasses.windowManager]"
          >
            <div
              class="tasks__action"
              :class="[
                StopClickOutsideClasses.windowManager,
                {
                  _active: tasks.showTasksOnHeader,
                },
              ]"
              @click="toggleTasks"
            >
              <div class="tasks__action-icon">
                <svgIcon name="task" />
              </div>
              <div class="tasks__action-count">
                {{ tasks.countTasksOnHeader }}
              </div>
            </div>

            <div
              v-if="tasks.showTasksOnHeader"
              :class="[tasks.showTasksOnHeader && '_opened']"
              style="right: 66px"
              class="header-notifications"
            >
              <headerNotifications component-type="tasks" />
            </div>
          </div>

          <div
            v-if="currentPageShowWindowManager"
            :class="[
              'toogle-window-manager',
              {
                'toogle-window-manager_disabled': !windowManagerHasTabs,
                'toogle-window-manager_active': isOpened,
              },
              stopClickOusideWindowManagerClass,
            ]"
            @click="toogleWindowManager"
          >
            <SvgIcon name="window" />
            <span>{{ tabs.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { onClickOutside } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Routes, RouteNames } from '@/core/config'
import type { INavLink } from '@/core/interface/Ui'
import { DashboardModuleId } from '@/core/constants/DashboardModuleId'
import { useNotificationsStore } from '@/core/store/notifications.store'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const notifications = useNotificationsStore()
const ui = useUiStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const moduleStore = useModuleStore()
const dashboardStore = useDashboardStore()

const route = useRoute()

import { useTasksStore } from '@/core/store/tasks.store'
import { findEventParentWithClass } from '@/core/utils/findEventParentWithClass'
const tasks = useTasksStore()

const toggleTasks = () => {
  if (tasks.countTasksOnHeader) {
    tasks.toggleTasksOnHeader(!tasks.showTasksOnHeader)
  } else {
    return
  }
}

const headerRef = ref<HTMLElement | null>(null)
// menu
const hideFromIdx = ref(99)
const headerMenu = ref<HTMLElement | null>(null)

const PassiveTabs = [DashboardModuleId]

const menuListWithUserTabs = computed(() => {
  let moduleId = route.params.id as string

  return moduleStore.currentModules(moduleId).reduce((acc, rootModule) => {
    const availableModules = user.value?.AvailableModules.filter(
      (y) => rootModule.Id === y.Id && y.ViewId,
    )
    const to = `/${moduleId}/${rootModule.Id}`

    acc.push({
      id: rootModule.Id,
      fullViewId: rootModule.Id,
      to,
      icon: '',
      label: rootModule.Title,
      isActive: to === route.path,
      isFavorite: dashboardStore.isFavoriteModule(rootModule.Id),
      isPassive: PassiveTabs.includes(rootModule.Id),
    })

    if (availableModules) {
      availableModules.forEach((aModule) => {
        const to = `/${moduleId}/${rootModule.Id}/${aModule.ViewId}`

        acc.push({
          id: aModule.Id,
          viewId: aModule.ViewId,
          fullViewId: aModule.FullViewId,
          to,
          icon: '',
          label: aModule.TabName,
          isActive: to === route.path,
          isFavorite: dashboardStore.isFavoriteModule(aModule.FullViewId),
          isPassive: PassiveTabs.includes(aModule.Id),
        })
      })
    }

    return acc
  }, [] as INavLink[])
})

const menuVisible = computed(() => {
  return menuListWithUserTabs.value.filter((x, idx) => idx < hideFromIdx.value)
})

const menuHidden = computed(() => {
  return menuListWithUserTabs.value.filter((x, idx) => idx >= hideFromIdx.value)
})

const hiddenStartsFromIdx = () => {
  hideFromIdx.value = 99
  nextTick(() => {
    if (!headerMenu.value) return
    const containerWidth = headerMenu.value.offsetWidth - 44
    const navChilds = headerMenu.value.children

    let lastWidth = 0
    for (let i = 0; i < navChilds.length; i++) {
      const navLink = navChilds[i] as HTMLElement
      const navLinkWidth = navLink.offsetWidth + 10

      lastWidth += navLinkWidth

      if (lastWidth >= containerWidth) {
        hideFromIdx.value = i
        return
      }
    }
  })
}

const debouncedResize = debounce(hiddenStartsFromIdx, 100)

watch(
  () => menuListWithUserTabs.value,
  () => {
    hiddenStartsFromIdx()
  },
)

const notificationsContainer = ref(null)
const tasksContainer = ref(null)

// Закрываем диалоговое окно и удаляем активный класс при клике в любое другое место
onClickOutside(notificationsContainer, (event): void => {
  if (notifications.showNotificationsOnHeader) {
    const foundParentWithStopClass = findEventParentWithClass(
      event,
      StopClickOutsideClasses.headerNotification,
    )

    if (foundParentWithStopClass) {
      return
    }

    notifications.closeNotifications()
  }
})

onClickOutside(tasksContainer, (event): void => {
  if (tasks.showTasksOnHeader) {
    const foundParentWithStopClass = findEventParentWithClass(
      event,
      StopClickOutsideClasses.headerTasks,
    )

    if (foundParentWithStopClass) {
      return
    }

    tasks.closeTasks()
  }
})

onMounted(() => {
  notifications.getNotificationsTable()
  tasks.getTasksCountOnHeader()
  tasks.getTasksOnHeader(5, 1)
  hiddenStartsFromIdx()
  window.addEventListener('resize', debouncedResize, false)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize, false)
})

// dropdowns

const fillialsDropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const fillialsDropdownRef = ref(null)
const userDropdownRef = ref(null)

onClickOutside(fillialsDropdownRef, () => {
  fillialsDropdownOpen.value = false
})
onClickOutside(userDropdownRef, () => {
  userDropdownOpen.value = false
})

const handleToggleFavoriteModule = (navItem: INavLink) => {
  moduleStore.toggleFavoriteModule(navItem.fullViewId, navItem.viewId)
}

const stopClickOusideWindowManagerClass = StopClickOutsideClasses.windowManager
const windowStore = useWindowStore()
const { isOpened, tabs } = storeToRefs(windowStore)
const windowManagerHasTabs = computed(() => Boolean(tabs.value.length))
const toogleWindowManager = (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()

  if (!windowManagerHasTabs.value) {
    return
  }

  if (isOpened.value) {
    windowStore.closeWindow()
  } else {
    windowStore.openWindow()
  }
}

const openMessneger = () => {
  if (!isMessengerAvailable.value) return

  const routeData = router.resolve({ name: RouteNames[Routes.messenger] })
  window.open(routeData.href, '_blank')
}

const currentPageShowTasks = computed(() => {
  return ![RouteNames[Routes.messenger], RouteNames[Routes.objectPage]].includes(String(route.name))
})

const currentPageShowNotifications = computed(() => {
  return ![RouteNames[Routes.messenger], RouteNames[Routes.objectPage]].includes(String(route.name))
})

const currentPageShowWindowManager = computed(() => {
  return ![RouteNames[Routes.messenger], RouteNames[Routes.objectPage]].includes(String(route.name))
})

import { GetCountUnreadMessagesForUser, CheckChatAccessible } from '@/core/api/dialogs.api'
import _ from 'lodash'

const unreadMessagesCount = ref(0)
const newUnreadMessageCount = ref(0)
let fisrtUnreadMessageCount = 0

const updateCountUnreadMessagesForUser = () => {
  if (localStorage.getItem('stop-periodic-requests') === 'true') return

  GetCountUnreadMessagesForUser().then(({ data }) => {
    const value = data?.LongParamValue
    if (!_.isNumber(value)) return

    if (fisrtUnreadMessageCount === 0 && value > 0) {
      fisrtUnreadMessageCount = value
      unreadMessagesCount.value = value
    } else {
      unreadMessagesCount.value = value
      newUnreadMessageCount.value = value - fisrtUnreadMessageCount
    }
  })
}

const isMessengerAvailable = ref(false)
const isMessengerHasProblems = ref(false)

const checkChatAccessible = () => {
  if (localStorage.getItem('stop-periodic-requests') === 'true') return

  CheckChatAccessible().then(({ data }) => {
    if (!data) return

    if (data.IsChatAccessible) {
      isMessengerAvailable.value = true
    }

    if (data.InActiveCount > 0) {
      isMessengerHasProblems.value = true
    }
  })
}

updateCountUnreadMessagesForUser()
checkChatAccessible()

const UpdateUnreadCountTimerID = setInterval(() => {
  updateCountUnreadMessagesForUser()
  checkChatAccessible()
}, 60000)

onUnmounted(() => {
  clearInterval(UpdateUnreadCountTimerID)
})
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  z-index: var(--z-index-header);
  top: 0;
  left: 0;
  right: 0;
  background: var(--header-background);
  color: var(--color-font-invert);

  &._sidebar_opened {
    .header {
      &__logo {
        width: 200px;
      }
    }
  }
  &__wrapper {
    display: flex;
    padding-right: 14px;
  }
  &__logo {
    position: relative;
    flex: 0 0 auto;
    // margin-right: 20px;
    width: 60px;
    height: 50px;
    font-size: 0;
    overflow: hidden;
    transition: width 0.25s $ease;
    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 15px;
      background: #4cadfb;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      max-width: 200px;
    }
  }
  &__navi {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  &__actions {
    flex: 0 0 auto;
    margin-left: auto;
    display: flex;
    :deep(.v-popper) {
      display: flex;
      flex-direction: column;
    }
  }
  &__actions-list {
    display: flex;
  }
  &__drop {
    flex: 1 0 auto;
    display: inline-flex;
    align-items: center;
    padding-right: 20px;
    height: 100%;
    cursor: pointer;
    &._user {
      min-width: 200px;
    }
    .svg-icon {
      font-size: var(--font-size-24);
      flex: 0 0 auto;
      margin-right: 5px;
    }
  }
  &__drop-value {
    display: inline-flex;
    align-items: center;
  }
}

.nav {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  padding: 0 10px;
  min-width: 1px;

  &__menu {
    flex: 1 1 auto;
    min-width: 1px;
    display: flex;
    align-items: center;
    overflow: hidden;

    li {
      flex: 0 0 auto;
      font-weight: var(--font-weight-600);
      font-size: var(--font-size-14);
      line-height: calc(17 / 14);
      text-transform: uppercase;

      &:not(:last-child) {
        margin-right: 10px;
      }

      a {
        display: flex;
        align-items: center;
        position: relative;
        padding: 15px 10px 18px;
        color: var(--color-gray);
        transition: color 0.25s $ease;
        overflow: hidden;

        &::after {
          display: inline-block;
          content: ' ';
          position: absolute;
          bottom: 0;
          left: 10px;
          right: 10px;
          height: 4px;
          border-radius: 6px 6px 0 0;
          transform: translateY(4px);
          background: currentColor;
          transition: transform 0.25s $ease;
        }

        &.router-link-active {
          color: var(--color-font-invert);
          &::after {
            transform: none;
          }
        }

        &:hover {
          color: var(--color-font-invert);
        }
      }
    }
  }

  &__dropdown {
    padding: 16px 14px;
    max-height: 268px;
    overflow-y: auto;
    li {
      display: block;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
    a {
      display: inline-block;
      font-weight: var(--font-weight-500);
      padding: 5px 0;
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .v-popper {
    flex: 0 0 auto;
  }
  &__more {
    padding: 10px;
    cursor: pointer;
    color: var(--color-gray);
    transition: color 0.25s $ease;
    &._empty {
      opacity: 0;
    }
    .svg-icon {
      font-size: var(--font-size-24);
    }
    &:hover {
      color: var(--color-font-invert);
    }
  }
}

.drop {
  padding: 12px 8px;
  min-width: 180px;
  &__title {
    padding: 4px 8px 16px;
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-14);
    line-height: 1.2;
    color: var(--header-background);
    border-bottom: 1px solid var(--color-border);
  }
  &__list {
    margin: 0;
    display: flex;
    flex-direction: column;
    li {
      display: block;
      margin-top: 6px;
    }
    a {
      display: block;
      padding: 4px 8px;
      line-height: 1.4;
      border-radius: 3px;
      transition: background 0.25s $ease;
      &:hover {
        background: rgba(26, 143, 242, 0.1);
      }
    }
  }
}

.action {
  position: relative;
  padding: 13px 10px;
  cursor: pointer;
  &__icon {
    font-size: 0;
    .svg-icon {
      font-size: var(--font-size-24);
    }
  }
  &__counter {
    position: absolute;
    z-index: 2;
    bottom: 7px;
    right: -2px;
    padding: 2px 5px;
    font-size: 10px;
    font-weight: 700;
    background: var(--color-primary);
    border-radius: 30px;
    &._red {
      background: var(--color-red);
    }
    &._yellow {
      background: var(--color-yellow);
      color: var(--color-font);
    }
  }
  &:hover {
    .action {
      &__icon {
        opacity: 0.7;
      }
    }
  }
}

.toogle-window-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 40px;
  height: 42px;
  margin-left: 14px;
  padding-top: 10px;
  user-select: none;
  font-style: normal;
  font-weight: var(--font-weight-600);
  font-size: 10px;
  line-height: 12px;
  color: var(--color-unactive);

  &:hover {
    cursor: pointer;
    color: var(--color-font-invert);

    > .svg-icon {
      color: var(--color-font-invert);
    }
  }

  > .svg-icon {
    width: 20px;
    height: 20px;
    color: var(--color-unactive);
  }

  &_active {
    background-color: var(--component-background);
    color: var(--color-font-2);
    border-radius: 3px;

    > .svg-icon {
      color: var(--color-font-2);
    }

    &:hover {
      color: var(--color-font-2);

      > .svg-icon {
        color: var(--color-font-2);
      }
    }
  }

  &_disabled {
    color: var(--color-disabled);

    > .svg-icon {
      color: var(--color-disabled);
    }

    &:hover {
      cursor: default;
    }
  }
}

.messanger-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease all;
  cursor: pointer;
  user-select: none;
  width: 34px;
  height: 42px;
  margin-right: 14px;
  padding-top: 6px;

  .action-icon {
    width: 20px;
    height: 24px;
  }

  &.messenger-disabled {
    color: var(--color-gray);
    cursor: not-allowed;

    :deep(.action-icon) {
      cursor: not-allowed;
    }
  }

  &.messenger-warning:not(.messenger-disabled) {
    color: #fbb500;
  }

  > span {
    font-style: normal;
    font-weight: var(--font-weight-600);
    font-size: 10px;
    line-height: 12px;
    color: var(--color-unactive);
  }
}
</style>
