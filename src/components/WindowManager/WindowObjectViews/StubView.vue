<template>
  <div></div>
  <div class="stub-view">
    <SvgIcon name="stub-box" :width="170" :height="180" />
    <div>Карточка объекта находится в разработке</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.stub-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: var(--color-font-disabled);
  font-weight: var(--font-weight-500);
  font-size: var(--font-size-16);
  line-height: 150%;
}
</style>
