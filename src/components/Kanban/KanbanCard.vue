<template>
  <div class="kanbanCard">
    <div class="kanbanCard__header">
      <div class="kanbanCard__header-row">
        <p>Задача: {{ data.taskNumber }}</p>
        <span :class="data.status">{{ data.status }}</span>
        <div :title="data.commandTitle" class="play">
          <svgIcon @click="executeCommand(data.taskNumber, data.commandCode)" name="play-circle" />
        </div>
      </div>
      <div v-if="data.headerTitle" class="kanbanCard__header-object">
        <h2>{{ data.headerTitle }}</h2>
        <span>
          <svgIcon name="arrow-right-circle" @click="openWindowManger(data)" />
        </span>
      </div>
    </div>
    <div class="kanbanCard__body">
      <div
        v-for="field in data.fields"
        :class="`bckColor-${field.SystemColor} color-${field.SystemColor}`"
        class="kanbanCard__body-author"
      >
        <div class="test" v-if="field.Code !== 'CommonDescription'">
          <span>{{ field.Title }}: </span> {{ field.Value }}
        </div>
        <div class="test" v-else>{{ field.Title }} {{ field.Value }}</div>
      </div>
      <div class="kanbanCard__body-action">
        <span @click="executeCommand(data.taskNumber, data.secondaryCommandCode)">
          {{ data.secondaryCommandTitle }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { delay } from 'lodash'
import debounce from 'lodash/debounce'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { GetObjectDto } from '@/core/api/object.api'
import { useTasksStore } from '@/core/store/tasks.store'
import { createObjectInstance } from '@/core/services/createObjectInstance'

const windowStore = useWindowStore()
const sharedModals = useSharedModalsStore()
const tasks = useTasksStore()

const props = defineProps<{
  data: object
}>()

const openWindowManger = async (item) => {
  const object = createObjectInstance(item.primaryObject.objectId, item.primaryObject.objectType)

  windowStore.addTab({
    id: object.id,
    title: `${item.headerTitle}`,
    type: object.type,
    data: object.rawData,
    object,
  })
}

const getCommand = debounce((taskNumber, commandCode, parentBlock): void => {
  tasks.getExecuteCommand(taskNumber, commandCode)
  if (commandCode === 'setAsExecutor' || commandCode === 'refuseTask') {
    parentBlock.classList.add('kanbanCard-show')
    delay(() => {
      parentBlock.classList.remove('kanbanCard-show')
    }, 500)
  }
}, 400)

const executeCommand = (taskNumber, commandCode) => {
  const parentBlock = event.target.closest('.kanbanCard')
  if (commandCode === 'setAsExecutor' || commandCode === 'refuseTask') {
    parentBlock.classList.add('kanbanCard-hide')
    delay(() => {
      parentBlock.classList.remove('kanbanCard-hide')
    }, 500)
  }
  getCommand(taskNumber, commandCode, parentBlock)
}
</script>
