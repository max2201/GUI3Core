<template>
  <UiFieldDetialsModal
    :anchor-id="id"
    :title="
      props.editingContact ? 'Редактирование контактного лица' : 'Добавление контактного лица'
    "
    :is-open="isModalOpen"
    width="500px"
    @close="closeModal"
    hide-close
  >
    <div class="contact-form">
      <UiSearchableSelect
        wrapper-class="span-4"
        :value="newContactForm.contact"
        :options="contacts"
        :loading="isShowContactsLoading"
        :error="newContactForm.error"
        option-label-key="BaseObjectName"
        option-value-key="nameForSelectValue"
        select-label="Контакт"
        @on-select="onSelectContact"
        @search="onSearchContact"
        :isReadonly="editingContact"
      />

      <UiFieldInput
        wrapper-class="span-2"
        :id="id"
        :type="FieldType.Dict"
        :value="formData.Type"
        :options="getFieldOptions(FieldType.clientRelationTypes)"
        label="Кем приходится"
        @change="onChangeField('Type', $event)"
      />
      <UiSelect1
        wrapper-class="span-2"
        :model-value="newContactForm.number"
        :options="newContactForm.contactNumbers"
        :disabled="!newContactForm?.contactNumbers?.length"
        select-label="Контактный номер"
        option-label-key=""
        @update:model-value="onSelectNumber"
      />
      <UiFieldInput
        wrapper-class="span-4"
        :id="id"
        :type="FieldType.Input"
        :value="formData.AddInfo"
        label="Дополнительная информация"
        @change="onChangeField('AddInfo', $event)"
      />
    </div>

    <template #left-actions>
      <div class="modal-edit-flag__buttons">
        <p v-if="isConfirm">Подтверждаете удаление?</p>

        <UiButton1
          v-if="!isConfirm && !props.editingContact"
          class="mr-2"
          variant="outline"
          size="large"
          @click="closeModal"
        >
          Отмена
        </UiButton1>
        <UiButton1
          v-if="props.editingContact && !isConfirm"
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
            v-if="props.editingContact"
            class="mr-2"
            variant="outline"
            size="large"
            @click="closeModal"
          >
            Отмена
          </UiButton1>
          <UiButton1 size="large" :disabled="!isValid" @click="onSave"> Сохранить </UiButton1>
        </template>
        <template v-else>
          <UiButton1 variant="outline" size="large" class="mr-2" @click="handleCancelConfirm">
            Отмена
          </UiButton1>
          <UiButton1 size="large" @click="deleteContact"> Подтвердить </UiButton1>
        </template>
      </div>
    </template>
  </UiFieldDetialsModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import { FieldType } from '@/core/constants/FieldType'

import type { IExtendedClientContact, RequestNewContactsPayload } from '@/core/interface/Requests'
import { GetClientAutoCompleteList, GetClientPhones } from '@/core/api/clients.api'
import type { IClientContact } from '@/core/interface/ClientContact'

// Расширенный интерфейс для хранения данных о контактах
interface ExtendedRequestNewContactsPayload {
  contact: IClientContact | null
  number: string | null
  contactNumbers: any[]
  error: string | null
}

const props = defineProps<{
  id: string
  isOpen: boolean
  editingContact: any
  objectCollection: any[]
  clientCode?: string | number
}>()

const emit = defineEmits(['update:isOpen', 'update:collection'])

// Состояние компонента
const isModalOpen = computed(() => props.isOpen)
const editingContactPerson = ref(null)
const isConfirm = ref(false)

// Получение глобальных данных из хранилища
const configurationStore = useConfigurationStore()
const { Dictionaries } = storeToRefs(configurationStore)

// Данные для работы с контактами
const contacts = ref<IExtendedClientContact[]>([])
const isShowContactsLoading = ref(false)
const newContactForm = ref<ExtendedRequestNewContactsPayload>({
  contact: null,
  number: null,
  contactNumbers: [],
  error: null,
})

