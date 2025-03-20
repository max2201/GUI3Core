<template>
  <div class="kanbanHeader">
    <div class="kanbanHeader-search">
      <UiInput1
          :additional-class="['kanbanHeader-search__input']"
        v-model="inputText"
        placeholder="Поиск..."
        icon="search"
        icon-position="left"
          clearable
      />
    </div>
    <div class="kanbanHeader-count">Всего: {{ tasks.totalCount }}</div>
    <div class="kanbanHeader-reload"><svgIcon @click="reloadKanban" name="rotate-cw" /></div>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '@/core/store/tasks.store'

const tasks = useTasksStore()

const inputText = ref('')

const getKanban = () => {
  const filter = {
    txtSmartFilter: inputText.value,
  }
  tasks.getKanbanDashboard(filter)
}

watch(
  () => inputText.value,
  () => {
    getKanban()
  }
)

const reloadKanban = () => {
  getKanban()
}
</script>
