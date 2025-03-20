<template>
  <a ref="linkElement" class="base-object-link" @click.stop.prevent="onClick">
    <span class="base-object-link__text">
      <slot name="text"> {{ value?.BaseObjectName }}</slot>
    </span>
    <slot name="icon">
      <SvgIcon class="base-object-link__icon" name="arrow-right-up-squere" />
    </slot>
  </a>
</template>

<script setup lang="ts">
import type { LiteViewArgs } from '@/core/interface/LiteView'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { WindowContentClass } from '@/core/constants/GlobalClassNames'

interface BaseObjectLinkValue {
  BaseObjectName: string
  BaseObjectType: number
  BaseObjectId: number
  BaseObjectDate?: string
}

const props = defineProps<{
  value?: BaseObjectLinkValue
  isPrimaryLink?: boolean
  isWindowLiteView?: boolean
}>()

const emit = defineEmits(['click'])
const linkElement = ref<HTMLElement>()

const onClick = (e) => {
  if (!linkElement.value) {
    emit('click')
    return
  }
  if (props.isPrimaryLink) {
    const windowStore = useWindowStore()
    const object = createObjectInstance(props.value?.BaseObjectId, props.value?.BaseObjectType)
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
        title: props.value?.BaseObjectName,
        type: object.type,
        data: object.rawData,
        object,
      })
      EventBus.emit(GlobalEvents.CloseLiteView)
    }
  } else {
    if (props.isWindowLiteView) {
      const windowContentDiv = Array.from(document.getElementsByClassName(WindowContentClass))[0]
      const windowContentRect = windowContentDiv.getBoundingClientRect()
      const windowContentTabsDiv = Array.from(document.getElementsByClassName('component-tabs'))[0]
      const windowContentTabsRect = windowContentTabsDiv.getBoundingClientRect()

      EventBus.emit(GlobalEvents.OpenLiteView, {
        top: windowContentTabsRect.bottom,
        left: document.body.clientWidth - 690,
        height: windowContentRect.bottom - windowContentTabsRect.bottom,
        width: 690,
        objectId: props.value?.BaseObjectId,
        baseObjectType: props.value?.BaseObjectType,
        baseObjectName: props.value?.BaseObjectName,
      } as LiteViewArgs)
    } else {
      const rect = linkElement.value.getBoundingClientRect()
      EventBus.emit(GlobalEvents.OpenLiteView, {
        e,
        top: rect.top,
        left: rect.left,
        baseObjectName: props.value?.BaseObjectName,
        baseObjectType: props.value?.BaseObjectType,
        objectId: props.value?.BaseObjectId,
      } as LiteViewArgs)
    }
  }
  emit('click')
}
</script>

<style lang="scss" scoped>
.base-object-link {
  $this: &;
  cursor: pointer;

  &__text {
    color: var(--color-font);
    border-bottom: 1px dashed #db6566;
  }

  &__icon {
    margin-left: 3px;
  }

  :deep(.svg-icon) {
    color: var(--color-gray);
  }

  &:hover {
    #{$this}__text {
      border-bottom: 1px dashed var(--color-primary);
    }

    :deep(.svg-icon) {
      color: var(--color-primary);
    }
  }
}
</style>
