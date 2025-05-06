<template>
  <div class="dashboard-settings-block">
    <div class="dashboard-settings-block__text-block">
      <h4 class="dashboard-settings-block__title">Настроить рабочий стол</h4>

      <ul class="dashboard-settings-block__description">
        <li>Перетаскивайте виджеты</li>
        <li>Меняйте их размеры</li>
        <li>Добавляйте и удаляйте виджеты</li>
        <li>Редактируйте уже добавленные</li>
      </ul>
    </div>
    <div class="dashboard-settings-block__actions">
      <template v-if="editMode">
        <button class="dashboard-settings-block__action" @click="addWidget">
          <SvgIcon
            class="dashboard-settings-block__action-icon"
            :height="52"
            :width="52"
            name="dashboard-add-widget"
          ></SvgIcon>
          Добавить виджет
        </button>
        <button class="dashboard-settings-block__action" @click="toggleEditMode">
          <SvgIcon
            class="dashboard-settings-block__action-icon"
            :height="52"
            :width="52"
            name="dashboard-setting-up-end"
          ></SvgIcon>
          Завершить настройку
        </button>
      </template>

      <button class="dashboard-settings-block__action" v-else @click="toggleEditMode">
        <SvgIcon
          class="dashboard-settings-block__action-icon"
          :height="52"
          :width="52"
          name="dashboard-setting-up-start"
        ></SvgIcon>
        Начать настройку
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  editMode?: boolean
}>()

const toggleEditMode = () => {
  emit('update:editMode', !props.editMode)
}

const addWidget = () => {
  emit('addWidget')
}

const emit = defineEmits(['update:editMode', 'addWidget'])
</script>

<style lang="scss" scoped>
.dashboard-settings-block {
  $this: &;

  overflow: hidden;
  padding: 20px;
  border: 2px dashed #8990a2;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;
  &:has(.dashboard-settings-block__action:hover) {
    border-color: #1a8ff2;
  }

  &__text-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4.5px 0;
    width: 100%;
  }

  &__title {
    font-family: Inter;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    letter-spacing: 0;
    text-align: center;
    vertical-align: middle;

    color: #8990a2;
  }

  &__description {
    padding-left: 20px;
    align-self: center;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    letter-spacing: 0;
    vertical-align: middle;
    color: #8990a2;

    li {
      list-style: disc;
    }
  }

  &__actions {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  &__action {
    flex: 1;
    max-width: 143px;
    background: #ffffff;
    box-shadow: 0 4px 20px 0 #273f530f;
    border: none;
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    letter-spacing: 0;
    text-align: center;
    vertical-align: middle;
    color: #8990a2;

    &:hover {
      box-shadow: 0 4px 20px 0 #273f5333;
      color: #23282f;
    }

    &-icon {
      color: #ffffff;
    }
  }
}
</style>
