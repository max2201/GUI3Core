<template>
  <div class="panel-list-group">
    <h3
      v-if="!group.HideTitle"
      class="panel-list-group__title"
      :class="{
        'panel-list-group__title--with-adding': !!groupCommand,
      }"
    >
      <UiButton1
        variant="text"
        icon-left="plus-circle"
        :icon-size="24"
        @click="handleCommand"
        v-if="!!groupCommand"
      ></UiButton1>
      <template v-if="LinkedBaseObject">
        <BaseObjectLink
          is-window-lite-view
          class="panel-list-group__title-text--link"
          :value="LinkedBaseObject"
        >
          <template #text>
            {{ group.Title }}
          </template>
          <template #icon>
            <span></span>
          </template>
        </BaseObjectLink>
        <BaseObjectLink is-primary-link :value="LinkedBaseObject">
          <template #text>
            <span></span>
          </template>
          <template #icon>
            <SvgIcon :width="11" :height="11" name="open-here" />
          </template>
        </BaseObjectLink>
      </template>
      <span v-else>{{ group.Title }}</span>
    </h3>
    <div class="panel-list-group__content">
      <UiLoader class="panel-list-group__loading" v-if="loading" />
      <slot name="accessDenied" v-if="isAccessDenied">
        <StubPanel
          class="panel-list-group__stub-block"
          icon="access-denied"
          :text="group.FieldsEmptyReason"
        ></StubPanel>
      </slot>
      <div class="panel-list-group__panel-list-block" v-else-if="groupFields.length">
        <slot name="fields" :fields="groupFields" />
      </div>
      <slot name="emptyState" v-else>
        <StubPanel
          class="panel-list-group__stub-block"
          icon="empty-box"
          :text="group.FieldsEmptyReason"
        ></StubPanel>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import StubPanel from '@c/Ui/DataDisplay/StubPanel.vue'

const props = defineProps<{
  group
  loading?: boolean
}>()
const emits = defineEmits(['add-object'])

const groupFields = computed(() => {
  return props.group.Fields || []
})

const { executeCommand } = useCommand()

const groupCommand = computed(() => {
  return props.group?.Command || null
})

const handleCommand = async () => {
  await executeCommand(groupCommand.value, {
    onSuccess: (data) => {
      console.log('Команда выполнена успешно:', data)
    },
    onError: (error) => {
      console.error('Ошибка при выполнении команды:', error)
    },
  })
}

const isAccessDenied = computed(() => {
  return props.group.AccessDenied
})

const LinkedBaseObject = computed(() => {
  return props.group.LinkedBaseObject
})
</script>

<style lang="scss" scoped>
.panel-list-group {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__content {
    position: relative;
    height: 100%;
  }

  &__loading {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: var(--color-font);
    padding: 4px 6px 8px;

    &--with-adding {
      padding: 6px 0;
    }

    &-text {
      &--link {
        :deep(.base-object-link__text) {
          border-color: inherit;
        }
      }
    }
  }

  &__stub-block {
    background: #f0f5f9;
  }

  &__panel-list-block {
    display: grid;
    grid-auto-rows: 30px;
    row-gap: 2px;
  }
}
</style>
