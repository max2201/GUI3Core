<template>
  <div class="client-page client-main-page">
    <ClientInfoRow
      v-if="objectData"
      :client-id="objectId"
      :name="objectData.BaseObjectName"
      :phones="objectData?.Phones"
      :last-active="objectData.BaseObjectDate"
    />

    <div class="client-main-page__middle-section">
      <div class="client-main-page__middle-section__left">
        <div class="about-column">
          <div v-if="objectData?.PhotoUrl" class="client-photo">
            <div class="client-photo-content">
              <UiExternalImage width="auto" height="auto" :src="objectData.PhotoUrl">
              </UiExternalImage>
            </div>
          </div>
          <div v-if="objectData?.IsBanned" class="disable-client-deal">
            <SvgIcon name="forbidden-circle" />
            <span>Запрет на заключение договора</span>
          </div>
          <CommentField
            class="call-main-page__content-side-item"
            :field="{
              Title: objectData?.CommentField?.title,
              Value: objectData?.CommentField?.currentVal,
            }"
            editable
            :is-loading="isLoadingCommentUpdate"
            @update-comment="editCommentSave"
            @input-comment="commentInput"
            :initial-value="objectData?.CommentField?.initialValue"
            v-model:is-editing="isCommentEditing"
          ></CommentField>
          <div class="documents-for-print">
            <h3>Документы для печати</h3>
            <InlineFileInfo label="Анкета клиента" />
            <InlineFileInfo label="ДКП-ФинАренда-Поручитель АБ Юч" />
            <InlineFileInfo label="Договор комиссии" />
          </div>
        </div>
      </div>

      <div class="client-main-page__middle-section__right">
        <div class="main__stats">
          <TypeFieldRenderer
            v-if="objectData?.ClientBalancePanel"
            :field="objectData?.ClientBalancePanel"
          ></TypeFieldRenderer>
          <TypeFieldRenderer
            v-if="objectData?.ClientDebetPanel"
            :field="objectData?.ClientDebetPanel"
          ></TypeFieldRenderer>

          <TypeGroupRenderer
            v-for="group in objectData?.PrimaryCurrentClientAccount?.Groups"
            :key="`group-${group.Code}`"
            :group="group"
          ></TypeGroupRenderer>
          <TypeGroupRenderer
            v-if="objectData?.ClientDiscountGroup"
            :group="objectData?.ClientDiscountGroup"
          ></TypeGroupRenderer>
        </div>

        <div class="main__contacts">
          <TypeGroupRenderer
            v-if="objectData?.PrimaryBlockGroup"
            :key="`group-${objectData?.PrimaryBlockGroup.Code}`"
            class="call-edit-page__linked-object-group"
            :group="objectData?.PrimaryBlockGroup"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
          <TypeGroupRenderer
            v-if="objectData?.NotificationsBlockGroup"
            :key="`group-${objectData?.NotificationsBlockGroup.Code}`"
            class="call-edit-page__linked-object-group"
            :group="objectData?.NotificationsBlockGroup"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
        </div>

        <div class="main__entities">
          <TypeGroupRenderer
            class="call-edit-page__metrics-group"
            v-for="group in objectData?.PrimaryClientMetrics.Groups"
            :key="`group-${group.Code}`"
            :group="group"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
        </div>
      </div>
    </div>

    <div class="client-main-page__actions">
      <UiButton1 :loading="loadingCreateNew" variant="outline" @click="onClickCreateNew">
        Добавить клиента
      </UiButton1>
      <UiButton1 :loading="loadingEdit" @click="onClickEdit"> Изменить </UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineFileInfo from '@/components/Ui/DataDisplay/InlineFileInfo.vue'
import SvgIcon from '@/components/Ui/DataDisplay/SvgIcon.vue'
import type { IClient, IObjectDto } from '@/core/interface/Object'
import type { ClientObject } from '@/core/model/ClientObject'
import { useToast } from 'vue-toastification/dist/index.mjs'
import {
  ClientUpdateAdditionalData,
  ClientUpdateAdditionalDataValidate,
} from '@/core/api/clients.api'
import type { IClientDto } from '@/core/interface/Client'

const props = defineProps<{
  objectId: number
  loadingCreateNew: boolean
  loadingEdit: boolean
}>()

const windowStore = useWindowStore()
const toast = useToast()

