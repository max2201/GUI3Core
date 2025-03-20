<template>
  <div class="task_card">
    <div class="task_card-appoint">
      <svgIcon name="plus-circle" @click="preSet" />
    </div>
    <div class="task_card__info">
      <div :class="`color-${taskData.color}`" class="task_card__info-header">
        <h2>{{ taskData.title }}</h2>
        <div
          v-show="showHint"
          @click.stop="setExecutor(taskData.objectId, taskData.id)"
          class="hint green"
        >
          Нажмите сюда чтобы продолжить
        </div>
      </div>
      <div class="">
        <div v-if="taskData.author" class="task_card__info-author">
          <span>Кому:</span>
          <p>{{ taskData.author }}</p>
        </div>
        <div v-if="taskData.objectTitle" class="task_card__info-object">
          <span>Договор:</span>
          <p>{{ taskData.objectTitle }}<svgIcon name="open-here" /></p>
          <svgIcon name="play-circle" @click="openWindowManger(taskData)" />
        </div>
      </div>
      <div v-if="taskData.text" title="Заявка с сайта" class="task_card__info-text">
        <p>{{ taskData.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { delay } from 'lodash'
import { GetObjectDto } from '@/core/api/object.api'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { useTasksStore } from '@/core/store/tasks.store'
import { createObjectInstance } from '@/core/services/createObjectInstance'

const windowStore = useWindowStore()
const sharedModals = useSharedModalsStore()
const tasks = useTasksStore()

const props = defineProps<{
  taskData: object
}>()

const showHint = ref(false)

const openWindowManger = async (item) => {
  const object = createObjectInstance(item.objectId, item.objectType)

  tasks.closeTasks()
  windowStore.addTab({
    id: object.id,
    title: `${item.title}`,
    type: object.type,
    data: object.rawData,
    object,
  })
}

const preSet = () => {
  showHint.value = true
  delay(() => {
    showHint.value = false
  }, 2000)
}

const setExecutor = (objectId, id) => {
  showHint.value = false
  tasks.setExecutorForTask(objectId, id)
}
</script>
