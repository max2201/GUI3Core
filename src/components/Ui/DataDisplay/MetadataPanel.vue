<template>
  <div v-if="panel" class="metadata-panel">
    <div class="metadata-panel__label">{{ panel.Title }}</div>
    <div :class="['metadata-panel__value', 'metadata-panel__value_link']" @click="openModal">
      {{ panel.AggregateValue }}
      <SvgIcon :width="11" :height="11" name="open-here" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { WindowContentClass, WindowHeadClass } from '@/core/constants/GlobalClassNames'
import { FreeModalTarget } from '@/core/interface/FreeModal'
import type { LiteViewBlockGroup } from '@/core/interface/Object'
import type { IMetaDataGroup } from '@/core/interface/Requests'
import { openFreeModal } from '@/core/utils/openFreeModal'
import type { ClientPanel } from '@/core/interface/Client'

const props = defineProps<{
  panel: IMetaDataGroup | ClientPanel
}>()

const openModal = () => {
  const windowHeadDiv = Array.from(document.getElementsByClassName(WindowHeadClass))[0]
  const windowHeadRect = windowHeadDiv.getBoundingClientRect()
  const windowContentDiv = Array.from(document.getElementsByClassName(WindowContentClass))[0]
  const windowContentRect = windowContentDiv.getBoundingClientRect()

  if (!windowHeadRect || !windowContentRect) {
    console.error('Не удалось открыть окно метаданных - не найдено view')
    return
  }

  openFreeModal({
    target: FreeModalTarget.MetaDataGroups,
    object: [{ Title: '', Code: '', Fields: props.panel.Fields }] as LiteViewBlockGroup[],
    title: props.panel.Title,
    top: windowHeadRect.bottom,
    left: document.body.clientWidth - 380,
    height: windowContentRect.bottom - windowHeadRect.bottom,
    width: 380,
    callback: () => {},
  })
}
</script>

<style lang="scss">
.metadata-panel {
  display: flex;
  align-items: center;
  gap: 8px;
}
.metadata-panel__label {
  color: var(--color-gray);
  font-size: var(--font-size-14);
  width: 87px;
  overflow: hidden;
}
.metadata-panel__value {
  display: flex;
  gap: 4px;
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-500);

  &_link {
    border-bottom: 1px dashed;
    cursor: pointer;

    :deep(.svg-icon) {
      position: relative;
      top: 8px;
    }
  }
}
</style>
