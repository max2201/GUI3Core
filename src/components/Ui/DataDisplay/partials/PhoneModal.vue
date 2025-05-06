<template>
  <UiFieldDetialsModal
    :title="props.editingPhone ? 'Редактирование телефона' : 'Добавление телефона'"
    :is-open="isModalOpen"
    width="500px"
    @close="closeModal"
    hide-close
    :anchorId="id"
  >
    <div class="phone-form">
      <UiFieldInput
        wrapper-class="span-4"
        :id="id"
        :type="FieldType.Input"
        :value="formData.Title"
        label="Название"
        @change="onChangeField('Title', $event)"
      />
      <UiFieldInput
        wrapper-class="span-4"
        id="DisplayPhone"
        name="DisplayPhone"
        :type="FieldType.Phone"
        :value="formData.DisplayPhone"
        @valid-state="validState(FieldType.Phone)"
        @invalid-state="invalidState(FieldType.Phone)"
        label="Номер телефона"
        :format="formData.IsInternational ? 'full' : 'short'"
        @change="onChangeField('DisplayPhone', $event)"
      />
      <UiFieldInput
        wrapper-class="span-4"
        :id="id"
        :type="FieldType.Input"
        :value="formData.Comment"
        label="Комментарий"
        @change="onChangeField('Comment', $event)"
      />
      <UiFieldInputWrapper class="span-2">
        <UiCheckbox1 v-model="formData.IsMain">Основной номер</UiCheckbox1>
      </UiFieldInputWrapper>
      <UiFieldInputWrapper class="span-2">
        <UiCheckbox1 v-model="formData.IsNotification">Для уведомлений</UiCheckbox1>
      </UiFieldInputWrapper>
      <UiFieldInputWrapper class="span-2">
        <UiCheckbox1 v-model="formData.IsInternational">Международный</UiCheckbox1>
      </UiFieldInputWrapper>
    </div>

    <template #left-actions>
      <div class="modal-edit-flag__buttons">
        <p v-if="isConfirm">Подтверждаете удаление?</p>

        <UiButton1
          v-if="!isConfirm && !props.editingPhone"
          class="mr-2"
          variant="outline"
          size="large"
          @click="closeModal"
        >
          Отмена
        </UiButton1>
        <UiButton1
          v-if="props.editingPhone && !isConfirm"
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
            v-if="props.editingPhone"
            class="mr-2"
            variant="outline"
            size="large"
            @click="closeModal"
          >
            Отмена
          </UiButton1>
          <UiButton1
            size="large"
            :disabled="Boolean(invalidFields.length) || !formData.OriginalPhone.length"
            @click="handlerSave"
            :loading="isShowSaveLoading"
          >
            Сохранить
          </UiButton1>
        </template>
        <template v-else>
          <UiButton1 variant="outline" size="large" class="mr-2" @click="handleCancelConfirm">
            Отмена
          </UiButton1>
          <UiButton1 size="large" @click="deletePhone"> Подтвердить </UiButton1>
        </template>
      </div>
    </template>
  </UiFieldDetialsModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { FieldType } from '@/core/constants/FieldType'
import { formatPhoneNumber } from '@/core/utils/phoneFormat'
import { CheckSamePhoneClients, GetClientAutoCompleteList } from '@/core/api/clients.api'
import { ModalTableModal } from '@/core/constants/ModalsNames'

// Определение пропсов компонента
const props = defineProps<{
  id: string
  isOpen: boolean
  editingPhone: any
  objectCollection: any[]
}>()

// Определение событий, исходящих от компонента
const emit = defineEmits(['update:isOpen', 'update:collection'])

// Состояние компонента
const isModalOpen = computed(() => props.isOpen)
const editingPhoneItem = ref(null)
const isConfirm = ref(false)

// Данные формы телефона
const formData = ref({
  DisplayPhone: '',
  Comment: '',
  IsMain: false,
  IsNotification: false,
  IsInternational: false,
  OriginalPhone: '',
  Title: '',
  id: '',
})

