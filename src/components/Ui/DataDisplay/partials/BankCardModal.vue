<template>
  <UiFieldDetialsModal
    :anchor-id="id"
    :title="props.editingCard ? 'Редактирование банковской карты' : 'Добавление банковской карты'"
    :is-open="isModalOpen"
    width="500px"
    @close="closeModal"
    hide-close
  >
    <div class="card-form">
      <UiFieldInput
        wrapper-class="span-2"
        :id="id"
        :type="FieldType.Dict"
        :value="formData.DisplayCardType"
        :options="cardTypeOptions"
        label="Тип карты"
        @change="onChangeField('DisplayCardType', $event)"
      />
      <UiFieldInput
        wrapper-class="span-2"
        :id="id"
        :type="FieldType.Input"
        :value="formData.DisplayNumber"
        label="Номер карты"
        placeholder="XXXX XXXX XXXX XXXX"
        @change="onChangeField('DisplayNumber', $event)"
      />

      <UiFieldInput
        wrapper-class="span-2"
        :id="id"
        :type="FieldType.Input"
        :value="formattedValidDate"
        label="Срок действия"
        placeholder="ММ/ГГ"
        @change="onChangeField('ValidDate', $event)"
      />

      <UiFieldInput
        wrapper-class="span-2"
        :id="id"
        :type="FieldType.Input"
        :value="formData.BankName"
        label="Название банка"
        @change="onChangeField('BankName', $event)"
      />
      <UiFieldInput
        wrapper-class="span-4"
        :id="id"
        :type="FieldType.Input"
        :value="formData.ClientName"
        label="Держатель"
        @change="onChangeField('ClientName', $event)"
      />
      <UiFieldInputWrapper class="span-2">
        <UiCheckbox1 v-model="formData.IsMainCard">Основная карта</UiCheckbox1>
      </UiFieldInputWrapper>
      <UiFieldInputWrapper class="span-2">
        <UiCheckbox1 v-model="formData.IsNotUsing">Не используется</UiCheckbox1>
      </UiFieldInputWrapper>
    </div>

    <template #left-actions>
      <div class="modal-edit-flag__buttons">
        <p v-if="isConfirm">Подтверждаете удаление?</p>

        <UiButton1
          v-if="!isConfirm && !props.editingCard"
          class="mr-2"
          variant="outline"
          size="large"
          @click="closeModal"
        >
          Отмена
        </UiButton1>
        <UiButton1
          v-if="props.editingCard && !isConfirm"
          variant="outline"
          theme="danger"
          size="large"
          @click="handleDelete"
        >
          Удалить
        </UiButton1>
      </div>
    </template>

    <template #actions>
      <div class="ui-field-detials-modal__actions-side">
        <template v-if="!isConfirm">
          <UiButton1
            v-if="props.editingCard"
            class="mr-2"
            variant="outline"
            size="large"
            @click="closeModal"
          >
            Отмена
          </UiButton1>
          <UiButton1 size="large" @click="onSave"> Сохранить </UiButton1>
        </template>
        <template v-else>
          <UiButton1 variant="outline" size="large" class="mr-2" @click="handleCancelConfirm">
            Отмена
          </UiButton1>
          <UiButton1 size="large" @click="deleteCard"> Подтвердить </UiButton1>
        </template>
      </div>
    </template>
  </UiFieldDetialsModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { FieldType } from '@/core/constants/FieldType'

// Определение пропсов компонента
const props = defineProps<{
  id: string
  isOpen: boolean
  editingCard: any
  objectCollection: any[]
}>()

// Определение событий, исходящих от компонента
const emit = defineEmits(['update:isOpen', 'update:collection'])

// Состояние компонента
const isModalOpen = computed(() => props.isOpen)
const editingBankCard = ref(null)
const isConfirm = ref(false)

// Получение глобальных данных из хранилища
const configurationStore = useConfigurationStore()
const { Dictionaries } = storeToRefs(configurationStore)
const { EnumDictionaries } = storeToRefs(configurationStore)

// Отслеживаем изменения в словарях
watch(
  () => EnumDictionaries.value,
  (newVal) => {
    if (newVal && newVal.CardType) {
    }
  },
  { immediate: true, deep: true },
)

// Данные формы банковской карты
const formData = ref({
  BankName: '',
  CardType: 0,
  ClearingNumber: '',
  ClientName: '',
  DisplayCardType: '',
  DisplayNumber: '',
  IsMainCard: false,
  IsNotUsing: false,
  ValidDate: '',
  DisplayValidDate: '',
})

