<template>
  <div class="filter__actions">
    <div
      v-if="showAdditional"
      class="filter__action-more"
      :class="[showAdditionalFields && '_active']"
      @click="emitToogleMoreFilters"
    >
      <SvgIcon name="chevron-down" />
      <span>
        {{ showAdditionalFields ? 'Скрыть доп. фильтры' : 'Показать еще фильтры' }}
      </span>
    </div>

    <div v-if="!isSavedFilter" class="filter__action-save">
      <UiCheckbox1 v-model="showSaveTemplateForm" class="mr-3"> Сохранить как шаблон </UiCheckbox1>

      <div v-if="showSaveTemplateForm" class="filter__action-save__form">
        <UiInput1 v-model="filterTemplateName" placeholder="Название шаблона" highlight-not-empty />
        <UiButton size="small" iconLeft="tiny-checkmark" @click="onSaveFilter" />
      </div>
    </div>

    <div class="filter__action-buttons">
      <UiButton1 :loading="moduleDatasetFetching" theme="secondary" @click="emitReset">
        Сбросить
      </UiButton1>
      <UiButton1 :loading="moduleDatasetFetching" @click="emitSubmit"> Применить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { unref } from 'vue'

const moduleStore = useModuleStore()
const { moduleDatasetFetching } = storeToRefs(moduleStore)

const props = defineProps<{
  showAdditional?: boolean
  showAdditionalFields?: boolean
  isSavedFilter?: boolean
}>()

const emit = defineEmits(['toggle-more-filters', 'submit', 'reset', 'save'])
const showSaveTemplateForm = ref(false)
const filterTemplateName = ref('')

const emitToogleMoreFilters = () => {
  emit('toggle-more-filters')
}

const emitSubmit = () => {
  emit('submit')
}

const emitReset = () => {
  emit('reset')
}

const onSaveFilter = () => {
  emit('save', filterTemplateName.value)
  showSaveTemplateForm.value = false
  filterTemplateName.value = ''
}
</script>

<style lang="scss" scoped>
.filter {
  &__actions {
    margin-top: 40px;
    display: flex;
    align-items: center;
    border-top: 1px solid var(--color-border);
    padding: 16px 0;
  }

  &__action-more {
    display: inline-flex;
    min-width: 200px;
    align-items: center;
    cursor: pointer;
    transition: color 0.25s $ease;

    .svg-icon {
      margin-right: 6px;
      font-size: var(--font-size-24);
      color: var(--color-gray);
      transition: transform 0.25s $ease;
    }

    span {
      display: inline-block;
    }

    &:hover {
      color: var(--color-primary);
    }

    &._active {
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }

  &__action-save {
    display: flex;
    width: 100%;
    justify-content: start;
    align-items: center;
  }

  &__action-buttons {
    display: flex;
    min-width: 260px;
    align-items: center;
    justify-content: end;
    gap: 8px;
  }
}

.filter__action-save__form {
  display: grid;
  grid-template-columns: 1fr 32px;
  height: 32px;
  align-items: center;
  margin-right: 6px;

  :deep(.input__input) {
    border-radius: 5px 0 0 5px;
  }

  :deep(button.button) {
    border-radius: 0 5px 5px 0;
  }
}
</style>