const invalidFields = ref([])
const validState = (code: string) => {
  const sameFieldIndex = invalidFields.value.findIndex((item) => item.code === code)

  if (sameFieldIndex !== -1) {
    invalidFields.value.splice(sameFieldIndex, 1)
  }
}
const invalidState = (code: string) => {
  const sameFieldIndex = invalidFields.value.findIndex((item) => item.code === code)

  if (sameFieldIndex === -1) {
    invalidFields.value.push({
      code: code,
      reason: '',
    })
  }
}
// Обработчики изменения полей
const onChangeField = (field: string, value: any) => {
  // Для поля DisplayPhone применяем форматирование
  if (field === 'DisplayPhone') {
    // Используем утилиты для форматирования
    formData.value.DisplayPhone = formData.value.IsInternational
      ? formatPhoneNumber(value)
      : formatShortPhoneNumber(value)
    // Сохраняем оригинальный номер без форматирования
    formData.value.OriginalPhone = getOriginalPhone(value)
    return
  }

  // Для остальных полей просто присваиваем значение
  formData.value[field] = value
}
const sharedModals = useSharedModalsStore()
const isShowSaveLoading = ref(false)
// Сохранение телефона
const handlerSave = async () => {
  isShowSaveLoading.value = true
  try {
    // Формируем объект для сохранения
    const phoneData = { ...formData.value }
    CheckSamePhoneClients(phoneData)
      .then(async ({ data }) => {
        if (!data) return
        if (data.ClientsTable) {
          const conflictTable = await sharedModals.showActionModal({
            name: ModalTableModal,
            params: {
              type: 'conflict-number',
              title: 'Разрешение конфликтов',
              description: 'Указанный номер телефона уже содержаться у следующих клиентов',
              data: data.ClientsTable,
              isActions: true,
            },
          })
          if (conflictTable) {
            console.log(conflictTable)
            if (conflictTable !== true) {
              isShowSaveLoading.value = false
              // await openObject(conflictTable[0], true)
              return
            } else {
              console.log('save-client')
              await onSave(phoneData)
              isShowSaveLoading.value = false
            }
          } else {
            console.log(conflictTable)
            closeModal()
            isShowSaveLoading.value = false
          }
        } else {
          console.log('no-conflict')
          await onSave(phoneData)
        }
      })
      .finally(() => {
        isShowSaveLoading.value = false
      })
  } catch (error) {
    console.error('Ошибка при сохранении телефона:', error)
  }
}
const onSave = async (phoneData) => {
  isShowSaveLoading.value = true
  try {
    // Генерируем стабильный ID на основе номера телефона, если его нет
    if (!phoneData.id) {
      // Используем оригинальный номер для генерации ID, если он есть
      phoneData.id = `phone_${phoneData.OriginalPhone || getOriginalPhone(phoneData.DisplayPhone)}`
    }

    // Создаем копию коллекции для изменения
    const collection = [...props.objectCollection]

    // Если это новый телефон, добавляем его в коллекцию
    if (!props.editingPhone) {
      collection.push(phoneData)
    } else {
      // Если редактируем существующий, находим его индекс и обновляем
      const index = collection.findIndex((item) => {
        if (props.editingPhone.id && item.id) {
          return item.id === props.editingPhone.id
        }
        return item.DisplayPhone === props.editingPhone.DisplayPhone
      })

      if (index !== -1) {
        collection[index] = phoneData
      } else {
        console.warn('Телефон для обновления не найден, добавляем как новый')
        collection.push(phoneData)
      }
    }

    // Если текущий телефон отмечен как основной, убираем этот флаг у других
    if (phoneData.IsMain) {
      collection.forEach((item, idx) => {
        // Используем id для сравнения вместо прямого сравнения объектов
        if (item.id !== phoneData.id && item.IsMain) {
          collection[idx].IsMain = false
        }
      })
    }
    if (phoneData.IsNotification) {
      collection.forEach((item, idx) => {
        // Используем id для сравнения вместо прямого сравнения объектов
        if (item.id !== phoneData.id && item.IsNotification) {
          collection[idx].IsNotification = false
        }
      })
    }
    // Отправляем обновленную коллекцию родительскому компоненту
    emit('update:collection', collection)
    closeModal()
  } catch (error) {
    console.error('Ошибка при сохранении телефона:', error)
  }
}
// Функция закрытия модального окна
const closeModal = () => {
  // Сбрасываем значения формы
  editingPhoneItem.value = null
  isConfirm.value = false

  // Очищаем данные формы
  formData.value = {
    DisplayPhone: '',
    Comment: '',
    IsMain: false,
    IsNotification: false,
    IsInternational: false,
    OriginalPhone: '',
    Title: '',
    id: '',
  }

  // Закрываем модальное окно
  emit('update:isOpen', false)
}

// Функция удаления телефона
const deletePhone = () => {
  if (!props.editingPhone) {
    console.error('Ошибка при удалении телефона: недостаточно данных')
    return
  }

  // Только если мы в режиме подтверждения
  if (!isConfirm.value) {
    return
  }

  try {
    // Удаляем из коллекции
    const collection = [...props.objectCollection]

    // Ищем телефон по id или номеру телефона вместо прямого сравнения объектов
    const index = collection.findIndex((item) => {
      if (props.editingPhone.id && item.id) {
        return item.id === props.editingPhone.id
      }
      return item.DisplayPhone === props.editingPhone.DisplayPhone
    })

    if (index !== -1) {
      // Удаляем телефон из коллекции
      collection.splice(index, 1)

      // Отправляем обновленную коллекцию родительскому компоненту
      emit('update:collection', collection)
      closeModal()
    } else {
      console.error('Телефон для удаления не найден в коллекции')
    }
  } catch (error) {
    console.error('Ошибка при удалении телефона:', error)
  }
}

// Вспомогательные функции управления модальным окном для подтверждения
const handleDelete = () => {
  isConfirm.value = true
}

const handleCancelConfirm = () => {
  isConfirm.value = false
}

// Инициализация режима редактирования
const initEditMode = () => {
  if (props.editingPhone) {
    // Заполняем форму данными телефона
    formData.value = {
      DisplayPhone: props.editingPhone.DisplayPhone || '',
      Comment: props.editingPhone.Comment || '',
      IsMain: props.editingPhone.IsMain || false,
      IsNotification: props.editingPhone.IsNotification || false,
      IsInternational: props.editingPhone.IsInternational || false,
      OriginalPhone:
        props.editingPhone.OriginalPhone || getOriginalPhone(props.editingPhone.DisplayPhone) || '',
      Title: props.editingPhone.Title || '',
      id: props.editingPhone.id || '',
    }

    editingPhoneItem.value = props.editingPhone
  } else {
    // Режим добавления - инициализируем форму пустыми значениями
    formData.value = {
      DisplayPhone: '',
      Comment: '',
      IsMain: false,
      IsNotification: false,
      IsInternational: false,
      OriginalPhone: '',
      Title: '',
      id: '',
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

// Отслеживаем изменение флага IsInternational для обновления отображаемого номера
watch(
  () => formData.value.IsInternational,
  (newValue) => {
    if (formData.value.OriginalPhone) {
      // Форматируем телефон в зависимости от нового формата
      formData.value.DisplayPhone = newValue
        ? formatPhoneNumber(formData.value.OriginalPhone)
        : formatShortPhoneNumber(formData.value.OriginalPhone)
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
.phone-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
}

.span-2 {
  grid-column: span 2;
}

.span-4 {
  grid-column: span 4;
}
</style>
