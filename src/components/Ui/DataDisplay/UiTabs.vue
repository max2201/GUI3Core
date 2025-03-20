<template>
  <div
    :class="[
      'component-tabs',
      {
        'component-tabs_light': lightStyle,
      },
    ]"
  >
    <div
      v-for="(tab, idx) in tabs"
      :key="idx"
      :class="[activeTabId === tab.id && 'component-tabs__tab_active']"
      class="component-tabs__tab"
      @click="setActiveTab(tab.id)"
    >
      <div class="component-tabs__tab__title">{{ tab.label || tab.id }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: Array<{
    id: number | string
    label: string
  }>
  activeTabId?: number | string
  lightStyle?: boolean
}>()

const emit = defineEmits(['change'])
const setActiveTab = (id: string | number) => {
  emit('change', id)
}
</script>

<style lang="scss">
.component-tabs {
  background: var(--header-background);
  color: white;
  display: flex;
  padding: 0 18px;
  overflow-x: auto;
  overflow-y: hidden;

  &_light {
    background-color: var(--color-background);
    color: var(--color-gray);
  }

  &__tab {
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    user-select: none;

    &:hover,
    &_active {
      .component-tabs__tab__title {
        color: var(--color-font-invert);

        &::after {
          transform: translateY(0px);
        }
      }
    }

    &__title {
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      @include text-overflow;
      color: var(--color-gray);
      transition: color 0.25s $ease;

      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 10px;
        right: 10px;
        height: 4px;
        border-radius: 6px 6px 0 0;
        transform: translateY(4px);
        background: currentColor;
        transition: transform 0.25s $ease;
      }
    }
  }
}

.component-tabs_light .component-tabs__tab_active .component-tabs__tab__title,
.component-tabs_light .component-tabs__tab:hover .component-tabs__tab__title {
  color: var(--color-font-2);
}
.component-tabs__tab__title:after {
  background-color: var(--color-bg-active);
}
</style>
