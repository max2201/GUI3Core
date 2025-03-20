<template>
  <div class="sidepanel" :class="[expanded && '_expanded']">
    <div class="sidepanel__nav">
      <div class="sidepanel__toggle" @click="handlePanelToggle">
        <SvgIcon name="chevrons-left" />
      </div>

      <UiButton1 v-if="expanded" size="small" iconLeft="download" :icon-size="24" />
      <UiButton1 v-if="expanded" size="small" iconLeft="cog" :icon-size="24" />

      <div class="sidepanel__refresh" @click="handleRefresh">
        <SvgIcon name="rotate-cw" />
      </div>
    </div>

    <slot></slot>

    <div class="sidepanel__actions">
      <UiButton1 v-if="!expanded" size="small" iconLeft="download" :icon-size="24" />
      <UiButton1 v-if="!expanded" size="small" iconLeft="cog" :icon-size="24" />

      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false)
const emits = defineEmits(['toggle'])

const setPanelWidth = () => {
  const width = expanded.value ? '200px' : '70px'
  setRootCssProperty('--sidepanel-width', width)
  emits('toggle')
}

const handlePanelToggle = () => {
  expanded.value = !expanded.value

  setPanelWidth()
}

const moduleStore = useModuleStore()
const handleRefresh = () => {
  moduleStore.getModuleDataset()
}

const { routeModuleId, routeModuleUid } = useModuleLoader()

watch(
  () => routeModuleUid.value,
  () => {
    expanded.value = false
    setPanelWidth()
  },
)

watch(
  () => routeModuleId.value,
  () => {
    expanded.value = false
    setPanelWidth()
  },
)
</script>

<style lang="scss" scoped>
.sidepanel {
  position: sticky;
  width: var(--sidepanel-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: white;
  border-left: 1px solid var(--color-border);
  overflow-y: auto;
  touch-action: manipulation;
  // transition: width 0.25s $ease;
  &._expanded {
    width: 200px;
    .sidepanel {
      &__nav {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 16px;
        margin-bottom: 18px;
      }

      &__toggle {
        text-align: left;
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;

        .svg-icon {
          transform: rotate(180deg);
        }
      }
      &__refresh {
        text-align: right;
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      &__actions {
        margin-top: 20px;

        button {
          width: 100%;
          justify-content: flex-start;

          :deep(.button__content) {
            text-align: left;
            justify-content: flex-start;
            padding-left: 10px;
          }
        }
      }

      &__button-label {
        display: block;
      }
    }
  }

  &__nav {
    color: var(--color-gray);
  }

  &__refresh,
  &__toggle {
    text-align: center;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-gray);
    transition: color 0.25s $ease;
    padding-bottom: 16px;
    margin-bottom: 18px;
    cursor: pointer;
    .svg-icon {
      font-size: var(--font-size-24);
    }
    &:hover {
      color: var(--color-font);
    }
  }

  &__toggle {
    .svg-icon {
      transform: rotate(0deg);
      transition: transform 0.25s $ease;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    margin-top: 0px;
    gap: 8px;
  }
}
</style>
