<template>
  <div class="draggable-phones-demo-page">
    <h1>Демонстрация перетаскиваемых телефонов</h1>
    <DraggablePhonesDemo />
  </div>
</template>

<script setup lang="ts">
import DraggablePhonesDemo from '@/components/Ui/DataDisplay/DraggablePhonesDemo.vue';
</script>

<style lang="scss" scoped>
.draggable-phones-demo-page {
  padding: 30px;
  
  h1 {
    margin-bottom: 30px;
    color: var(--color-primary);
    font-size: 24px;
  }
}
</style> 