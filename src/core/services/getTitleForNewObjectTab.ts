import { BaseObjectType } from '@/core/constants/BaseObjectType'

const titleNameByType = {
  1: 'Новая заявка',
  4: 'Новый клиент',
}

export const getTitleForNewObjectTab = (type: BaseObjectType) => {
  return titleNameByType[type] || 'Новый объект'
}
