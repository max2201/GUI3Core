<template>
  <div class="example-dashboard">
    <h1>Пример панели управления</h1>
    <p>Это компонент из модуля "example"</p>
    
    <div class="dashboard-cards">
      <div class="card" v-for="card in cards" :key="card.id">
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </div>
    </div>
    
    <div class="theme-info">
      <h3>Текущая тема</h3>
      <div class="color-sample" :style="{ backgroundColor: primaryColor }">
        Основной цвет
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { core } from '@/core';

export default defineComponent({
  name: 'ExampleDashboard',
  
  setup() {
    // Получаем доступ к конфигурации ядра
    const primaryColor = computed(() => core.config.theme.primary);
    
    // Демо-данные
    const cards = [
      {
        id: 1,
        title: 'Статистика',
        description: 'Здесь может быть статистика вашего модуля',
      },
      {
        id: 2,
        title: 'Действия',
        description: 'Здесь могут быть действия, доступные пользователю',
      },
      {
        id: 3,
        title: 'Настройки',
        description: 'Быстрый доступ к настройкам модуля',
      },
    ];
    
    return {
      primaryColor,
      cards,
    };
  },
});
</script>

<style lang="scss" scoped>
.example-dashboard {
  padding: 20px;
  
  h1 {
    margin-bottom: 20px;
  }
  
  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
    .card {
      padding: 20px;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      h3 {
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      p {
        margin: 0;
      }
    }
  }
  
  .theme-info {
    margin-top: 30px;
    
    .color-sample {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      margin-top: 10px;
    }
  }
}
</style> 