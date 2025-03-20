<template>
  <div class="ai-call-page">
    <ClientInfoRow
      v-if="objectData"
      :client-id="objectData?.Contact?.BaseObjectId"
      :name="objectData?.Contact?.BaseObjectName"
      :phones="objectData.Phones || []"
      :last-active="objectData?.Contact?.BaseObjectDate"
    />
    <div v-if="objectData" class="ai-call-page__content">
      <div v-if="analysis" class="ai-call-page__content-side">
        <template v-for="item in analysis.Fields" :key="item.Code">
          <TypeFieldRenderer :field="item"></TypeFieldRenderer>
        </template>
      </div>
      <div class="ai-call-page__content-main">
        <div class="ai-call-page__content-main__control">
          <div
            class="ai-call-page__content-main__control-step"
            :class="activeStepTabIndex === 0 && 'active'"
            @click="handleActiveStep(0)"
          >
            Результаты звонка
          </div>
          <div
            class="ai-call-page__content-main__control-step"
            :class="activeStepTabIndex === 1 && 'active'"
            @click="handleActiveStep(1)"
          >
            Транскрибация звонка
          </div>
        </div>
        <div class="ai-call-page__content-main__content" v-show="activeStepTabIndex === 0">
          <template v-for="item in сallResult.Fields" :key="item.Code">
            <CommentField :field="item"></CommentField>
          </template>
        </div>
        <div class="ai-call-page__content-main__content" v-show="activeStepTabIndex === 1">
          <div
            class="ai-call-page__content-main__content-text"
            v-html="objectData.CallTranscipt"
          ></div>
        </div>
      </div>
    </div>

    <div class="ai-call-page__actions">
      <UiButton1 @click="'some'">Открыть звонок</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import type { CallObject } from '@/core/model/CallObject'

const props = defineProps<{
  objectId: number
}>()

const windowStore = useWindowStore()

let object: CallObject | undefined
const objectData = ref<IObjectDto | null>(null)

const analysis = computed(() => {
  return objectData.value.Analysis
})
const сallResult = computed(() => {
  return objectData.value.CallResult
})

const activeStepTabIndex = ref(0)
const handleActiveStep = (id: number) => {
  activeStepTabIndex.value = id
}

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
</script>

<style scoped lang="scss">
.ai-call-page {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr 60px;
  overflow: hidden;

  &__content {
    position: relative;
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr;
    border-top: 1px solid var(--color-border);
    overflow: hidden;

    &-side {
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--color-border);
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      margin-right: -1px;
      overflow: hidden;
      overflow-y: auto;
    }

    &-main {
      display: grid;
      position: relative;
      grid-template-rows: 40px 1fr;
      overflow: hidden;
      &__content {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow-y: auto;
        &-text {
          font-size: 14px;
          line-height: 16.8px;
          color: var(--color-font-1);
          white-space: pre-wrap;
        }
      }
      &__control {
        display: flex;
        gap: 24px;
        padding: 0 24px;
        background-color: var(--color-background);
        border-right: 1px solid var(--color-border);
        border-top: 0;
        &__content {
          padding: 20px;
        }
        &-step {
          position: relative;
          display: block;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 500;
          line-height: 16.8px;
          cursor: pointer;
          color: var(--color-gray);
          &.active {
            color: var(--color-font-2);
            &:after {
              content: ' ';
              position: absolute;
              bottom: 0;
              left: 0;
              height: 4px;
              width: 100%;
              background-color: var(--color-bg-active);
              border-radius: 5px 5px 0 0;
              z-index: 2;
            }
          }
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
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
