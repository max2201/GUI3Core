<template>
  <div class="double-panel-list-group">
    <h3 v-if="!group.HideTitle" class="double-panel-list-group__title">
      <span>{{ group.Title }}</span>
      <span class="double-panel-list-group__title-line" />
    </h3>
    <div class="double-panel-list-group__content">
      <UiLoader class="double-panel-list-group__loading" v-if="loading" />
      <slot name="accessDenied" v-if="isAccessDenied">
        <StubPanel
          class="double-panel-list-group__stub-block"
          icon="access-denied"
          :text="group.FieldsEmptyReason"
        ></StubPanel>
      </slot>
      <div class="double-panel-list-group__panel-list-block" v-else-if="groupFields.length">
        <slot name="fields" :fields="groupFields" />
      </div>
      <slot name="emptyState" v-else>
        <StubPanel
          class="double-panel-list-group__stub-block"
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

const groupFields = computed(() => {
  return props.group.Fields || []
})

const isAccessDenied = computed(() => {
  return props.group.AccessDenied
})
</script>

<style lang="scss" scoped>
.double-panel-list-group {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__title {
    display: flex;
    align-items: baseline;
    gap: 4px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: var(--color-font);
    padding: 12px 6px 16px;

    &-line {
      flex: 1;
      height: 1px;
      background-color: #D5DDE3;
    }
  }

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

  &__stub-block {
    background: #f0f5f9;
  }

  &__panel-list-block {
    display: grid;
    grid-auto-rows: 30px;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 2px;
  }
}
</style>
