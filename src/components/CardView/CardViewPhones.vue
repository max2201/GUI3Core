<template>
  <div class="phones">
    <div class="phones__title">Контакты</div>
    <div class="phone" v-for="(x, idx) in phones" :key="idx">
      <div class="phone__value">{{ x.Phone }}</div>
      <div class="phone__description">{{ x.Title }}</div>
    </div>

    <div>
      <UiButton1 :icon-size="24" size="small" iconLeft="phone" class="mr-2" />
      <UiButton1 :icon-size="24" size="small" iconLeft="chat" class="mr-6" />
      <UiButton1 :icon-size="24" size="small" iconLeft="plus-circle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPhoneCell } from '@/core/interface/Object'

const props = defineProps<{
  phones: IPhoneCell
}>()
</script>

<style lang="scss" scoped>
.phones {
  &__title {
    margin-bottom: 8px;
  }
}

.phone {
  margin-bottom: 12px;

  &__value {
    font-weight: var(--font-weight-600);
    margin-bottom: 4px;
  }
}
</style>
