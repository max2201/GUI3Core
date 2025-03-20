<template>
  <div ref="commentField" class="comment-field" :class="{ 'comment-field--compact': compact }">
    <div v-if="field?.Title" class="comment-field__header">
      <span class="comment-field__title">{{ field.Title }}</span>

      <VDropdown
        :skidding="8"
        v-if="editable && !isCommentEditing"
        class="comment-field__edit-button"
        placement="bottom-end"
        :distance="6"
        :container="commentField"
      >
        <slot name="editable-icon">
          <UiButton1
            :icon-size="20"
            icon-left="lock-wide"
            variant="text"
            theme="success"
          ></UiButton1>
        </slot>
        <template #popper>
          <slot name="editable-popper-content">
            <div class="comment-field__edit-popper">
              <template v-if="parsedDetailing">
                <div class="comment-field__edit-popper-content">
                  <span class="comment-field__edit-popper-content-title">Изменён</span>
                  <div class="comment-field__edit-popper-content-info">
                    <span>{{ parsedDetailing.date }}</span>
                    <span>{{ parsedDetailing.user }}</span>
                  </div>
                </div>
                <hr class="comment-field__edit-popper-divider" />
              </template>
              <div class="comment-field__edit-popper-footer">
                <UiButton1
                  class="comment-field__edit-popper-action"
                  variant="text"
                  theme="transparent"
                  icon-left="unlock-wide"
                  :icon-size="24"
                  @click="editCommentSwitch"
                  >Разблокировать
                </UiButton1>
              </div>
            </div>
          </slot>
        </template>
      </VDropdown>
    </div>
    <div class="comment-field__content" v-if="field?.Value || isCommentEditing">
      <UiInput1
        v-if="isCommentEditing"
        type="textarea"
        focus-on-mount
        :loading="isLoading"
        v-model="localValue"
      />
      <span v-else class="comment-field__value">{{ localValue }}</span>
    </div>
    <div class="comment-field__footer" v-if="isCommentEditing">
      <span class="comment-field__last-changed-info" v-if="field.Detailing">{{
        field.Detailing
      }}</span>
      <div class="comment-field__edit-actions" v-if="isCommentEditing">
        <UiButton1
          class="comment-field__edit-actions-button"
          icon-left="close"
          :icon-size="24"
          size="small"
          variant="outline"
          theme="transparent"
          @click="editCommentSwitch"
        ></UiButton1>
        <UiButton1
          class="comment-field__edit-actions-button"
          :class="{ 'comment-field__edit-actions-button--hidden': isCommentNotChanged }"
          icon-left="checkmark"
          :icon-size="24"
          size="small"
          variant="outline"
          theme="transparent"
          @click="editCommentSave"
        ></UiButton1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiteViewBlockField } from '@/core/interface/Object'
import { SystemColorsValue } from '@/core/constants/SystemColors'

const commentField = ref(null)
const props = defineProps<{
  field: LiteViewBlockField
  initialValue?: string
  editable?: boolean
  isLoading?: boolean
  compact?: boolean
}>()

const emits = defineEmits(['update-comment', 'input-comment', 'update:isEditing'])

const fieldColors = computed(() => {
  const currentColor = getSystemColor(props.field!.SystemColor as SystemColorsValue)
  return {
    background: isCommentEditing.value ? '' : currentColor?.secondary || '',
  }
})

const localValue = computed({
  get() {
    return props.field?.Value
  },
  set(newValue) {
    emits('input-comment', newValue)
  },
})

const parsedDetailing = computed(() => {
  if (props.field.Detailing) {
    const [title, content] = props.field.Detailing.split(': ')
    const [date, user] = content.split(', ')
    return {
      title,
      date,
      user,
    }
  }
  return null
})

const isCommentEditing = defineModel<boolean>('isEditing', { default: false })

const isCommentNotChanged = computed(() => {
  return localValue.value === props.initialValue
})

const editCommentSwitch = () => {
  if (isCommentEditing.value) {
    localValue.value = props.initialValue || ''
  }
  isCommentEditing.value = !isCommentEditing.value
}

const editCommentSave = () => {
  emits('update-comment')
}
</script>

<style scoped lang="scss">
.comment-field {
  $this: &;

  :deep(.v-popper__arrow-container) {
    display: none;
  }

  :deep(.v-popper__inner) {
    border: none !important;
    border-radius: 5px !important;
    box-shadow: 0 4px 20px 0 #061c2838 !important;
  }

  background: v-bind('fieldColors.background');
  display: flex;
  flex-direction: column;
  gap: 5px;

  &--compact {
    #{$this}__title {
      font-family: Inter;
      font-size: 16px;
      font-weight: 600;
      line-height: 20.8px;
      color: #23282f;
    }

    #{$this}__value {
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      line-height: 16.8px;
      color: #23282f;
    }
  }

  &__edit-popper {
    width: 250px;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &-divider {
      border: none;
      height: 1px;
      margin: 0;
      padding: 0;
      background: #e3ebf1;
    }

    &-content {
      padding: 4px 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &-title {
        font-family: Inter;
        font-size: 12px;
        font-weight: 500;
        line-height: 14.4px;
        color: #8990a2;
      }

      &-info {
        font-size: 14px;
        font-weight: 400;
        line-height: 16.8px;
        color: #23282f;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    &-footer {
      font-size: 14px;
      font-weight: 500;
      line-height: 19.6px;
      align-items: center;
      padding: 4px 8px;
      display: flex;
      gap: 8px;
      color: #23282f;
    }

    &-action {
      :deep(.ui-button__content) {
        gap: 8px;
      }

      &:not(:hover, :focus) {
        :deep(.ui-button__icon) {
          color: #8990a2;
        }
      }
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
  }

  &__title {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    color: #8990a2;
  }

  &__edit-button {
    margin-left: auto;
  }

  &__content {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    color: #23282f;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  &__footer {
    display: flex;
    gap: 4px;
    justify-content: space-between;
  }

  &__last-changed-info {
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
    line-height: 14.52px;
    color: #8990a2;
  }

  &__edit-actions {
    margin-left: auto;
    display: flex;
    gap: 4px;

    &-button {
      &:not(:hover, :focus) {
        color: var(--color-gray);
        border-color: var(--color-border);
      }

      &--hidden {
        opacity: 0;
        pointer-events: none;
        order: -1;
      }
    }
  }
}
</style>
