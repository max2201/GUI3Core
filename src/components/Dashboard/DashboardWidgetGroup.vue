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
  background-color: var(--component-background);
  border-radius: 8px;
  height: inherit;
  overflow: auto;

  &__head {
    padding: 12px 20px;
    border-bottom: 1px solid var(--color-bg-darken);
    display: flex;
    align-items: center;
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
    flex: 1;
    justify-content: flex-end;
    gap: 8px;
  }

  &__widgets {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: auto;
    padding: 12px 0 16px;
    flex: 1;
  }
}
</style>
