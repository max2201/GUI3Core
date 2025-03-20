<template>
  <div :class="cardData.callType" class="callCard">
    <div class="callCard-icon">
      <SvgIcon name="call-incoming" />
    </div>
    <div class="callCard__info">
      <div class="callCard__info-header">
        <p>{{ setCallTypeName(cardData.callType) }}</p>
        <span> {{ cardData.date }} {{ cardData.time }} </span>
      </div>
      <div class="callCard__info-callerName">{{ cardData.callerName }}</div>
      <div class="callCard__info-status"><span>Статус звонка: </span>{{ cardData.callStatus }}</div>
      <div class="callCard__info-phoneNumber">
        <span>Входящ.линия: </span>{{ cardData.phoneNumber }}
      </div>
      <div class="callCard__info-action">
        <UiButton1 size="large">Добавить заявку</UiButton1>
      </div>
    </div>
    <div class="callCard-action">
      <SvgIcon @click.stop="clickOnClose(cardData.id, $event)" name="close" />
    </div>
  </div>
</template>
<script setup lang="ts">
import debounce from 'lodash/debounce'
import type { UiCallCard } from '@/core/interface/Ui'
import { NameCasting } from '@/core/utils/NameCasting'

import { useCallCardsStore } from '@/core/store/callCards.store'
const callCardsStore = useCallCardsStore()

const props = defineProps<{
  cardData: UiCallCard
}>()
const deleteCard = debounce((id: number): void => {
  callCardsStore.deleteTestDataCallsCard(id)
}, 300)
// Находим родительский блок callCard добавляем ему класс и ждем пока проиграется анимация
const clickOnClose = (id: number, event): void => {
  const parentBlock = event.target.closest('.callCard')
  parentBlock.classList.add('callCard-delete')
  deleteCard(id)
}
const setCallTypeName = (callType: string): string => {
  return NameCasting(callType)
}
</script>
