<template>
  <div class="kanban-wrapper">
    <kanbanHeader />
    <div class="kanban__row">
      <div class="kanban__row-column" v-for="column in dataArray" :key="column.id">
        <div class="column">
          <div class="column__header">
            <div class="column__header-title">{{ column.title }}: {{ column.items.length }}</div>
            <div class="column__header-border" :style="`background-color: ${column.color}`"></div>
          </div>
          <kanbanCard v-for="card in column.items" :key="card.status" :data="card" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTasksStore } from '@/core/store/tasks.store'
const tasks = useTasksStore()

onMounted(() => {
  tasks.getKanbanDashboard()
})

const dataArray = computed(() => {
  return tasks.desktopKanbanArray
})
</script>