// Данные формы контактного лица
const formData = ref({
  ClientName: '',
  Type: '',
  Phone: '',
  AddInfo: '',
  ClientCode: -1,
  FirstPhone: null as any,
})

// Проверка валидности формы контактного лица
const isValid = computed(() => {
  return !!formData.value.ClientName.trim()
})

// Получение опций для поля из словаря
const getFieldOptions = (code: string) => {
  const foundDictionaries = Dictionaries.value.find((dict) => dict.Code === code)
  return foundDictionaries?.Values || []
}

// Обработчик поиска контакта
const onSearchContact = (value: string) => {
  if (value.charAt(value.length - 1) == ' ') {
    return
  }
  isShowContactsLoading.value = true
  GetClientAutoCompleteList(value)
    .then(({ data }) => {
      if (!data) return
      contacts.value = data.map((contact) => {
        return {
          ...contact,
          nameForSelectValue: contact.BaseObjectName.split(',').join(' ,') + ' ',
        }
      })
    })
    .finally(() => {
      isShowContactsLoading.value = false
    })
}

// Обработчик выбора контакта
const onSelectContact = (value: IClientContact) => {
  newContactForm.value.contact = value || null
  newContactForm.value.error = null
  if (!value) {
    newContactForm.value.number = null
    newContactForm.value.contactNumbers = []
    return
  }
  newContactForm.value.contact.Id = value.Id

  GetClientPhones(value.Id).then(({ data }) => {
    if (!data) return
    newContactForm.value.contactNumbers = [...data]
    if (newContactForm.value.contactNumbers.length) {
      newContactForm.value.number = newContactForm.value.contactNumbers[0]

      // Заполняем поля формы данными из выбранного контакта
      formData.value.ClientName = value.BaseObjectName || ''
      formData.value.ClientCode = value.Id

      // Если есть номер телефона, заполняем его
      if (newContactForm.value.number) {
        formData.value.Phone = newContactForm.value.number

        // Создаем объект FirstPhone
        formData.value.FirstPhone = {
          Comment: '----',
          DisplayPhone: newContactForm.value.number,
          IsInternational: false,
          IsMain: true,
          IsNotification: false,
          OriginalPhone: newContactForm.value.number.replace(/\D/g, ''),
          Title: 'Основной',
        }
      }
    } else {
      newContactForm.value.number = null
    }
  })
}

// Обработчик выбора номера телефона
const onSelectNumber = (val: string) => {
  newContactForm.value.number = val
}

// Обработчики изменения полей
const onChangeField = (field: string, value: string) => {
  formData.value[field] = value
}

// Функция сохранения контактного лица
const onSave = () => {
  // Формируем объект для сохранения
  const contactPersonData = {
    ClientName: formData.value.ClientName,
    Type: formData.value.Type,
    AddInfo: formData.value.AddInfo,
    ClientCode: formData.value.ClientCode,
    FirstPhone: formData.value.FirstPhone,
  }

  saveContactPerson(contactPersonData)
}

// Функция сохранения контактного лица
const saveContactPerson = (contactData: any) => {
  try {
    // Создаем копию коллекции для изменения
    const collection = [...props.objectCollection]

    // Если это новый контакт, добавляем его в коллекцию
    if (!props.editingContact) {
      collection.push(contactData)
    } else {
      // Если редактируем существующий, находим его индекс и обновляем
      const index = collection.findIndex((item) => item === props.editingContact)
      if (index !== -1) {
        collection[index] = contactData
      }
    }

    // Отправляем обновленную коллекцию родительскому компоненту
    emit('update:collection', collection)
    closeModal()
  } catch (error) {
    console.error('Ошибка при сохранении контактного лица:', error)
  }
}

// Функция закрытия модального окна
const closeModal = () => {
  // Сбрасываем значения формы и контактов
  editingContactPerson.value = null
  isConfirm.value = false

  // Очищаем форму контакта
  newContactForm.value = {
    contact: null,
    number: null,
    contactNumbers: [],
    error: null,
  }

  // Очищаем данные формы
  formData.value = {
    ClientName: '',
    Type: '',
    Phone: '',
    AddInfo: '',
    ClientCode: -1,
    FirstPhone: null,
  }

  // Закрываем модальное окно
  emit('update:isOpen', false)
}

