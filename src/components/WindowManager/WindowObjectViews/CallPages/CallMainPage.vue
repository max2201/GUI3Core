<template>
  <div class="call-main-page">
    <ClientInfoRow
      :client-id="objectData.Client?.BaseObjectId"
      :name="objectData.Client?.BaseObjectName"
      :phones="objectData.Phones || []"
      :last-active="objectData.Client?.BaseObjectDate"
    />

    <div v-if="objectData" class="call-main-page__content">
      <div class="call-main-page__content-side">
        <ConnectionStatus v-if="callInfo" :call-info="callInfo" compact></ConnectionStatus>
        <CommentField
          class="call-main-page__content-side-item"
          v-if="callSubject"
          :field="callSubject"
        ></CommentField>
        <ModeratorCommentEmptyWrapper
          class="call-main-page__content-side-item"
          @add-action="isModeratorCommentEditing = true"
          :is-empty="!moderatorComment.Value && !isModeratorCommentEditing"
        >
          <template #empty-state="{ addAction }">
            <div class="call-main-page__add-moderator-comment-button">
              <UiButton1
                @click="addAction"
                icon-left="plus-circle"
                variant="text"
                :icon-size="20"
                >{{ moderatorComment.Title }}</UiButton1
              >
            </div>
          </template>
          <template #filled-state>
            <CommentField
              class="call-main-page__moderator-comment"
              editable
              :field="moderatorComment"
              :is-loading="isLoadingModeratorCommentUpdate"
              @update-comment="moderatorCommentSave"
              @input-comment="moderatorCommentInput"
              :initial-value="moderatorComment.initialValue"
              v-model:is-editing="isModeratorCommentEditing"
            ></CommentField>
          </template>
        </ModeratorCommentEmptyWrapper>
      </div>
      <div class="call-main-page__content-main">
        <TypeGroupRenderer
          v-for="group in callBlockGroups"
          :key="`group-${group.Code}`"
          class="call-main-page__group"
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
        <TypeGroupRenderer
          v-for="group in callAdditionalInfo.Groups"
          :key="`group-${group.Code}`"
          class="call-main-page__group"
          :group="group"
          :loading="asyncBlockLoading"
        >
          <template #fields="{ fields }">
            <TypeFieldRenderer
              v-for="field in fields"
              :key="`field-${field.Code}`"
              :field="field"
            ></TypeFieldRenderer>
          </template>
        </TypeGroupRenderer>
        <div class="call-main-page__closest-calls" v-if="closestCalls">
          <TableGroup :title="closestCalls.TabName">
            <ClosestCallsTable
              ref="callsTableRef"
              :object-id="objectId"
              :table-data="closestCalls"
            ></ClosestCallsTable>
          </TableGroup>
        </div>
      </div>
    </div>

    <div class="call-main-page__actions">
      <UiButton1 v-if="callSubject" size="large" @click="openEditCall">Изменить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import type { CallObject } from '@/core/model/CallObject'
import { CallUpdateAdditionalData, CallUpdateAdditionalDataValidate } from '@/core/api/calls.api'
import ModeratorCommentEmptyWrapper from '@c/Call/ModeratorCommentEmptyWrapper.vue'

const props = defineProps<{
  objectId: number
}>()

const emits = defineEmits(['edit-call'])

const callsTableRef = ref(null)

const windowStore = useWindowStore()

let object: CallObject | undefined
const objectData = ref<IObjectDto | null>(null)

const asyncBlockLoading = ref(false)

const callInfo = computed(() => {
  return objectData.value.CallInfo
})
const callBlockGroups = computed(() => {
  return objectData.value.Groups
})
const callAdditionalInfo = computed(() => {
  return objectData.value.AdditionalInfo
})
const callSubject = computed(() => {
  return objectData.value.CallSubject
})
const moderatorComment = computed(() => {
  return objectData.value.ModeratorComment
})
const closestCalls = computed(() => {
  return objectData.value.TableCloseCalls
})

const isModeratorCommentEditing = computed({
  get() {
    return objectData.value.ModeratorComment.editing
  },
  set(newValue) {
    objectData.value.ModeratorComment.editing = newValue
  },
})

const isLoadingModeratorCommentUpdate = ref(false)
const moderatorCommentValidationError = ref(false)
const moderatorCommentSave = async () => {
  if (!isLoadingModeratorCommentUpdate.value) {
    isLoadingModeratorCommentUpdate.value = true

    const payload = {
      ObjectId: props.objectId,
      Vals: {
        ModeratorComment: moderatorComment.value.Value,
      },
    }

    const validation = await CallUpdateAdditionalDataValidate(payload)

    if (validation.error) {
      console.log('Ошибка валидации')
      isLoadingModeratorCommentUpdate.value = false
      return
    }
    if (validation.data && !validation.data.TotalOk) {
      isLoadingModeratorCommentUpdate.value = false
      moderatorCommentValidationError.value =
        validation.data.Results?.ModeratorComment?.ErrorDesription || 'Ошибкa валидации'
      return
    }

    const { error } = await CallUpdateAdditionalData(payload)
    if (error) {
      isLoadingModeratorCommentUpdate.value = false
      console.log(error[0].Message)
      return
    }

    await object.loadData()
    objectData.value = object.getCurrentState()
    isModeratorCommentEditing.value = false
    isLoadingModeratorCommentUpdate.value = false

    if (callsTableRef.value) {
      await callsTableRef.value.loadTableData()
    }
  }
}
const moderatorCommentInput = async (newComment: string) => {
  objectData.value.ModeratorComment.Value = newComment
}

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
  async (BaseObjectId) => {
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

    objectData.value = object.getCurrentState()
  },
  {
    immediate: true,
  },
)

const openEditCall = () => {
  emits('edit-call')
}
</script>

<style scoped lang="scss">
.call-main-page {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr 60px;
  overflow: hidden;

  &__content {
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
    border-top: 1px solid var(--color-border);

    &-side {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      overflow-y: auto;
      border-right: 1px solid var(--color-border);
      > :not(:last-child) {
        border-bottom: 1px solid var(--color-border);
      }
      &-item {
        padding: 20px 24px;
      }
    }

    &-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: min-content;
      overflow: hidden;
      overflow-y: auto;
      padding: 16px 24px;
      row-gap: 36px;
      column-gap: 24px;
    }
  }

  &__add-moderator-comment-button {
    :deep(.button__content) {
      color: var(--color-primary);
      gap: 6px;
    }

    :deep(.button.link .button__content) {
      padding: 0 !important;
    }

    :deep(.button:focus) {
      outline-width: 1px;
    }
  }

  &__closest-calls {
    grid-column: span 2;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    padding: 10px 30px;
  }
}
</style>