// Вычисляемое свойство для отображения даты
const formattedValidDate = computed(() => {
  return formData.value.DisplayValidDate || formatCardDate(formData.value.ValidDate)
})

// Тип для элемента списка банковских карт
interface CardTypeOption {
  Index: number
  Title: string
  Code: string
}

// Преобразование объекта словаря в массив для компонента
const createCardTypeOptions = (dictionary: any): CardTypeOption[] => {
  if (!dictionary) return []

  return Object.entries(dictionary).map(([key, value]) => ({
    Index: parseInt(key),
    Title: value as string,
    Code: value as string,
  }))
}

// Получение списка банков из словаря - как вычисляемое свойство
const cardTypeOptions = computed((): CardTypeOption[] => {
  if (!EnumDictionaries.value || !EnumDictionaries.value.CardType) {
    return []
  }
  const options = createCardTypeOptions(EnumDictionaries.value.CardType)
  return options
})

// Форматирование номера карты
const formatCardNumber = (value: string, cardType: string): string => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, '')

  // Ограничиваем длину номера карты в зависимости от типа карты
  let maxLength = 16 // По умолчанию для большинства карт (Visa, MasterCard)

  // Особые случаи для разных типов карт
  if (cardType === 'American Express') {
    maxLength = 15 // American Express имеет 15 цифр
  } else if (cardType === 'Мир') {
    maxLength = 16 // У карт Мир стандартно 16 цифр
  }

  // Берем только допустимое количество цифр
  const limitedDigits = digits.substring(0, maxLength)

  // Сохраняем очищенный номер в ClearingNumber
  formData.value.ClearingNumber = limitedDigits

  // Форматируем номер карты с пробелами
  let formattedValue = ''

  // Если это American Express, формат: XXXX XXXXXX XXXXX (4-6-5)
  if (cardType === 'American Express') {
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i === 4 || i === 10) {
        formattedValue += ' '
      }
      formattedValue += limitedDigits[i]
    }
  }
  // Для всех остальных карт - XXXX XXXX XXXX XXXX (4-4-4-4)
  else {
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' '
      }
      formattedValue += limitedDigits[i]
    }
  }

  return formattedValue
}

// Валидация срока действия карты
const formatValidDate = (value: string) => {
  // Удаляем все нецифровые символы
  let digits = value.replace(/\D/g, '')

  // Ограничиваем до 4 цифр для отображения MM/YY
  digits = digits.substring(0, 4)

  // Форматируем как MM/YY для отображения
  let displayValue = ''
  if (digits.length > 0) {
    if (digits.length <= 2) {
      // Только месяц
      // Проверка валидности месяца (1-12)
      const month = parseInt(digits)
      if (month > 12) {
        digits = '12'
      } else if (month === 0 && digits.length === 2) {
        digits = '01'
      }
      displayValue = digits

      // Возвращаем частичное значение для дальнейшего ввода
      return {
        value: displayValue,
        displayValue,
        shouldExit: true,
      }
    } else {
      // Месяц и год
      const month = digits.substring(0, 2)
      const year = digits.substring(2)

      // Проверка валидности месяца (1-12)
      const monthNum = parseInt(month)
      let formattedMonth = month
      if (monthNum > 12) {
        formattedMonth = '12'
      } else if (monthNum === 0) {
        formattedMonth = '01'
      }

      displayValue = `${formattedMonth}/${year}`

      // Для хранения создаем полную дату (последний день месяца текущего столетия)
      const fullYear = 2000 + parseInt(year)
      const lastDayOfMonth = new Date(fullYear, parseInt(formattedMonth), 0).getDate()

      // Сохраняем в российском формате дату
      const russianDate = `01.${formattedMonth.padStart(2, '0')}.${fullYear} 00:00:00`

      return {
        value: russianDate,
        displayValue,
        shouldExit: false,
      }
    }
  }

  return null
}

/**
 * Форматирует дату из разных форматов в MM/YY
 */
