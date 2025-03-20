<template>
  <aside class="sidebar" :class="[ui.sidebarOpened && '_opened']">
    <div class="sidebar__scroller">
      <div class="sidebar__toggle" @click="() => ui.setSidebar(!ui.sidebarOpened)">
        <div class="sidebar__toggle-text">Разделы</div>
        <div class="sidebar__toggle-icon">
          <SvgIcon name="chevrons-left" />
        </div>
      </div>

      <ul class="sidebar__menu">
        <li v-for="(link, idx) in menuList" :key="idx">
          <RouterLink :to="link.to" class="link" :class="[link.to.includes(routeId) && '_active']">
            <span class="link__icon">
              <SvgIcon :name="link.icon" />
            </span>
            <span class="link__text">{{ link.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <ul class="sidebar__actions" v-if="creationOperationsList.length">
        <li
          v-for="({ ModuleId, Icon, Title, ObjectType, Color }, index) in creationOperationsList"
          :key="index"
        >
          <UiButton1
            :title="Title"
            class="sidebar__actions-button"
            @click="createEntity(ObjectType, ModuleId)"
            :custom-color="Color"
            :icon-left="`userCreationOperations-${Icon}`"
            :icon-size="24"
          >
            <template #default v-if="ui.sidebarOpened">
              <span>{{ Title }}</span>
            </template>
          </UiButton1>
        </li>
      </ul>

      <div
        @click="toggleCallsCardsShow"
        :class="[callCardsStore.callsCardsOpened && '_opened']"
        class="sidebar__calls-toggle"
      >
        <SvgIcon name="telephone" />
        <div v-if="ui.sidebarOpened" class="calls-toggle-text">Телефония</div>
        <div class="toggle-chevron">
          <SvgIcon name="chevrons-left" />
        </div>
      </div>
      <div :class="[callCardsStore.callsCardsOpened && '_opened']" class="sidebar__calls-cards">
        <callCards />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { IconsByModuleGroupID } from '@/core/utils/Icons'
import { useCallCardsStore } from '@/core/store/callCards.store'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { GetObjectDto } from '@/core/api/object.api'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { getTitleForNewObjectTab } from '@/core/services/getTitleForNewObjectTab'

const ui = useUiStore()
const windowStore = useWindowStore()
const callCardsStore = useCallCardsStore()
const moduleStore = useModuleStore()
const { modules } = storeToRefs(moduleStore)
const authStore = useAuthStore()
const { userAvailableCreationOperations } = storeToRefs(authStore)

const route = useRoute()

const routeId = computed(() => {
  return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
})

const creationOperationsList = computed(() => {
  return userAvailableCreationOperations.value.map((operation) => {
    const color = moduleStore.findModuleById(operation.ModuleId)?.PrimaryColor
    return {
      ...operation,
      Color: ['#FFFFFF', '#FFF', '#fff', '#ffffff'].includes(color!) ? '#8990a2' : color,
    }
  })
})

const getMenuIconByID = (id: string) => {
  return IconsByModuleGroupID[id] || ''
}

const menuList = computed(() => {
  const modulesLinks = modules.value.map((x) => {
    const firstModule = x.Modules[0].Id

    return {
      to: `/${x.Id}/${firstModule}`,
      icon: getMenuIconByID(x.Id),
      label: x.Title,
    }
  })

  return [...modulesLinks]
})

watch(
  () => ui.sidebarOpened,
  (newVal) => {
    const width = newVal ? '200px' : '60px'
    setRootCssProperty('--sidebar-width', width)
  },
)

const toggleCallsCardsShow = (): void => {
  callCardsStore.toggleCallsCardsOpened(!callCardsStore.callsCardsOpened)
}

onMounted(() => {
  callCardsStore.getTestDataCallsCards()
})

const createEntity = (type: BaseObjectType, ModuleId: string) => {
  GetObjectDto({
    ModuleId,
    ObjectId: -1,
    BaseObjectType: type,
    ReturnEmptyObject: true,
    DtoViewType: DtoObjectViewType.PrimaryEdit,
  }).then(({ data, error }) => {
    if (error) {
      console.log(error[0].Message)
    }
    if (!data) return
    const objectModel = createObjectInstance(data.BaseObjectId, type, data)

    windowStore.addTab({
      id: objectModel.id,
      title: objectModel.rawData?.BaseObjectName || getTitleForNewObjectTab(type),
      type: type,
      data: objectModel.rawData,
      object: objectModel,
    })
  })
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: sticky;
  z-index: 8;
  top: 0;
  left: 0;
  bottom: 0;
  flex: 0 0 auto;
  width: 60px;
  display: flex;
  flex-direction: column;
  background: var(--header-background);
  color: var(--color-font-invert);

  &._opened {
    width: 200px;
  }

  &__scroller {
    flex: 1 1 auto;
    min-height: 1px;
    height: 100%;
    overflow-y: auto;
    padding: 8px 0 20px;
  }

  &__menu {
    margin: 10px 0;
    display: flex;
    flex-direction: column;

    li {
      display: block;

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  .link {
    position: relative;
    display: flex;
    align-items: center;
    padding: 9px 20px 9px 16px;
    font-size: 0;
    color: var(--color-gray);
    transition: color 0.25s $ease;

    &__icon {
      font-size: 0;

      .svg-icon {
        font-size: var(--font-size-24);
      }
    }

    &__text {
      display: none;
      margin-left: 12px;
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 17px;
    }

    &:hover,
    &.router-link-active,
    &._active {
      color: var(--color-font-invert);

      &::after {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0;
        content: ' ';
        background: url('@/assets/img/decor/sidebar-nav-decor-link.svg') no-repeat center;
        width: 8px;
        height: 42px;
      }
    }
  }

  &__actions {
    margin: 28px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-button {
      width: 100%;
      justify-content: flex-start;
      border: none;
      padding: 6px 8px;
      :deep(.ui-button__content) {
        gap: 10px;
      }
    }
  }

  &__toggle {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    color: var(--color-gray);
    padding: 0 14px 0 10px;
    transition: color 0.25s $ease;
    cursor: pointer;

    &:hover {
      color: var(--color-font-invert);
    }
  }

  &__toggle-text {
    flex: 1 1 auto;
    padding: 9px 6px 19px 0;
    display: none;
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-14);
    line-height: 17px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(white, 0.14);
  }

  &__toggle-icon {
    flex: 0 0 auto;
    font-size: 0;
    padding: 9px 2px 16px;
    border-bottom: 1px solid rgba(white, 0.14);

    .svg-icon {
      font-size: var(--font-size-24);
      transform: rotate(180deg);
      transition: transform 0.25s $ease;
    }
  }

  &._opened {
    .sidebar {
      &__toggle {
        padding-left: 16px;
        justify-content: flex-start;
      }

      &__toggle-text {
        display: block;
      }

      &__toggle-icon {
        .svg-icon {
          transform: none;
        }
      }
    }

    .link__text {
      display: block;
    }
  }
}
</style>
