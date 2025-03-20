import { DeleteObjectFromArrayOnId } from '@/core/utils/DeleteObjectFromArrayOnId'
import type { UiCallCard } from '@/core/interface/Ui'

export const useCallCardsStore = defineStore('callCardsStore', () => {
  const callsCardsOpened = ref(false)
  const testDataCallsCards = ref([])

  const toggleCallsCardsOpened = (opened: boolean): void => {
    callsCardsOpened.value = opened
  }
  const setTestDataCallsCards = (arrayCallsCard: UiCallCard[]): void => {
    testDataCallsCards.value.push(...arrayCallsCard)
  }
  const getTestDataCallsCards = (): void => {
    const data = [
      {
        id: 172365,
        icon: 'test',
        callType: 'outgoingCall',
        date: '08.09.2023',
        time: '16:13',
        callerName: '0Белоусов Максим Николаевич',
        callStatus: 'Установлено соединение',
        phoneNumber: '+ 7 (495) 021-49-19',
        actionType: 'add',
        viewed: false,
        bottom: '',
        zIndex: 0,
      },
      {
        id: 172396,
        icon: 'test',
        callType: 'outgoingCall',
        date: '08.09.2023',
        time: '16:14',
        callerName: '1Белоусов Максим Николаевич',
        callStatus: 'Установлено соединение',
        phoneNumber: '+ 7 (495) 021-49-19',
        actionType: 'add',
        viewed: false,
        bottom: '',
        zIndex: 0,
      },
      {
        id: 172356,
        icon: 'test',
        callType: 'incomingCall',
        date: '08.09.2023',
        time: '16:15',
        callerName: '2Белоусов Максим Николаевич',
        callStatus: 'Установлено соединение',
        phoneNumber: '+ 7 (495) 021-49-19',
        actionType: 'add',
        viewed: false,
        bottom: '',
        zIndex: 0,
      },
      {
        id: 172377,
        icon: 'test',
        callType: 'activeCall',
        date: '08.09.2023',
        time: '16:16',
        callerName: '3Белоусов Максим Николаевич LAst',
        callStatus: 'Установлено соединение',
        phoneNumber: '+ 7 (495) 021-49-19',
        actionType: 'add',
        viewed: false,
        bottom: '',
        zIndex: 0,
      },
    ]
    setTestDataCallsCards(data)
  }
  const deleteTestDataCallsCard = (idToDelete: number): void => {
    testDataCallsCards.value = DeleteObjectFromArrayOnId(testDataCallsCards.value, [idToDelete])
  }

  return {
    callsCardsOpened,
    testDataCallsCards,
    toggleCallsCardsOpened,
    setTestDataCallsCards,
    getTestDataCallsCards,
    deleteTestDataCallsCard,
  }
})
