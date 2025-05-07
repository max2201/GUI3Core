<template>
  <div class="example-settings">
    <h1>Настройки модуля</h1>
    <p>Здесь вы можете настроить модуль "example"</p>
    
    <div class="settings-form">
      <div class="form-group">
        <label for="setting1">Настройка 1</label>
        <input 
          type="text" 
          id="setting1" 
          v-model="settings.setting1" 
          placeholder="Введите значение"
        />
      </div>
      
      <div class="form-group">
        <label for="setting2">Настройка 2</label>
        <select id="setting2" v-model="settings.setting2">
          <option value="option1">Опция 1</option>
          <option value="option2">Опция 2</option>
          <option value="option3">Опция 3</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="setting3">Настройка 3</label>
        <input 
          type="checkbox" 
          id="setting3" 
          v-model="settings.setting3" 
        />
        <span>Включить функцию</span>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          class="save-button" 
          @click="saveSettings"
          :style="{ backgroundColor: primaryColor }"
        >
          Сохранить
        </button>
        <button 
          type="button" 
          class="cancel-button" 
          @click="resetSettings"
        >
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { core } from '@/core';

export default defineComponent({
  name: 'ExampleSettings',
  
  setup() {
    // Получаем доступ к конфигурации ядра
    const primaryColor = computed(() => core.config.theme.primary);
    
    // Реактивный объект с настройками
    const settings = reactive({
      setting1: 'Значение по умолчанию',
      setting2: 'option1',
      setting3: false,
    });
    
    // Сохранение настроек
    const saveSettings = () => {
      // Здесь можно добавить логику сохранения настроек
      // Например, через API или в локальное хранилище
      alert('Настройки сохранены!');
    };
    
    // Сброс настроек
    const resetSettings = () => {
      settings.setting1 = 'Значение по умолчанию';
      settings.setting2 = 'option1';
      settings.setting3 = false;
    };
    
    return {
      primaryColor,
      settings,
      saveSettings,
      resetSettings,
    };
  },
});
</script>

<style lang="scss" scoped>
.example-settings {
  padding: 20px;
  
  h1 {
    margin-bottom: 20px;
  }
  
  .settings-form {
    max-width: 600px;
    margin-top: 30px;
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      
      input[type="text"],
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      input[type="checkbox"] {
        margin-right: 10px;
      }
    }
    
    .form-actions {
      margin-top: 30px;
      display: flex;
      gap: 10px;
      
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        
        &.save-button {
          color: white;
        }
        
        &.cancel-button {
          background-color: #e0e0e0;
          color: #333;
        }
      }
    }
  }
}
</style> 