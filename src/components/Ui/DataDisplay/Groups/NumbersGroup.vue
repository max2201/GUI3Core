<template>
  <div class="numbers-group">
    <h3 v-if="!group.HideTitle" :title="group.Title" class="numbers-group__title">
      {{ group.Title }}
    </h3>
    <div class="numbers-group__content">
      <UiLoader class="numbers-group__loading" v-if="loading" />
      <slot name="accessDenied" v-if="isAccessDenied">
        <StubPanel
          class="numbers-group__stub-block"
          icon="access-denied"
          :text="group.FieldsEmptyReason"
        ></StubPanel>
      </slot>
      <div class="numbers-group__panel-list-block" v-else-if="groupFields.length">
        <slot name="fields" :fields="groupFields" />
      </div>
      <slot name="emptyState" v-else>
        <StubPanel
          class="numbers-group__stub-block"
          icon="empty-box"
          :text="group.FieldsEmptyReason"
        ></StubPanel>
      </slot>
    </div>
    <div class="numbers-group__footer">
      <template v-if="LinkedBaseObject">
        <BaseObjectLink
          is-window-lite-view
          class="numbers-group__detailing numbers-group__detailing--link"
          :value="LinkedBaseObject"
        >
          <template #text>
            {{ group.Detailing }}
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
      <span class="numbers-group__detailing" v-else>{{ group.Detailing }}</span>
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

const LinkedBaseObject = computed(() => {
  return props.group.LinkedBaseObject
})
</script>

<style lang="scss" scoped>
.numbers-group {
  display: flex;
  padding: 20px 9px 24px 16px;
  border-radius: 5px;
  border: 1px solid #d5dde3;
  flex-direction: column;
  overflow: hidden;
  gap: 2px;

  &__title {
    padding-bottom: 4px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: var(--color-font);

    overflow: clip;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__content {
    position: relative;
    height: 100%;
    flex: 0;
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
    display: flex;
    gap: 12px;
  }
  &__footer {
    display: flex;
    gap: 2px;
  }
  &__detailing {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    color: #23282f;
    &--link {
      :deep(.base-object-link__text) {
        border-color: inherit;
      }
    }
  }
}
</style>
