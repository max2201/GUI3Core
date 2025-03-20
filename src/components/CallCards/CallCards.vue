<template>
  <div :style="setCallCardsHeight()" class="callCards">
    <callCard
      v-for="(card, index) in callCardsArray"
      :key="card.id"
      :cardData="card"
      :style="setCardStyles(card)"
      @click="setViewCard(index)"
    />
  </div>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { computed } from 'vue'
import { CallCardsConst } from '@/core/constants/CallCards'
import { useCallCardsStore } from '@/core/store/callCards.store'
const callCardsStore = useCallCardsStore()

import CallCard from '@c/CallCards/CallCard.vue'
const callCardsArray = ref([])
// Устанавливаем высоту родительского блока, нужно для плавной анимации
const setCallCardsHeight = (): string => {
  const cardsHeight =
    CallCardsConst.cardHeight + CallCardsConst.cardGap * (CallCardsConst.cardsToView - 1)
  return `height: ${cardsHeight}px`
}
// Здесь устанавливаем стили поднятия(наложение) снизу для карточек и их z-индекс
const setCardStyles = (card: object): string => {
  return `bottom: ${card.bottom}; z-index: ${card.zIndex}`
}
// Здесь устанавливаем bottom при выборе активной карточки
const setViewCard = (activeIndex): void => {
  const offsetBottom = CallCardsConst.cardHeight - CallCardsConst.cardGap
  callCardsArray.value.forEach((card, cardIndex) => {
    if (cardIndex === activeIndex) {
      card.bottom = `${cardIndex * CallCardsConst.cardGap}px`
    }
    if (cardIndex < activeIndex) {
      card.bottom = `${cardIndex * CallCardsConst.cardGap - offsetBottom}px`
    }
    if (cardIndex > activeIndex) {
      card.bottom = `${cardIndex * CallCardsConst.cardGap}px`
    }
  })
}
// Получаем массив карточек, отрезаем лишнее и переворачиваем, чтоб можно было корректно проставить стили
// и последний элемент был визуально самым нижним
const getCallCardsArray = computed(() => {
  return cloneDeep(callCardsStore.testDataCallsCards).slice(-CallCardsConst.cardsToView).reverse()
})

// При открытии карточек или при изменении(но когда карточки открыты) мы выставляем их визуальное отображение
watch(
  () => [callCardsStore.callsCardsOpened, getCallCardsArray.value],
  ([callsCardsOpened, getCallCardsArray]) => {
    if (callsCardsOpened) {
      callCardsArray.value = getCallCardsArray
      callCardsArray.value.forEach((card, index) => {
        if (card) {
          card.bottom = `${index * CallCardsConst.cardGap}px`
          card.zIndex = CallCardsConst.lastZIndex - index
        } else {
          card.zIndex = CallCardsConst.lastZIndex
        }
      })
    }
  }
)
</script>