// Функция удаления контактного лица
const deleteContact = () => {
  if (!props.editingContact) {
    console.error('Ошибка при удалении контакта: недостаточно данных')
    return
  }

  // Только если мы в режиме подтверждения
  if (!isConfirm.value) {
    console.error('Необходимо подтверждение для удаления контакта')
    return
  }

  try {
    // Удаляем из коллекции
    const collection = [...props.objectCollection]
    const index = collection.findIndex((item) => item === props.editingContact)

    if (index !== -1) {
      // Удаляем контакт из коллекции
      collection.splice(index, 1)

      // Отправляем обновленную коллекцию родительскому компоненту
      emit('update:collection', collection)
      closeModal()
    }
  } catch (error) {
    console.error('Ошибка при удалении контактного лица:', error)
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
  // Установка кода клиента из props, если он передан
  const clientCode = props.clientCode ? String(props.clientCode) : ''

  if (props.editingContact) {
    // Заполняем форму данными контакта
    formData.value = {
      ClientName: props.editingContact.ClientName || '',
      Type: props.editingContact.Type || '',
      Phone: props.editingContact.FirstPhone?.DisplayPhone || '',
      AddInfo: props.editingContact.AddInfo || '',
      ClientCode: props.editingContact.ClientCode || -1,
      FirstPhone: props.editingContact.FirstPhone || null,
    }

    // Попробуем найти контакт в списке существующих по ClientCode или имени
    if (props.editingContact.ClientCode && props.editingContact.ClientCode > 0) {
      // Загрузим информацию о клиенте для заполнения данных
      isShowContactsLoading.value = true
      GetClientAutoCompleteList(props.editingContact.ClientName)
        .then(({ data }) => {
          if (!data) return

          // Находим контакт по коду
          const matchingContact = data.find((c) => c.Id === props.editingContact.ClientCode)
          if (matchingContact) {
            contacts.value = data.map((c) => ({
              ...c,
              nameForSelectValue: c.BaseObjectName.split(',').join(' ,') + ' ',
            }))

            // Устанавливаем выбранный контакт
            newContactForm.value.contact = {
              Id: matchingContact.Id,
              BaseObjectType: matchingContact.BaseObjectType,
              BaseObjectName: matchingContact.BaseObjectName,
              BaseObjectDate: matchingContact.BaseObjectDate,
            }

            // Загружаем телефоны для этого контакта
            GetClientPhones(props.editingContact.ClientCode).then(({ data: phonesData }) => {
              if (!phonesData) return
              newContactForm.value.contactNumbers = [...phonesData]

              // Если у нас есть FirstPhone, найдем соответствующий номер
              if (props.editingContact.FirstPhone) {
                const matchingPhone = phonesData.find(
                  (p) =>
                    p === props.editingContact.FirstPhone.DisplayPhone ||
                    p === props.editingContact.FirstPhone.OriginalPhone,
                )
                if (matchingPhone) {
                  newContactForm.value.number = matchingPhone
                } else if (phonesData.length > 0) {
                  newContactForm.value.number = phonesData[0]
                }
              } else if (phonesData.length > 0) {
                // Если нет, выбираем первый доступный
                newContactForm.value.number = phonesData[0]
              }
            })
          }
        })
        .finally(() => {
          isShowContactsLoading.value = false
        })
    }

    editingContactPerson.value = props.editingContact
  } else {
    // Режим добавления - сбрасываем форму
    formData.value = {
      ClientName: '',
      Type: '',
      Phone: '',
      AddInfo: '',
      ClientCode: clientCode ? parseInt(clientCode) : -1,
      FirstPhone: null,
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
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.span-2 {
  grid-column: span 2;
}

.span-4 {
  grid-column: span 4;
}

.mr-2 {
  margin-right: 8px;
}
</style>
