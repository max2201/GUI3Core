<template>
  <div class="custom-home">
    <h1>Добро пожаловать в {{ appName }}</h1>
    
    <div class="home-content">
      <div class="logo-container">
        <img :src="logo" alt="Логотип" class="logo" />
      </div>
      
      <div class="features">
        <h2>Возможности приложения</h2>
        <ul>
          <li v-for="(feature, index) in features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <div class="theme-preview">
        <h2>Текущая тема</h2>
        <div class="color-samples">
          <div 
            class="color-sample primary" 
            :style="{ backgroundColor: primaryColor }"
          >
            Основной цвет
          </div>
          <div 
            class="color-sample secondary" 
            :style="{ backgroundColor: secondaryColor }"
          >
            Вторичный цвет
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { core } from '@/core';

export default defineComponent({
  name: 'CustomHome',
  
  setup() {
    // Получаем доступ к конфигурации ядра
    const appName = computed(() => core.config.appName);
    const logo = computed(() => core.config.logo);
    const primaryColor = computed(() => core.config.theme.primary);
    const secondaryColor = computed(() => core.config.theme.secondary);
    
    // Список возможностей приложения
    const features = [
      'Модульная архитектура',
      'Настраиваемый интерфейс',
      'Расширяемая функциональность',
      'Интеграция с внешними сервисами',
    ];
    
    return {
      appName,
      logo,
      primaryColor,
      secondaryColor,
      features,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-home {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    text-align: center;
    margin-bottom: 40px;
    color: v-bind('primaryColor');
  }
  
  .home-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      
      .logo {
        max-width: 200px;
        height: auto;
      }
    }
    
    .features {
      h2 {
        margin-bottom: 20px;
        color: v-bind('primaryColor');
      }
      
      ul {
        list-style-type: none;
        padding: 0;
        
        li {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    .theme-preview {
      grid-column: 1 / -1;
      
      h2 {
        margin-bottom: 20px;
        color: v-bind('primaryColor');
      }
      
      .color-samples {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        
        .color-sample {
          padding: 15px 30px;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          text-align: center;
          min-width: 150px;
          
          &.primary {
            background-color: v-bind('primaryColor');
          }
          
          &.secondary {
            background-color: v-bind('secondaryColor');
          }
        }
      }
    }
  }
}
</style> 