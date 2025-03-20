<template>
  <div class="call-lite-view">
    <ConnectionStatus v-if="callInfo" :call-info="callInfo" />
    <div class="call-lite-view__content">
      <PanelListGroup
        v-for="group in callBlockGroups"
        :key="`group-${group.Code}`"
        class="call-main-page__group"
        :group="group"
      >
        <template #fields="{ fields }">
          <SimpleViewField v-for="field in fields" :key="`field-${field.Code}`" :field="field" />
        </template>
      </PanelListGroup>
      <PanelListGroup
        v-for="group in callAdditionalInfo.Groups"
        :key="`group-${group.Code}`"
        class="call-lite-view__group"
        :group="group"
      >
        <template #fields="{ fields }">
          <Component
            v-for="field in fields"
            :key="`field-${field.Code}`"
            :is="getComponentForField(field.FieldType)"
            :field="field"
          ></Component>
        </template>
      </PanelListGroup>
    </div>
    <CommentField
      class="call-lite-view__call-subject"
      compact
      v-if="callSubject"
      :field="callSubject"
    ></CommentField>
    <div class="call-lite-view__footer">
      <UiButton1
        size="large"
        v-if="+callInfo.Detailing"
        class="call-lite-view__footer-action"
        @click="handleDownload"
        >Скачать
      </UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IObjectDto, ViewFieldTypes } from '@/core/interface/Object'
import SimpleViewField from '@c/Ui/DataDisplay/Fields/SimpleViewField.vue'
import SimpleWithTextDetailField from '@c/Ui/DataDisplay/Fields/SimpleWithTextDetailField.vue'
import { GetAsyncBlockInfo } from '@/core/api/object.api'
import { cloneDeep } from 'lodash'
import { reactive } from 'vue'
import { TelephonyModuleId } from '@/core/constants/ModuleId'

const props = defineProps<{
  callData: any
}>()

let localCallData = reactive(cloneDeep(props.callData) as IObjectDto)

const callInfo = computed(() => {
  return localCallData?.CallInfo
})

const callBlockGroups = computed(() => {
  return localCallData?.LiteViewBlockGroups
})
const callAdditionalInfo = computed(() => {
  return localCallData?.AdditionalInfo
})
const callSubject = computed(() => {
  return localCallData?.CallSubject
})

onMounted(async () => {
  try {
    const { data, error } = await GetAsyncBlockInfo({
      BaseObjectId: localCallData.AdditionalInfo.LinkedObjectId,
      ModuleId: TelephonyModuleId,
      BaseObjectType: localCallData.AdditionalInfo.LinkedObjectType,
      BlockCode: localCallData.AdditionalInfo.Code,
    })
    if (!data || error) {
      console.log('Ошибка при загрузке дополнительной информации: ', error)
      return
    }
    Object.assign(localCallData.AdditionalInfo, data)
  } catch (error) {
    console.error('Error loading async block info', error)
  }
})

const getComponentForField = (fieldType: ViewFieldTypes) => {
  switch (fieldType) {
    case ViewFieldTypes.SimpleView:
      return SimpleViewField
    case ViewFieldTypes.SimpleWithTextDetail:
      return SimpleWithTextDetailField
    default:
      return SimpleViewField
  }
}
const handleDownload = () => {
  const href = callInfo.value.Fields.find((field) => field.Code === 'Link').Value
  if (href) {
    const link = document.createElement('a')
    link.href = `${import.meta.env.VITE_API_URL}/${href}`
    link.click()
  }
}
</script>

<style scoped lang="scss">
.call-lite-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    row-gap: 28px;
    column-gap: 24px;
    padding: 20px 24px;
  }

  &__call-subject {
    padding: 8px 24px;
  }

  &__footer {
    min-height: 52px;
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    padding: 8px 30px;
    background-color: #f0f5f9;
    border-top: 1px solid #d5dde3;
  }
}
</style>
