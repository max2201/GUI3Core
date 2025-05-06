<template>
  <div class="notification-panel">
    <div class="notification-panel__actions">
      <SvgIcon name="close" />
    </div>

    <div class="notification-panel__title">
      <SvgIcon
        v-if="icon"
        :name="icon.name"
        :style="{
          'color': icon.color || 'var(--color-font)'
        }"
        class="mr-2"
      />
      <h4>{{ title }}</h4>
    </div>

    <div class="notification-panel__badges">
      <div
        v-for="(badge, index) in badges || []"
        :key="index"
        :style="{
          'background-color': badge.color,
        }"
        class="notification-panel__badges__item"
      >
        {{ badge.text }}
      </div>
    </div>

    <div class="notification-panel__content">
      <div
        v-for="(contentItem, index) in content"
        :key="index"
        class="notification-panel__content-item"
      >
        <span
          v-if="contentItem.title"
          class="notification-panel__content-item__title"
        >
          {{ contentItem.title }}:
        </span>
        {{ contentItem.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: {
    name: string;
    color?: string;
  };
  title: string;
  badges?: Array<{
    text: string;
    color: string;
  }>;
  content?: Array<{
    text: string;
    title?: string;
  }>
}>()
</script>

<style lang="scss">
.notification-panel {
  display: grid;
  grid-template-areas:
  "actions title badges"
  "actions content content";
  grid-template-columns: 45px auto 200px;
  grid-template-rows: 28px auto;
  grid-gap: 6px;
  padding: 10px 12px;
  background-color: var(--component-background);
  border-radius: 5px;

  .svg-icon {
    width: 20px !important;
    height: 20px !important;
  }

  &__actions {
    grid-area: actions;
    display: flex;
    justify-content: center;
    padding-top: 4px;

    .svg-icon {
      color: var(--color-gray);

      &:hover {
        color: var(--color-primary-hover);
        cursor: pointer;
      }
    }
  }

  &__title {
    grid-area: title;
    display: flex;
    align-items: center;


  }

  &__badges {
    grid-area: badges;
    display: flex;
    align-items: center;

    &__item {
      display: inline-flex;
      justify-content: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 6px 8px;
      border-radius: 20px;
    }
  }

  &__content {
    grid-area: content;
  }

  &__content-item {
    display: inline-block;
    padding-right: 12px;
    margin-bottom: 4px;

    &__title {
      color: var(--color-gray);
    }
  }
}
</style>