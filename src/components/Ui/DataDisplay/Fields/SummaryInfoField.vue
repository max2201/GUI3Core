<template>
  <div class="summary-info-field">
    <div class="summary-info-field__color" />
    <div class="summary-info-field__content">
      <span :title="field.Title" class="summary-info-field__title">{{ field.Title }}</span>
      <div class="summary-info-field__value-block">
        <span :title="field.Value" class="summary-info-field__value">{{ field.Value }}</span>
        <div v-if="field.Detailing" :title="field.Detailing" class="summary-info-field__detailing">
          {{ field.Detailing }}
        </div>
      </div>
      <VDropdown
        container=".summary-info-field"
        :distance="5"
        :shown="isCommandDropdownOpen"
        :autoHide="true"
        placement="bottom-start"
      >
        <UiButton
          v-if="command"
          @click="handleCommand"
          class="summary-info-field__command"
          theme="link-underline"
          >{{ command.Title }}
        </UiButton>

        <template v-if="commandData" #popper>
          <div class="summary-info-field__command-dropdown">
            <div class="summary-info-field__command-dropdown-title">
              {{ commandData?.WindowTitle }}
            </div>
            <div class="summary-info-field__command-dropdown-content">Какой-то контент</div>
          </div>
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  field: LiteViewBlockField
}>()

const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field!.SystemColor as SystemColorsValue)
  return {
    color: currentColor?.primary || '',
    detailingText: currentColor?.primary || '',
    detailingBg: currentColor?.secondary || '',
    value: props.field?.Detailing ? '#23282F' : currentColor?.primary,
  }
})

const { executeCommand } = useCommand()
const toast = useToast()

const command = computed(() => {
  return props.field?.Command || null
})

const commandData = ref(null)
const isCommandDropdownOpen = ref(false)

const handleCommand = async () => {
  await executeCommand(command.value, {
    onSuccess: (data) => {
      isCommandDropdownOpen.value = true
      commandData.value = data
      console.log('Команда выполнена успешно:', data)
    },
    onError: (error) => {
      toast.error(`Ошибка при выполнении команды ${error}`)
      console.error('Ошибка при выполнении команды:', error)
    },
  })
}
</script>

<style scoped lang="scss">
.summary-info-field {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  overflow: hidden;

  &__color {
    margin-top: 2px;
    width: 12px;
    height: 12px;
    background: v-bind('fieldColors.color');
    border-radius: 3px;
    flex-shrink: 0;
  }

  &__content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #8990a2;
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
  }

  &__value-block {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  &__value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: Inter;
    font-size: 24px;
    font-weight: 500;
    line-height: 31.2px;
    color: v-bind('fieldColors.value');
  }

  &__detailing {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: v-bind('fieldColors.detailingText');
    background: v-bind('fieldColors.detailingBg');
    font-family: Inter;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    padding: 0 7px;
    border-radius: 40px;
    border: 1px solid v-bind('fieldColors.detailingBg');
  }

  &__command {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 15.4px;
    color: #23282f;
    padding: 6px 0 0;

    //TODO: Пока что хардкод - заменить или удалить в будущем
    &-dropdown {
      overflow: hidden;

      &-title {
        padding: 10px;
        background: lightgray;
      }

      &-content {
        padding: 10px;
      }
    }
  }
}
</style>
