<template>
  <div class="custom-profile">
    <h1>Профиль пользователя</h1>
    
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar-container">
          <img 
            :src="userAvatar" 
            alt="Аватар пользователя" 
            class="avatar" 
          />
          <button 
            class="change-avatar-btn"
            @click="changeAvatar"
            :style="{ backgroundColor: primaryColor }"
          >
            Изменить
          </button>
        </div>
        
        <div class="user-info">
          <h2>{{ userName }}</h2>
          <p class="user-email">{{ userEmail }}</p>
          <p class="user-role">Роль: {{ userRole }}</p>
        </div>
      </div>
      
      <div class="profile-sections">
        <div class="section">
          <h3>Личные данные</h3>
          <div class="form-group">
            <label for="fullName">Полное имя</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="profileData.fullName" 
              placeholder="Введите полное имя"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Телефон</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="profileData.phone" 
              placeholder="Введите номер телефона"
            />
          </div>
          
          <div class="form-group">
            <label for="address">Адрес</label>
            <textarea 
              id="address" 
              v-model="profileData.address" 
              placeholder="Введите адрес"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="section">
          <h3>Настройки аккаунта</h3>
          <div class="form-group">
            <label for="notifications">Уведомления</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="profileData.notifications.email" 
                />
                Email-уведомления
              </label>
              
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="profileData.notifications.sms" 
                />
                SMS-уведомления
              </label>
              
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="profileData.notifications.push" 
                />
                Push-уведомления
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="language">Язык интерфейса</label>
            <select id="language" v-model="profileData.language">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="profile-actions">
        <button 
          class="save-btn" 
          @click="saveProfile"
          :style="{ backgroundColor: primaryColor }"
        >
          Сохранить изменения
        </button>
        
        <button 
          class="cancel-btn" 
          @click="resetProfile"
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
  name: 'CustomProfile',
  
  setup() {
    // Получаем доступ к конфигурации ядра
    const primaryColor = computed(() => core.config.theme.primary);
    
    // Данные пользователя (в реальном приложении будут загружаться с сервера)
    const userData = {
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      role: 'Администратор',
      avatar: '/assets/default-avatar.png',
    };
    
    // Реактивные данные профиля
    const profileData = reactive({
      fullName: userData.name,
      phone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Примерная, д. 1',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      language: 'ru',
    });
    
    // Вычисляемые свойства
    const userName = computed(() => userData.name);
    const userEmail = computed(() => userData.email);
    const userRole = computed(() => userData.role);
    const userAvatar = computed(() => userData.avatar);
    
    // Методы
    const changeAvatar = () => {
      // Логика изменения аватара
      alert('Функция изменения аватара будет реализована позже');
    };
    
    const saveProfile = () => {
      // Логика сохранения профиля
      alert('Профиль успешно сохранен!');
    };
    
    const resetProfile = () => {
      // Сброс данных профиля
      profileData.fullName = userData.name;
      profileData.phone = '+7 (999) 123-45-67';
      profileData.address = 'г. Москва, ул. Примерная, д. 1';
      profileData.notifications = {
        email: true,
        sms: false,
        push: true,
      };
      profileData.language = 'ru';
    };
    
    return {
      primaryColor,
      userName,
      userEmail,
      userRole,
      userAvatar,
      profileData,
      changeAvatar,
      saveProfile,
      resetProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-profile {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: 30px;
    color: v-bind('primaryColor');
  }
  
  .profile-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    
    .avatar-container {
      margin-right: 30px;
      text-align: center;
      
      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
        border: 3px solid v-bind('primaryColor');
      }
      
      .change-avatar-btn {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-weight: bold;
      }
    }
    
    .user-info {
      h2 {
        margin: 0 0 10px;
        color: v-bind('primaryColor');
      }
      
      .user-email {
        color: #666;
        margin: 0 0 5px;
      }
      
      .user-role {
        font-weight: bold;
        margin: 0;
      }
    }
  }
  
  .profile-sections {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .section {
      h3 {
        margin-top: 0;
        margin-bottom: 20px;
        color: v-bind('primaryColor');
      }
      
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        input[type="text"],
        input[type="tel"],
        textarea,
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
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
  }
  
  .profile-actions {
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
      
      &.cancel-btn {
        background-color: #e0e0e0;
        color: #333;
      }
    }
  }
}
</style> 