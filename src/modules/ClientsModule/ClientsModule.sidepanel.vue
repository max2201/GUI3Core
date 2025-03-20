<template>
  <TableSidebar @toggle="handlePanelToggle">
    <div v-if="expanded" class="sidepanel__stats">
      <div class="sidepanel__stat stat">
        <span class="stat__label">Всего клиентов </span>
        <span class="stat__value _green">1</span>
      </div>
      <div class="sidepanel__stat stat">
        <span class="stat__label">Исходящий баланс </span>
        <span class="stat__value">28 151 314.32</span>
      </div>
    </div>

    <template v-slot:actions>
      <UiButton1 :icon-size="24" size="small" icon-left="file-output" centered>
        <span v-if="expanded" class="sidepanel__button-label">Перемещение</span></UiButton1
      >
    </template>
  </TableSidebar>
</template>

<script setup lang="ts">
const expanded = ref(false)

const handlePanelToggle = () => {
  expanded.value = !expanded.value
}
</script>

<style lang="scss" scoped>
.stat {
  display: flex;
  flex-direction: column;
  & + & {
    margin-top: 12px;
  }
  &__label {
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-14);
    line-height: 1.4;
    color: var(--color-font);
  }
  &__value {
    margin-top: 2px;
    font-weight: var(--font-weight-600);
    font-size: 18px;
    line-height: 1.4;

    &._green {
      color: var(--color-green);
    }
    &._red {
      color: var(--color-red);
    }
    &._empty {
      color: var(--color-gray);
      font-weight: var(--font-weight-400);
      font-size: var(--font-size-14);
      font-style: italic;
    }
  }
}
</style>
