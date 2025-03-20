<template>
  <div class="object-page" :class="!isFlags && 'grid-3'">
    <ObjectHead
      :title="object ? object.BaseObjectName : 'Загрузка...'"
      class="object-page__head"
      @toggle-star="handleToggleStar"
    />
    <WindowFlags v-if="isFlags" />

    <UiLoader v-if="!object" :loading="isShowLoader" theme="page" not-transparent />
    <ObjectContent v-if="object" :object="object" :windowId="Number(route.params.id)" class="object-page__content" />
  </div>
</template>

<script setup lang="ts">
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { GetObjectDto } from '@/core/api/object.api'
import type { IObjectDto } from '@/core/interface/Object'
import { WindowHeadClass } from '@/core/constants/GlobalClassNames'
import { RequestsModuleId } from '@/core/constants/ModuleId'

const route = useRoute()
const object = ref<IObjectDto | null>(null)
const isFlags = computed(() => object.value?.Flags)
const moduleStore = useModuleStore()
moduleStore.init()

const isShowLoader = ref(true)

if (Number(route.params.id) < 0) {
  GetObjectDto({
    ObjectId: -1,
    BaseObjectType: Number(route.params.type),
    DtoViewType: DtoObjectViewType.PrimaryEdit,
    ReturnEmptyObject: true,
    ModuleId: RequestsModuleId,
  })
    .then(({ data }) => {
      object.value = data
    })
    .finally(() => {
      isShowLoader.value = false
    })
} else {
  GetObjectDto({
    ObjectId: Number(route.params.id),
    BaseObjectType: Number(route.params.type),
    DtoViewType: DtoObjectViewType.PrimaryView,
  })
    .then(({ data }) => {
      object.value = data
    })
    .finally(() => {
      isShowLoader.value = false
    })
}

const handleToggleStar = () => {
  console.info('handleToggleStar')
}
</script>

<style lang="scss" scoped>
.object-page {
  display: flex;
  flex-direction: column;
  width: 1120px;
  margin: 0 auto;
  z-index: 1;
  background: #ffffff;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 44px 1fr;
  width: 1120px;
  height: calc(100vh - 55px);
  &.grid-3 {
    grid-template-rows: 50px 1fr;
  }
  &__head {
    flex: 0 0 auto;
    border-top: 1px solid var(--color-border);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 38px 1fr;
    overflow: hidden;
  }
}
</style>
