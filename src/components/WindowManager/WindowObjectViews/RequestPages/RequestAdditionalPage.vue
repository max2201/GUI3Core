<template>
  <div class="request-additional-page">
    <UiLoader v-if="loading || isSaveLoading" theme="page" loading />

    <div class="request-additional-page__left-panel" v-if="objectData">
      <UiInput1 v-model="objectData.PromocodeField.currentVal" label="Промокод" />
      <UiSelect1
        v-model="objectData.FilialField.currentVal"
        :options="objectData.FilialField.values"
        label="Title"
        :reduce="(filial) => filial.Value"
        select-label="Филиал"
      />
      <UiSelect1
        v-model="objectData.SourceField.currentVal"
        :options="objectData.SourceField.values"
        label="Title"
        :reduce="(source) => source.Value"
        select-label="Источник заявки"
      />
      <UiInput1 v-model="objectData.SourceDetailField.currentVal" label="Детализация источника" />
      <UIInputWithDisable
        v-model="sessionField"
        :disabled="true"
        label="SessionID"
        @on-save="onEditSessionField"
      >
      </UIInputWithDisable>

      <UiInput1 label="Связана с договором" />

      <div class="request-additional-page__docs">
        <h3>Документы для печати</h3>
        <InlineFileInfo label="Договор комиссии" />
        <InlineFileInfo label="Другой документ" />
        <InlineFileInfo label="Другой документ (2)" />
      </div>
    </div>

    <div class="request-additional-page__main">
      <div class="main__stats">
        <StatisticPanel v-if="objectData?.DealSumPanel" :panel="objectData.DealSumPanel" />
        <StatisticPanel v-if="objectData?.DealProfitPanel" :panel="objectData.DealProfitPanel" />

        <div class="percents-stat-item">
          <div class="percents-stat-item__label">Заполнение заявки</div>
          <div class="percents-stat-item__value">-</div>
        </div>

        <MetadataPanel v-if="objectData?.MetaDataGroups" :panel="objectData.MetaDataGroups" />
      </div>

      <div v-if="objectData" class="main__contacts">
        <div v-for="contactGroup in objectData.ContactGroups" :key="contactGroup.Code">
          <h3 class="mb-3">{{ contactGroup.Title }}</h3>
          <LiteViewField v-for="field in contactGroup.Fields" :key="field.Code" :field="field" />
        </div>
      </div>

      <div v-if="objectData?.PrimaryClientMetricts" class="main__entities">
        <ObjectParamCard
          v-for="group in objectData.PrimaryClientMetricts.Groups"
          :key="group.Code"
          :card="group"
        />
      </div>
      <div v-if="summaryBlockFields" class="main__summary">
        <h3 class="main__summary__title mb-2">
          <span>Суммарная информация</span><span class="pseudo-hr" />
        </h3>

        <div class="main__summary__fields">
          <LiteViewField
            v-for="field in summaryBlockFields.Fields"
            :key="field.Code"
            :field="field"
          />
        </div>
      </div>
    </div>

    <div class="request-additional-page__actions">
      <div></div>
      <div>
        <UiLoader v-if="loadingAccessVerify" loading />

        <UiButton1 v-if="isAllowSave" :disabled="isSaveLoading" @click="onSaveForm"
          >Сохранить
        </UiButton1>

        <UiButton1 v-else-if="isAllowEdit" :loading="loadingAccessVerify" @click="onEditObject"
          >Изменить
        </UiButton1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IRequestDto } from '@/core/interface/Requests'
import type { RequestObject } from '@/core/model/RequestObject'
import type { ISelect } from '@/core/interface/Ui'

const props = defineProps<{
  objectId: number
  loading: boolean
  loadingAccessVerify: boolean
  isAllowSave: boolean
  isAllowEdit: boolean
}>()
const emits = defineEmits(['new-vals'])
const sharedModals = useSharedModalsStore()
const windowStore = useWindowStore()

let object: RequestObject | undefined
const objectData = ref<IRequestDto | null>(null)

const isSaveLoading = ref(false)

const summaryBlockFields = computed(() => objectData.value?.PrimaryBlockGroups?.[1])

const sessionField = ref('')

const onEditSessionField = async () => {
  const isConfirmed = await sharedModals.confirmByCode()
  if (isConfirmed) {
    await onSaveSessionField()
  } else {
    sessionField.value = objectData.value!.SessionField.currentVal
  }
}
const onSaveSessionField = () => {
  if (!object) return

  object
    .UpdateAdditionalData({
      infoSessionId: sessionField.value,
    })
    .then(() => {
      objectData.value!.SessionField.currentVal = sessionField.value
    })
    .catch(() => {
      isSaveLoading.value = false
    })
}

const updateRequestFields = () => {
  if (!objectData.value) {
    return
  }

  sessionField.value = objectData.value.SessionField.currentVal
}
const onEditObject = () => {
  emits('edit')
}
watch(
  () => props.objectId,
  (BaseObjectId) => {
    if (BaseObjectId === undefined) return

    object = windowStore.objectByTabId(BaseObjectId)

    if (!object) return

    objectData.value = object.getCurrentState()

    nextTick(() => {
      updateRequestFields()
    })
  },
  {
    immediate: true,
  },
)
// TODO : сделать норм валидацию с проверкой шагов
const onSaveForm = () => {
  isSaveLoading.value = true

  if (!object) return

  object
    .update()
    .then(() => {
      object?.loadData().finally(() => {
        objectData.value = object!.getCurrentState()
        isSaveLoading.value = false
      })
    })
    .catch(() => {
      isSaveLoading.value = false
    })
}
</script>

<style scoped lang="scss">
.request-additional-page {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr 60px;
  overflow: hidden;

  &__left-panel,
  &__main {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__left-panel {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-right: var(--border-default);
  }

  &__additional-input {
    display: flex;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 32px;
    background-color: var(--color-background);
    border-radius: var(--input-border-radius);
    border: 1px solid var(--color-border);
    padding-left: 10px;
  }

  &__docs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    padding: 10px 30px;
    grid-column: 1 / 3;
  }
}

.main__stats,
.main__contacts,
.main__entities,
.main__summary {
  display: grid;
  gap: 6px 24px;
  padding: 20px 24px;
}

.main__stats {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: var(--border-default);
}

.main__contacts {
  grid-template-columns: 1fr 1fr;
}

.main__entities {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.main__summary {
  grid-template-columns: 1fr 1fr;
}

.percents-stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percents-stat-item__label {
  color: var(--color-gray);
  font-size: var(--font-size-14);
  width: 87px;
  overflow: hidden;
}

.percents-stat-item__value {
  display: flex;
  gap: 4px;
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-500);

  &_link {
    border-bottom: 1px dashed;
    cursor: pointer;

    :deep(.svg-icon) {
      position: relative;
      top: 8px;
    }
  }
}

.main__summary {
  grid-template-columns: 1fr;
}

.main__summary__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.main__summary__title {
  display: grid;
  grid-template-columns: 28% 72%;
  align-items: center;
}

.pseudo-hr {
  width: 100%;
  height: 1px;
  background-color: var(--color-border);
}
</style>
