<template>
  <div class="phones">
    <div class="phones__list">
      <div class="phones__phone" v-if="phones.length">
        <span class="phones__phone__label">{{ phones[0].Title }}</span>
        <div class="phones__phone__vaue">{{ phones[0].Phone }}</div>
      </div>
    </div>

    <div class="phones__actions">
      <UiButton1 :icon-size="24" v-if="showCall" size="small" iconLeft="call-outgoing" />
      <UiButton1 :icon-size="24" v-if="showMessenger" size="small" iconLeft="messenger" />
      <UiButton1 :icon-size="24" v-if="showMessenger2" size="small" iconLeft="messenger-2" />
      <UiButton1 :icon-size="24" v-if="showAdd" size="small" iconLeft="plus-circle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPhoneCell } from '@/core/interface/Object'

const props = defineProps<{
  phones: IPhoneCell[]
  showCall?: boolean
  showMessenger?: boolean
  showMessenger2?: boolean
  showAdd?: boolean
}>()
</script>

<style scoped lang="scss">
.phones {
  display: flex;

  &__list {
    display: flex;
    align-items: center;
    margin-right: 24px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__phone {
    display: flex;
    flex-direction: column;

    &__label {
      font-size: var(--font-size-standart);
      color: var(--color-gray);
      width: 118px;
      @include text-overflow;
    }

    &__value {
      margin-top: 2px;
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 1.2;
    }
  }
}
</style>
