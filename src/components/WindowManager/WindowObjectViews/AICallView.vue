<template>
  <template v-if="objectId >= 0">
    <UiInfinityTabs
      divided
      dark
      :tabs="navSections"
      :active-tab-id="activeContentTab"
      @tab-click="onChangeActiveContentTab"
      hide-overload
    />
    <AICallPage v-show="activeContentTab === AICallPages.Main" :object-id="objectId" />
  </template>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'

const props = defineProps<{
  objectId: number
  loading?: boolean
}>()

const windowStore = useWindowStore()

let object: any
const objectData = ref<IObjectDto | null>(null)
watch(
  () => props.objectId,
  (BaseObjectId) => {
    if (BaseObjectId === undefined) {
      object = undefined
      objectData.value = null
      return
    }

    object = windowStore.objectByTabId(BaseObjectId)

    if (!object) {
      object = undefined
      objectData.value = null
      return
    }

    if (object.id === -1) return
  },
  {
    immediate: true,
  },
)
enum AICallPages {
  Main = 0,
}
const navSections = computed(() => {
  if (props.objectId === -1) {
    return []
  }

  return [{ id: AICallPages.Main, title: 'Основные данные' }]
})
const activeContentTab = ref(0)
const dialogStore = useWindowStore()
const { activeTab } = storeToRefs(dialogStore)
const onChangeActiveContentTab = ({ id }: { id: number }) => {
  activeContentTab.value = id
}
</script>

<style scoped lang="scss">
.stub-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 90%;
  color: var(--color-font-disabled);
  font-weight: var(--font-weight-500);
  font-size: var(--font-size-16);
  line-height: 150%;
}
</style>
