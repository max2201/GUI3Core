<template>
  <div class="dashboard-widget-group">
    <div class="dashboard-widget-group__head">
      <div class="dashboard-widget-group__head-title" :title="groupName">
        <slot name="title">
          <h3>{{ groupName }}</h3>
        </slot>
      </div>

      <div class="dashboard-widget-group__actions">
        <slot name="actions">
        <UiButton1
          title="Редактировать"
          v-if="allowEdit"
          variant="text"
          theme="transparent"
          :icon-size="20"
          icon-left="settings"
          @click="openSettings"
        ></UiButton1>
        <UiButton1
          title="Обновить данные"
          :loading="loading"
          variant="text"
          theme="transparent"
          :icon-size="20"
          icon-left="rotate-cw"
          @click="reloadGroupData"
        ></UiButton1>
      </slot>
      </div>
    </div>
    <div v-if="$slots.default" class="dashboard-widget-group__widgets">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  groupName?: string
  loading?: boolean
  allowEdit?: boolean
}>()

const emit = defineEmits(['reloadData', 'openSettings'])
const reloadGroupData = () => {
  emit('reloadData')
}
const openSettings = () => {
  emit('openSettings')
}
</script>

<style lang="scss" scoped>
.dashboard-widget-group {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 20px;
  gap: 16px;
  height: min-content;
  overflow: hidden;

  &__head {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    font-family: Inter;
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-16);
    line-height: 20px;

    &-title {
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 5px;
      overflow: hidden;

      h3 {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__widgets {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: auto;
  }
}
</style>