const formatCardDate = (dateValue: string): string => {
  if (!dateValue) return ''

  // Если дата уже в формате MM/YY, возвращаем как есть
  if (dateValue.match(/^\d{1,2}\/\d{2}$/)) {
    return dateValue
  }

  // Попытка распарсить дату в формате DD.MM.YYYY или ISO
  try {
    // Обработка формата DD.MM.YYYY HH:MM:SS (например, 01.01.2025 00:00:00)
    if (dateValue.includes('.')) {
      const parts = dateValue.split(' ')[0].split('.')
      if (parts.length === 3) {
        const day = parts[0]
        const month = parts[1].replace(/^0/, '') // убираем ведущий ноль
        const year = parts[2].substring(2) // берем только последние 2 цифры года
        return `${month}/${year}`
      }
    }

    // Обработка ISO формата YYYY-MM-DD
    else if (dateValue.includes('-')) {
      const dateParts = dateValue.split('-')
      if (dateParts.length === 3) {
        const year = dateParts[0].substring(2) // берем только последние 2 цифры года
        const month = dateParts[1].replace(/^0/, '') // убираем ведущий ноль, если есть
        return `${month}/${year}`
      }
    }
  } catch (e) {
    console.error('Ошибка при форматировании даты карты:', e)
  }

  return dateValue
}

// Обработчики изменения полей
const onChangeField = (field: string, value: any) => {
  console.log(`Изменение поля ${field}:`, value)

  // Для поля DisplayCardType найдем соответствующий CardType
  if (field === 'DisplayCardType') {
    // Проверяем разные форматы значения

    // Случай 1: value - это объект с полями Index и Title (основной случай)
    if (value && typeof value === 'object' && 'Index' in value && 'Title' in value) {
      formData.value.CardType = value.Index
      formData.value.DisplayCardType = value.Title

      // При изменении типа карты может потребоваться переформатировать номер
      if (formData.value.DisplayNumber) {
        formData.value.DisplayNumber = formatCardNumber(formData.value.DisplayNumber, value.Title)
      }
      return
    }
    // Случай 2: value - это числовое значение (id типа карты)
    else if (typeof value === 'number' || !isNaN(parseInt(value))) {
      const numericValue = typeof value === 'number' ? value : parseInt(value)
      const cardType = findCardTypeById(numericValue)

      if (cardType) {
        formData.value.CardType = cardType.Index
        formData.value.DisplayCardType = cardType.Title

        // При изменении типа карты может потребоваться переформатировать номер
        if (formData.value.DisplayNumber) {
          formData.value.DisplayNumber = formatCardNumber(
            formData.value.DisplayNumber,
            cardType.Title,
          )
        }
        return
      }
    }
    // Случай 3: value - это строковое значение (название типа карты)
    else if (typeof value === 'string' && value.trim() !== '') {
      const cardType = findCardTypeByTitle(value)

      if (cardType) {
        console.log(`Выбран тип карты (строка): ${cardType.Title} (${cardType.Index})`)
        formData.value.CardType = cardType.Index
        formData.value.DisplayCardType = cardType.Title

        // При изменении типа карты может потребоваться переформатировать номер
        if (formData.value.DisplayNumber) {
          formData.value.DisplayNumber = formatCardNumber(
            formData.value.DisplayNumber,
            cardType.Title,
          )
        }
        return
      }
    }

    console.warn('Получено некорректное значение для типа карты:', value)
    return
  }

  // Для поля DisplayNumber применяем маску XXXX XXXX XXXX XXXX
  if (field === 'DisplayNumber') {
    formData.value.DisplayNumber = formatCardNumber(value, formData.value.DisplayCardType)
    return
  }

  // Для поля ValidDate применяем маску MM/YY, но храним полную дату
  if (field === 'ValidDate') {
    const result = formatValidDate(value)
    if (result) {
      if (result.shouldExit) {
        formData.value.DisplayValidDate = result.displayValue || ''
        return
      }
      formData.value.ValidDate = result.value
      formData.value.DisplayValidDate = result.displayValue || ''
      return
    }
  }

  // Для остальных полей просто присваиваем значение
  formData.value[field] = value
}

// Сохранение банковской карты
const onSave = () => {
  try {
    // Формируем объект для сохранения
    const cardData = { ...formData.value }
    // Создаем копию коллекции для изменения
    const collection = [...props.objectCollection]

    // Если это новая карта, добавляем её в коллекцию
    if (!props.editingCard) {
      collection.push(cardData)
    } else {
      // Если редактируем существующую, находим её индекс и обновляем
      const index = collection.findIndex((item) => item === props.editingCard)
      if (index !== -1) {
        collection[index] = cardData
      } else {
        collection.push(cardData)
      }
    }
    // Если текущий телефон отмечен как основной, убираем этот флаг у других
    if (cardData.IsMainCard) {
      collection.forEach((item, idx) => {
        // Используем id для сравнения вместо прямого сравнения объектов
        if (item.ClearingNumber !== cardData.ClearingNumber && item.IsMainCard) {
          collection[idx].IsMainCard = false
        }
      })
    }
    // Отправляем обновленную коллекцию родительскому компоненту
    emit('update:collection', collection)
    closeModal()
  } catch (error) {
    console.error('Ошибка при сохранении банковской карты:', error)
  }
}

