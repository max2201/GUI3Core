<template>
  <div ref="rowRef" class="client-info-row">
    <UserSmallCard
      :fullname="name"
      :client-id="clientId"
      class="client-info-row__user"
      @click-open-client="onClick"
    />

    <div class="client-info-row__phones">
      <PhonesPanel :phones="phones" show-add show-call show-messenger show-messenger-2 />
    </div>

    <div class="client-info-row__activities">
      <span class="w-label">Последняя активность</span>
      <div class="w-value">{{ lastActive }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import type { IPhoneCell } from '@/core/interface/Object'
import type { IPhones } from '@/core/interface/Client'

const props = defineProps<{
  clientId: number
  name: string
  phones?: IPhones
  lastActive: string
}>()

const emits = defineEmits(['open-client'])

const rowRef = ref<HTMLDivElement>()

const onClick = (e) => {
  if (!rowRef.value) {
    emits('open-client')
    return
  }

  const rect = rowRef.value.parentElement.getBoundingClientRect()

  EventBus.emit(GlobalEvents.OpenLiteView, {
    e,
    top: rect.top,
    left: rect.right - 690,
    height: rect.height,
    baseObjectName: props.name,
    baseObjectType: BaseObjectType.Client,
    objectId: props.clientId,
  } as LiteViewArgs)

  emits('open-client')
}
</script>

<style lang="scss" scoped>
.client-info-row {
  display: grid;
  grid-template-columns: auto 340px 310px;
  gap: 16px;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--color-background);

  &__phones,
  &__activities {
    position: relative;
    padding: 0 20px;

    &::after {
      @include block-vertical-seporator;
    }
  }
}
</style>
