<template>
  <div class="custom-analytics">
    <h1>Аналитика и статистика</h1>
    
    <div class="analytics-container">
      <div class="analytics-header">
        <div class="date-range">
          <label for="startDate">Период:</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="dateRange.start"
            @change="updateAnalytics"
          />
          <span>—</span>
          <input 
            type="date" 
            id="endDate" 
            v-model="dateRange.end"
            @change="updateAnalytics"
          />
        </div>
        
        <div class="refresh-btn" @click="updateAnalytics">
          <span class="refresh-icon">↻</span>
          Обновить
        </div>
      </div>
      
      <div class="analytics-grid">
        <div class="stat-card" :style="{ borderColor: primaryColor }">
          <h3>Активные пользователи</h3>
          <div class="stat-value">{{ stats.activeUsers }}</div>
          <div class="stat-change" :class="{ positive: stats.userGrowth > 0 }">
            {{ stats.userGrowth > 0 ? '+' : '' }}{{ stats.userGrowth }}%
          </div>
        </div>
        
        <div class="stat-card" :style="{ borderColor: primaryColor }">
          <h3>Новые регистрации</h3>
          <div class="stat-value">{{ stats.newRegistrations }}</div>
          <div class="stat-change" :class="{ positive: stats.registrationGrowth > 0 }">
            {{ stats.registrationGrowth > 0 ? '+' : '' }}{{ stats.registrationGrowth }}%
          </div>
        </div>
        
        <div class="stat-card" :style="{ borderColor: primaryColor }">
          <h3>Среднее время сессии</h3>
          <div class="stat-value">{{ stats.avgSessionTime }} мин</div>
          <div class="stat-change" :class="{ positive: stats.sessionTimeGrowth > 0 }">
            {{ stats.sessionTimeGrowth > 0 ? '+' : '' }}{{ stats.sessionTimeGrowth }}%
          </div>
        </div>
        
        <div class="stat-card" :style="{ borderColor: primaryColor }">
          <h3>Конверсия</h3>
          <div class="stat-value">{{ stats.conversionRate }}%</div>
          <div class="stat-change" :class="{ positive: stats.conversionGrowth > 0 }">
            {{ stats.conversionGrowth > 0 ? '+' : '' }}{{ stats.conversionGrowth }}%
          </div>
        </div>
      </div>
      
      <div class="analytics-charts">
        <div class="chart-container">
          <h2>Активность пользователей</h2>
          <div class="activity-chart">
            <div 
              v-for="(value, index) in activityData.values" 
              :key="index"
              class="activity-bar"
              :style="{
                height: `${value}%`,
                backgroundColor: primaryColor,
                width: `${100 / activityData.values.length}%`
              }"
              :title="`${activityData.labels[index]}: ${value}`"
            >
              <span class="bar-value">{{ value }}</span>
            </div>
          </div>
          <div class="chart-labels">
            <span 
              v-for="(label, index) in activityData.labels" 
              :key="index"
              class="chart-label"
            >
              {{ label }}
            </span>
          </div>
        </div>
        
        <div class="chart-container">
          <h2>Распределение по устройствам</h2>
          <div class="devices-chart">
            <div 
              v-for="(value, index) in devicesData.values" 
              :key="index"
              class="device-segment"
              :style="{
                width: `${value}%`,
                backgroundColor: devicesData.colors[index]
              }"
              :title="`${devicesData.labels[index]}: ${value}%`"
            >
              <span class="segment-label">{{ devicesData.labels[index] }}</span>
              <span class="segment-value">{{ value }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="analytics-table">
        <h2>Последние действия</h2>
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Действие</th>
              <th>Время</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(action, index) in recentActions" :key="index">
              <td>{{ action.user }}</td>
              <td>{{ action.type }}</td>
              <td>{{ action.time }}</td>
              <td>
                <span 
                  class="status-badge"
                  :class="action.status"
                >
                  {{ action.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { core } from '@/core';

export default defineComponent({
  name: 'CustomAnalytics',
  
  setup() {
    const primaryColor = computed(() => core.config.theme.primary);
    
    // Диапазон дат
    const dateRange = reactive({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    });
    
    // Статистика
    const stats = reactive({
      activeUsers: 1250,
      userGrowth: 12.5,
      newRegistrations: 345,
      registrationGrowth: 8.3,
      avgSessionTime: 24,
      sessionTimeGrowth: -2.1,
      conversionRate: 3.8,
      conversionGrowth: 1.2,
    });
    
    // Данные для графиков
    const activityData = reactive({
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      values: [65, 59, 80, 81, 56, 55, 40],
    });
    
    const devicesData = reactive({
      labels: ['Десктоп', 'Мобильные', 'Планшеты'],
      values: [45, 40, 15],
      colors: ['#4CAF50', '#2196F3', '#FFC107'],
    });
    
    // Последние действия
    const recentActions = [
      {
        user: 'Иван Петров',
        type: 'Вход в систему',
        time: '10:45',
        status: 'success',
      },
      {
        user: 'Мария Сидорова',
        type: 'Обновление профиля',
        time: '10:42',
        status: 'success',
      },
      {
        user: 'Алексей Иванов',
        type: 'Попытка входа',
        time: '10:40',
        status: 'error',
      },
      {
        user: 'Елена Смирнова',
        type: 'Изменение настроек',
        time: '10:38',
        status: 'success',
      },
    ];
    
    // Методы
    const updateAnalytics = () => {
      // Здесь будет логика обновления данных
      console.log('Обновление аналитики...');
    };
    
    return {
      primaryColor,
      dateRange,
      stats,
      activityData,
      devicesData,
      recentActions,
      updateAnalytics,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-analytics {
  padding: 30px;
  
  h1 {
    margin-bottom: 30px;
    color: v-bind('primaryColor');
  }
  
  .analytics-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .analytics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    .date-range {
      display: flex;
      align-items: center;
      gap: 10px;
      
      input[type="date"] {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }
    
    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 15px;
      background-color: v-bind('primaryColor');
      color: white;
      border-radius: 4px;
      cursor: pointer;
      
      .refresh-icon {
        font-size: 18px;
      }
    }
  }
  
  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid;
      background-color: #f8f9fa;
      
      h3 {
        margin: 0 0 10px;
        font-size: 1.1em;
        color: #666;
      }
      
      .stat-value {
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .stat-change {
        font-size: 0.9em;
        color: #dc3545;
        
        &.positive {
          color: #28a745;
        }
      }
    }
  }
  
  .analytics-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
    
    .chart-container {
      h2 {
        margin-bottom: 20px;
        color: v-bind('primaryColor');
      }
      
      .activity-chart {
        height: 300px;
        display: flex;
        align-items: flex-end;
        gap: 2px;
        padding-bottom: 30px;
        position: relative;
        
        .activity-bar {
          position: relative;
          min-height: 20px;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          
          .bar-value {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #666;
          }
        }
      }
      
      .chart-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        
        .chart-label {
          font-size: 12px;
          color: #666;
        }
      }
      
      .devices-chart {
        height: 300px;
        display: flex;
        align-items: center;
        
        .device-segment {
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          transition: width 0.3s ease;
          
          .segment-label {
            font-size: 14px;
            margin-bottom: 2px;
          }
          
          .segment-value {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .analytics-table {
    h2 {
      margin-bottom: 20px;
      color: v-bind('primaryColor');
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      th {
        font-weight: bold;
        color: #666;
      }
      
      .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        
        &.success {
          background-color: #d4edda;
          color: #155724;
        }
        
        &.error {
          background-color: #f8d7da;
          color: #721c24;
        }
      }
    }
  }
}
</style> 