let object: ClientObject
const objectData = ref<IClientDto | null>(null)

const emits = defineEmits(['edit', 'create-new'])

const onClickCreateNew = () => {
  emits('create-new')
}
const onClickEdit = () => {
  emits('edit')
}

const isCommentEditing = computed({
  get() {
    return objectData.value?.CommentField.editing
  },
  set(newValue) {
    objectData.value.CommentField.editing = newValue
  },
})

const isLoadingCommentUpdate = ref(false)
const CommentValidationError = ref('')
const commentInput = async (newComment: string) => {
  objectData.value.CommentField.currentVal = newComment
}
const editCommentSave = async () => {
  CommentValidationError.value = ''
  isLoadingCommentUpdate.value = true

  const payload = {
    ObjectId: props.objectId,
    Vals: {
      txtComment: objectData.value.CommentField.currentVal,
    },
  }

  const validation = await ClientUpdateAdditionalDataValidate(payload)

  if (validation.error) {
    toast.error('Не удалось обновить поле')
    isLoadingCommentUpdate.value = false
    return
  }
  if (validation.data && !validation.data.TotalOk) {
    isLoadingCommentUpdate.value = false
    CommentValidationError.value =
      validation.data.Results?.txtComment?.ErrorDesription || 'Ошибкa валидации'
    return
  }

  const { error } = await ClientUpdateAdditionalData(payload)
  if (error) {
    isLoadingCommentUpdate.value = false
    toast.error(error[0].Message)
    return
  }

  await object.loadData()
  objectData.value = object.getCurrentState()
  isLoadingCommentUpdate.value = false
  isCommentEditing.value = false
  toast.success('Краткая характеристика успешно обновлена')
}

const isBlockNewDeals = ref(true)
const asyncBlockLoading = ref(false)

const unloadedAsyncBlockCodes = computed(() => {
  if (!objectData.value) {
    return []
  }

  return Object.entries(objectData.value)
    .filter(([_, prop]) => prop?.DataLoaded === false)
    .map(([key, _]) => key)
})

const loadAsyncBlocksData = async () => {
  asyncBlockLoading.value = true
  try {
    const loadPromises = unloadedAsyncBlockCodes.value.map((blockCode) =>
      object.loadAsyncBlockData(blockCode),
    )

    await Promise.all(loadPromises)
  } catch (error) {
    console.error('Error loading async blocks:', error)
  } finally {
    asyncBlockLoading.value = false
  }
}

watch(
  () => unloadedAsyncBlockCodes.value,
  async (blocks) => {
    if (blocks.length) {
      await loadAsyncBlocksData()
    }
  },
)
watch(
  () => props.objectId,
  () => {
    if (props.objectId === undefined) {
      object = undefined
      objectData.value = null
      return
    }

    object = windowStore.objectByTabId(props.objectId)

    if (!object) {
      object = undefined
      objectData.value = null
      return
    }

    objectData.value = object.getCurrentState()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
@import './clientPages.scss';
.client-main-page {
  display: grid;
  grid-template-columns: auto;
  overflow: hidden;
  grid-template-rows: 60px auto 60px;
}
.client-main-page__actions {
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 30px;

  button:not(:last-child) {
    margin-right: 8px;
  }
}

.client-main-page__middle-section {
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 1fr;
  overflow: hidden;
}
.client-main-page__middle-section__left {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  overflow: hidden;
}

.client-main-page__middle-section__right {
  overflow-x: hidden;
  overflow-y: auto;
}

.about-column,
.info-panel {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.about-column {
  border-right: var(--border-default);
  padding: 20px 23px;
  gap: 20px;
}

.client-photo {
  display: block;
  width: 252px;
  height: 160px;
  align-items: center;
  max-height: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.disable-client-deal {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 32px;
  background-color: var(--component-danger-background);
  padding: 6px 0 6px 6px;
  border-radius: 5px;
  overflow: hidden;

  > svg {
    color: var(--component-danger);
  }
}
.short-info {
  display: flex;
  flex-direction: column;
  gap: 3px;

  &__error {
    font-size: var(--font-size-standart);
    color: var(--color-red);
  }
}
.short-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.short-info__header__title {
  color: var(--color-gray);
}
.short-info__body {
}
.documents-for-print {
  display: flex;
  flex-direction: column;
  width: 253px;
  gap: 12px;
}
</style>
