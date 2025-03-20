<template>
  <div class="details">
    <div class="details__error" v-if="apiError">
      {{ apiError }}
    </div>

    <ObjectDetailsCard v-else :details="details" />

    <UiLoader theme="page" :loading="loading && !apiError" />
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import type { ITableRow } from '@/core/interface/Table'
import type { IModuleDto } from '@/core/interface/Module'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { GetLastNotificationForObject } from '@/core/api/modules.api'
import { GetObjectDto } from '@/core/api/object.api'
import { useModuleLoader } from '@/composables/module-loader'

const props = defineProps<{ row: ITableRow }>()
const { routeModuleId, ModuleCompontent } = useModuleLoader()
const moduleStore = useModuleStore()
const route = useRoute()
const moduleID = route.params.sid as string
const currentModule = moduleStore.findModuleById(moduleID) as IModuleDto

// api & data mapping
const apiData = ref<IObjectDto | null>(null)
const loading = ref(true)
const apiError = ref('')

const getDetails = async () => {
  loading.value = true
  apiError.value = ''

  const { data, error } = await GetObjectDto({
    ModuleId: routeModuleId.value,
    ObjectId: props.row.id,
    BaseObjectType: currentModule.BaseObjectType,
    DtoViewType: DtoObjectViewType.ContexView,
  })

  loading.value = false
  if (data) apiData.value = data
  if (error) apiError.value = 'Ошибка'

  const { data: dataNotification } = await GetLastNotificationForObject({
    ModuleId: routeModuleId.value,
    InputObject: {
      Id: props.row.id,
      BaseObjectType: currentModule.BaseObjectType,
    },
  })
}

getDetails()

const details = computed(() => apiData.value?.ContextBlockGroups || [])
</script>

<style lang="scss" scoped>
.details {
  position: relative;
  min-height: 280px;
  max-height: fit-content;
  width: calc(100vw - var(--sidebar-width) - 40px - 133px - var(--sidepanel-width));

  &__wrapper {
    display: grid;
    grid-gap: 20px 40px;
  }
}
</style>
