<template>
  <div ref="callLite" class="call-lite">
    <div class="call-lite__steps-control">
      <div
        class="call-lite__step"
        :class="{ 'call-lite__step--active': activeStepTabIndex === 0 }"
        @click="handleActiveStep(0)"
      >
        Результаты звонка
      </div>
      <div
        class="call-lite__step"
        :class="{ 'call-lite__step--active': activeStepTabIndex === 1 }"
        @click="handleActiveStep(1)"
      >
        Транскрибация звонка
      </div>
    </div>

    <div class="call-lite__content">
      <div class="call-lite__steps">
        <div class="call-lite__steps-content" v-show="activeStepTabIndex === 0" v-if="сallResult">
          <CommentField v-for="item in сallResult?.Fields" :key="item.Code" :field="item" />
        </div>

        <div class="call-lite__steps-content" v-show="activeStepTabIndex === 1">
          <div class="call-lite__steps-content-text">
            {{ callData?.CallTranscipt }}
          </div>
        </div>
      </div>

      <TypeGroupRenderer
        :key="`group-${analysis?.Code}`"
        class="call-lite__group"
        :group="analysis"
        v-if="analysis"
      >
        <template #fields="{ fields }">
          <TypeFieldRenderer
            :flip="true"
            :container="'.call-lite'"
            :skidding="-170"
            :boundary="undefined"
            v-for="field in fields"
            :key="`field-${field.Code}`"
            :field="field"
          />
        </template>
      </TypeGroupRenderer>
    </div>
    <div class="call-lite__footer"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  callData: any
}>()

const analysis = computed(() => {
  return props.callData?.Analysis
})
const сallResult = computed(() => {
  return props.callData?.CallResult
})
const callLite = ref<HTMLDivElement>()
const activeStepTabIndex = ref(0)
const handleActiveStep = (id: number) => {
  activeStepTabIndex.value = id
}
</script>

<style scoped lang="scss">
.call-lite {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__steps-control {
    display: flex;
    gap: 24px;
    padding: 0 24px;
    background-color: var(--color-background);
    border-right: 1px solid var(--color-border);
  }

  &__step {
    position: relative;
    display: block;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.8px;
    cursor: pointer;
    color: var(--color-gray);

    &--active {
      color: var(--color-font-2);

      &:after {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        width: 100%;
        background-color: var(--color-bg-active);
        border-radius: 5px 5px 0 0;
        z-index: 2;
      }
    }
  }

  &__content {
    display: grid;
    grid-auto-rows: min-content;
    row-gap: 28px;
    column-gap: 24px;
    padding: 0 24px;
  }

  &__steps {
    overflow: hidden;
    overflow-y: auto;
    margin: 0 -24px;
  }

  &__steps-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 300px;
    padding: 20px;
  }

  &__steps-content-text {
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-font-2);
  }
  &__footer {
    min-height: 52px;
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    padding: 8px 30px;
    background-color: #f0f5f9;
    border-top: 1px solid #d5dde3;
  }
}
</style>