// Функция закрытия модального окна
const closeModal = () => {
  // Сбрасываем значения формы
  editingBankCard.value = null
  isConfirm.value = false

  // Очищаем данные формы
  formData.value = {
    BankName: '',
    CardType: 0,
    ClearingNumber: '',
    ClientName: '',
    DisplayCardType: '',
    DisplayNumber: '',
    IsMainCard: false,
    IsNotUsing: false,
    ValidDate: '01.01.1900 00:00:00',
    DisplayValidDate: '',
  }

  // Закрываем модальное окно
  emit('update:isOpen', false)
}

// Функция удаления банковской карты
const deleteCard = () => {
  if (!props.editingCard) {
    console.error('Ошибка при удалении карты: недостаточно данных')
    return
  }

  // Только если мы в режиме подтверждения
  if (!isConfirm.value) {
    return
  }

  try {
    // Удаляем из коллекции
    const collection = [...props.objectCollection]
    const index = collection.findIndex((item) => item === props.editingCard)

    if (index !== -1) {
      // Удаляем карту из коллекции
      collection.splice(index, 1)

      // Отправляем обновленную коллекцию родительскому компоненту
      emit('update:collection', collection)
      closeModal()
    }
  } catch (error) {
    console.error('Ошибка при удалении банковской карты:', error)
  }
}

// Вспомогательные функции управления модальным окном для подтверждения
const handleDelete = () => {
  isConfirm.value = true
}

const handleCancelConfirm = () => {
  isConfirm.value = false
}

// Находим тип карты по значению Index
const findCardTypeById = (id: number): CardTypeOption | undefined => {
  if (!id) return undefined
  const result = cardTypeOptions.value.find((type) => type.Index === id)
  return result
}

// Находим тип карты по названию Title
const findCardTypeByTitle = (title: string): CardTypeOption | undefined => {
  if (!title) return undefined
  const result = cardTypeOptions.value.find((type) => type.Title === title)
  return result
}

// Инициализация режима редактирования
const initEditMode = () => {
  if (props.editingCard) {
    // Определяем тип карты по числовому значению или дисплейному значению
    let cardType = findCardTypeById(props.editingCard.CardType)

    // Если не нашли по ID, попробуем найти по отображаемому имени
    if (!cardType && props.editingCard.DisplayCardType) {
      cardType = findCardTypeByTitle(props.editingCard.DisplayCardType)
    }

    // Если все равно не нашли, используем первый тип по умолчанию
    if (!cardType) {
      cardType =
        cardTypeOptions.value.length > 0
          ? cardTypeOptions.value[0]
          : { Index: 0, Title: '', Code: '0' }
    }

    // Подготавливаем значения для формы
    const cardTypeValue = cardType.Index
    const displayCardType = cardType.Title

    // Форматируем дату для отображения
    const formattedDate = formatCardDate(props.editingCard.ValidDate || '')

    // Заполняем форму данными карты
    formData.value = {
      BankName: props.editingCard.BankName || '',
      CardType: cardTypeValue,
      ClearingNumber: props.editingCard.ClearingNumber || '',
      ClientName: props.editingCard.ClientName || '',
      DisplayCardType: displayCardType,
      DisplayNumber: props.editingCard.DisplayNumber || '',
      IsMainCard: props.editingCard.IsMainCard || false,
      IsNotUsing: props.editingCard.IsNotUsing || false,
      ValidDate: props.editingCard.ValidDate || '',
      DisplayValidDate: formattedDate,
    }

    editingBankCard.value = props.editingCard
  } else {
    // Режим добавления - инициализируем форму первым типом из доступных
    const defaultType: CardTypeOption =
      cardTypeOptions.value.length > 0
        ? cardTypeOptions.value[0]
        : { Index: 0, Title: '', Code: '0' }

    formData.value = {
      BankName: '',
      CardType: defaultType.Index,
      ClearingNumber: '',
      ClientName: '',
      DisplayCardType: defaultType.Title,
      DisplayNumber: '',
      IsMainCard: false,
      IsNotUsing: false,
      ValidDate: '01.01.1900 00:00:00',
      DisplayValidDate: '',
    }
  }
}

// Обновление данных при изменении входных параметров
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      initEditMode()
    }
  },
)

// Инициализация при открытии компонента
onMounted(() => {
  if (props.isOpen) {
    initEditMode()
  }
})
</script>

<style lang="scss" scoped>
.card-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
}
</style>
