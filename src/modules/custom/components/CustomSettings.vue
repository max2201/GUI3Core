<template>
  <div class="custom-settings">
    <h1>Настройки приложения</h1>
    
    <div class="settings-container">
      <div class="settings-section">
        <h2>Внешний вид</h2>
        
        <div class="form-group">
          <label for="theme">Тема оформления</label>
          <select id="theme" v-model="settings.theme">
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
            <option value="system">Системная</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Цветовая схема</label>
          <div class="color-picker">
            <div class="color-option">
              <label>Основной цвет</label>
              <input 
                type="color" 
                v-model="settings.colors.primary"
                @change="(e: Event) => updateThemeColor('primary', (e.target as HTMLInputElement).value)"
              />
            </div>
            <div class="color-option">
              <label>Вторичный цвет</label>
              <input 
                type="color" 
                v-model="settings.colors.secondary"
                @change="(e: Event) => updateThemeColor('secondary', (e.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="fontSize">Размер шрифта</label>
          <select id="fontSize" v-model="settings.fontSize">
            <option value="small">Маленький</option>
            <option value="medium">Средний</option>
            <option value="large">Большой</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Уведомления</h2>
        
        <div class="form-group">
          <label>Типы уведомлений</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.notifications.system" 
              />
              Системные уведомления
            </label>
            
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.notifications.updates" 
              />
              Обновления приложения
            </label>
            
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.notifications.security" 
              />
              Уведомления безопасности
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="notificationSound">Звук уведомлений</label>
          <select id="notificationSound" v-model="settings.notificationSound">
            <option value="default">По умолчанию</option>
            <option value="none">Без звука</option>
            <option value="custom">Пользовательский</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Безопасность</h2>
        
        <div class="form-group">
          <label for="sessionTimeout">Таймаут сессии (минуты)</label>
          <input 
            type="number" 
            id="sessionTimeout" 
            v-model.number="settings.security.sessionTimeout"
            min="5"
            max="120"
          />
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="settings.security.twoFactor" 
            />
            Двухфакторная аутентификация
          </label>
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="settings.security.rememberDevice" 
            />
            Запомнить устройство
          </label>
        </div>
      </div>
      
      <div class="settings-actions">
        <button 
          class="save-btn" 
          @click="saveSettings"
          :style="{ backgroundColor: primaryColor }"
        >
          Сохранить настройки
        </button>
        
        <button 
          class="reset-btn" 
          @click="resetSettings"
        >
          Сбросить настройки
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { core } from '@/core';

export default defineComponent({
  name: 'CustomSettings',
  
  setup() {
    // Получаем доступ к конфигурации ядра
    const primaryColor = computed(() => core.config.theme.primary);
    
    // Начальные настройки
    const defaultSettings = {
      theme: 'light',
      colors: {
        primary: '#4CAF50',
        secondary: '#2196F3',
      },
      fontSize: 'medium',
      notifications: {
        system: true,
        updates: true,
        security: true,
      },
      notificationSound: 'default',
      security: {
        sessionTimeout: 30,
        twoFactor: false,
        rememberDevice: true,
      },
    };
    
    // Реактивные настройки
    const settings = reactive({ ...defaultSettings });
    
    // Методы
    const updateThemeColor = (type: 'primary' | 'secondary', value: string) => {
      if (type === 'primary') {
        core.config.theme.primary = value;
      } else {
        core.config.theme.secondary = value;
      }
    };
    
    const saveSettings = () => {
      // Логика сохранения настроек
      alert('Настройки успешно сохранены!');
    };
    
    const resetSettings = () => {
      // Сброс настроек к значениям по умолчанию
      Object.assign(settings, defaultSettings);
    };
    
    return {
      primaryColor,
      settings,
      updateThemeColor,
      saveSettings,
      resetSettings,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-settings {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: 30px;
    color: v-bind('primaryColor');
  }
  
  .settings-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .settings-section {
    margin-bottom: 40px;
    
    h2 {
      margin-bottom: 20px;
      color: v-bind('primaryColor');
      font-size: 1.5em;
    }
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
      }
      
      input[type="text"],
      input[type="number"],
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .color-picker {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        
        .color-option {
          label {
            margin-bottom: 5px;
          }
          
          input[type="color"] {
            width: 100%;
            height: 40px;
            padding: 2px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
        }
      }
      
      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .checkbox-label {
          display: flex;
          align-items: center;
          
          input[type="checkbox"] {
            margin-right: 10px;
          }
        }
      }
    }
  }
  
  .settings-actions {
    margin-top: 40px;
    display: flex;
    gap: 15px;
    
    button {
      padding: 12px 25px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      
      &.save-btn {
        color: white;
      }
      
      &.reset-btn {
        background-color: #e0e0e0;
        color: #333;
      }
    }
  }
}
</style> 