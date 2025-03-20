<template>
  <div ref="tableWrapper" class="atom-table__wrapper">
    <UiLoader :loading="showLoader" theme="page" not-transparent />
    <div v-if="batchEditing && !isActiveBatchEditing" class="atom-table__group-actions-wrapper">
      <div class="atom-table__group-actions-icon">
        <UiCheckbox1
          @update:model-value="onClickSelectedAll"
          :model-value="selectedBatchIds.length === dataset.length"
        />
      </div>
      <div class="atom-table__group-actions">
        <div v-for="item in availableGroupActions" :key="item.Title">
          <UiButton
            :icon-left="item.Icon ? `actiongroup-${item.Icon}` : 'actiongroup-download'"
            size="small"
            theme="gray-outline"
            :class="[
              `system-color-${item.SystemColor}`,
              `system-border-color-${item.SystemColor}`,
              item.SystemColor == -1 ? 'no-color' : '',
            ]"
            @click="onClickGroupAction(item.Operation, item.IsCodeConfirmation)"
          >
            {{ item.Title }}
          </UiButton>
        </div>
        <!-- Информация о количестве выбранных -->
        <div class="atom-table__group-actions-info">Выбрано: {{ selectedBatchIds.length }}</div>
      </div>
    </div>

    <div ref="root" class="atom-table">
      <div
        v-if="columnResizers[0]"
        :style="{ left: hasActionCell && columnResizers[0].left + 'px' }"
        :class="['table-column-resizer', stickyCell && 'table-column-resizer_sticky-cell']"
        :data-left="columnResizers[0].left"
        :data-index="0"
      ></div>
      <table ref="table">
        <thead>
          <tr>
            <th
              v-if="hasActionCell"
              class="atom-table__header-action-cell"
              @click="
                isActiveBatchEditing && !selectedBatchIds
                  ? onClickSelectedAll
                  : onClickHeaderActionCell
              "
            >
              <div
                :class="[
                  'atom-table__header-action-cell__icon',
                  batchEditing && 'atom-table__header-action-cell__icon_active',
                ]"
              >
                <SvgIcon :name="batchEditing ? 'check-square-active' : 'check-square'" />
              </div>
            </th>

            <th
              v-for="(item, index) in datasetSnapshot"
              :key="item.id"
              :class="[
                'atom-table__header-cell top-sticky',
                {
                  'left-sticky': stickyCell && index === 0,
                  'atom-table__header-cell_sortable': item.sort,
                  'atom-table__header-cell_active-sort': datasetMeta.sort.id === item.id,
                  'atom-table__header-cell_asc-sort': datasetMeta.sort.dir === 'ASC',
                  'atob-table__header-cell_last': datasetSnapshot?.length - 1 === index,
                },
              ]"
              :style="{
                'min-width': customColumnsWidth[index]
                  ? customColumnsWidth[index] + 'px'
                  : (datasetSnapshot?.length - 1 === index
                      ? lastColumnWidth || item.width
                      : item.width) + 'px',
                'max-width': customColumnsWidth[index]
                  ? customColumnsWidth[index] + 'px'
                  : (datasetSnapshot?.length - 1 === index
                      ? lastColumnWidth || item.width
                      : item.width) + 'px',
                left: stickyCell && index === 0 ? '28px' : undefined,
              }"
              :data-index="index"
              @click="onClickHeaderCell(item)"
            >
              <div>
                <span>
                  {{ item.label }}
                </span>
                <span class="atom-table__header-cell__sort" v-if="item.sort">
                  <SvgIcon name="arrow-down" />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(item, index) in dataset" :key="item.id">
            <tr
              :class="[
                StopClickOutsideClasses.tableTr,
                { 'atom-table__row--selected': selectedBatchIds?.includes(item.id) },
              ]"
              @dblclick="onDblClickRow(index, $event)"
            >
              <td
                v-if="hasActionCell"
                class="atom-table__cell atom-table__action-cell"
                @click.stop="onClickAction(index)"
                :style="{
                  'background-color': item.color ? item.color + '6a' : '#ffffff',
                }"
              >
                <div
                  :style="{
                    transform:
                      expandedRowIds.includes(item.id) && !batchEditing
                        ? 'rotate(180deg)'
                        : undefined,
                  }"
                >
                  <UiCheckbox1
                    v-if="batchEditing"
                    :model-value="selectedBatchIds?.includes(item.id)"
                  />
                  <SvgIcon v-else name="chevrons-down" />
                </div>
              </td>

              <td
                v-for="(cell, index) in item.cells"
                :key="item.id + index"
                :style="{
                  'min-width': customColumnsWidth[index]
                    ? customColumnsWidth[index] + 'px'
                    : (datasetSnapshot?.length - 1 === index
                        ? lastColumnWidth || datasetSnapshot[index]?.width
                        : datasetSnapshot[index]?.width) + 'px',
                  'max-width': customColumnsWidth[index]
                    ? customColumnsWidth[index] + 'px'
                    : (datasetSnapshot?.length - 1 === index
                        ? lastColumnWidth || datasetSnapshot[index]?.width
                        : datasetSnapshot[index]?.width) + 'px',
                  position: stickyCell && index === 0 ? 'sticky' : undefined,
                  left: stickyCell && index === 0 ? '28px' : undefined,
                  'background-color': item.color ? item.color + '6a' : '#ffffff',
                }"
                :class="[
                  'atom-table__cell',
                  {
                    'atom-table__sticky-cell': stickyCell && index === 0 && hasActionCell,
                    'atom-table__cell--icon': cell.type === TableCellTypes.Icon,
                  },
                ]"
              >
                <SvgIcon
                  v-if="cell.type === TableCellTypes.Icon"
                  :name="`calls-${cell.value}`"
                  :width="32"
                  :height="32"
                />
                <div
                  v-else-if="cell.presentation && cell.presentation.background"
                  class="atom-table__cell-presentation"
                  :style="{
                    'background-color': cell.presentation.background,
                    'border-color': cell.presentation.background + '3a',
                  }"
                >
                  {{ cell.value }}
                </div>

                <div v-else-if="index === 0 && hasActionCell">
                  {{ cell.value }}
                </div>

                <BaseObjectLink
                  v-else-if="cell.type === Number(TableCellTypes.BaseObject)"
                  :value="{
                    BaseObjectName: isClient(cell.value) ? cell.value?.BaseObjectName : '',
                    BaseObjectType: isClient(cell.value) ? cell.value?.BaseObjectType : 0,
                    BaseObjectId: isClient(cell.value) ? cell.value?.BaseObjectId : 0,
                  }"
                />

                <div
                  v-else-if="cell.type === Number(TableCellTypes.Flags)"
                  class="atom-table__cell-flags"
                >
                  <div
                    v-for="(flag, idx) in getFlags(cell.value)"
                    class="atom-table__cell-flag"
                    :key="idx"
                    :style="{
                      backgroundColor: flag.Color,
                      borderColor: !flag.Color ? 'var(--color-font)' : '',
                    }"
                    :title="flag.Title"
                  ></div>
                </div>

                <template v-else>
                  {{ cell.value }}
                </template>
              </td>

              <template v-if="item?.cells?.length < datasetSnapshot?.length">
                <td
                  v-for="(ghost, index) in Array(datasetSnapshot?.length - item?.cells?.length)"
                  :key="`ghost-${index}`"
                  class="atom-table__cell"
                ></td>
              </template>
            </tr>

            <tr v-if="expandedRowIds.includes(item.id)" class="atom-table__expended-row">
              <td></td>
              <td class="expaded-row" :colspan="expandedBlockColspan">
                <TableDetails :row="item" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div
        v-for="(resizer, index) in columnResizers.slice(1)"
        :key="index"
        :style="{
          left: resizer.left + 'px',
        }"
        :data-left="resizer.left"
        :data-index="index + 1"
        :class="['table-column-resizer']"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { reactive, unref } from 'vue'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import type {
  ITableCellFlag,
  ITableCellHead,
  ITableDatasetMeta,
  ITableRow,
} from '@/core/interface/Table'
import { TableCellTypes } from '@/core/constants/TableCellTypes'
import { useTableState, type TableState } from '@/composables/use-table-state'
import { isClient } from '@/core/utils/typeGuards/isClient'
import type { IGroupActionInfo } from '@/core/interface/Auth'

const sharedModals = useSharedModalsStore()
const props = defineProps<{
  tableState?: TableState
  datasetSnapshot: ITableCellHead[]
  dataset: ITableRow[]
  datasetMeta: ITableDatasetMeta
  showLoader?: boolean
  hasActionCell?: boolean
  isActiveBatchEditing?: boolean
  stickyCell?: boolean
  availableGroupActions?: IGroupActionInfo[]
}>()

const localTableState = computed(() => props.tableState || useTableState())
const expandedRowIds = computed(() => localTableState.value.expandedRowIds.value)
const batchEditing = computed(() => {
  return localTableState.value.batchEditing.value || props.isActiveBatchEditing
})
const selectedBatchIds = computed(() => localTableState.value.selectedBatchIds.value)
const emit = defineEmits([
  'dblclick-row',
  'click-header-cell',
  'click-header-action-cell',
  'click-group-action',
])

const onClickHeaderActionCell = () => {
  if (props.availableGroupActions?.length || props?.isActiveBatchEditing) {
    localTableState.value.toggleBatchEditing(!batchEditing.value)
    emit('click-header-action-cell')
  } else {
    return
  }
}
const onClickGroupAction = (action: string, IsCodeConfirmation: boolean) => {
  if (localTableState.value.selectedBatchIds.value > 0) {
    localTableState.value.setGroupOperation(action)
    emit('click-group-action', IsCodeConfirmation)
  } else {
    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'warning',
        title: 'Невозможно выполнить операцию ',
        description:
          'Для выполнения групповой операции должен быть выбран хотя-бы один элемент в таблице',
      },
    })
  }
}
const onDblClickRow = (row: number, e: Event) => {
  const item = props.dataset[row]
  emit('dblclick-row', item, e)
}
const onClickSelectedAll = () => {
  if (props.dataset.length === selectedBatchIds.value.length) {
    localTableState.value.selectedBatchIds.value = []
  } else {
    const update = props.dataset.map((obj) => obj.id)
    localTableState.value.selectedBatchIds.value = update
  }
}
const onClickAction = (row: number) => {
  const item = props.dataset[row]
  if (!batchEditing.value && props.datasetMeta.isContextView) {
    localTableState.value.toggleExpanded(item.id)
  } else if (props.isActiveBatchEditing) {
    localTableState.value.toggleSelectedBatchIds(item.id)
  }
}

const onClickHeaderCell = async (item: ITableCellHead) => {
  emit('click-header-cell', item)
}

const getFlags = (flags: any) => {
  return flags as ITableCellFlag[]
}

const table = ref<HTMLElement>()
const root = ref<HTMLElement>()
const lastColumnWidth = ref<Number | null>(null)

const updateLastColumnWidth = () => {
  if (!root.value || !table.value) {
    return
  }

  const rootWidth = root.value.clientWidth
  const tableWidth = table.value.clientWidth

  if (tableWidth < rootWidth) {
    const lastCols = Array.from(document.getElementsByClassName('atob-table__header-cell_last'))
    const lastCol = lastCols?.[0]
    if (!lastCol) {
      return
    }

    const firstRow = unref(props.dataset)[0]
    if (!firstRow?.cells) {
      return
    }

    lastColumnWidth.value =
      rootWidth -
      tableWidth +
      (firstRow.cells[firstRow?.cells?.length - 1].width || 0) +
      lastCol.clientWidth
  } else {
    lastColumnWidth.value = null
  }
}

const expandedBlockColspan = ref(6)
const updateExpandedBlockColspan = () => {
  if (!root.value || !table.value) {
    return
  }

  const rootWidth = root.value.clientWidth
  const tableWidth = table.value.clientWidth
  const cellsCount = props.dataset?.[0]?.cells.length || 0

  if (tableWidth <= rootWidth) {
    expandedBlockColspan.value = cellsCount
    return
  }

  let colspanWidth = 30 // first column with checks
  let colspan = 1

  for (let i = 0; i < cellsCount; i++) {
    colspanWidth += props.datasetSnapshot[i].width

    if (colspanWidth > rootWidth) {
      break
    } else {
      colspan++
    }
  }
  expandedBlockColspan.value = colspan - 1
}

const customColumnsWidth = reactive<{
  [key: number]: number
}>({})

interface ColumnResizerInfo {
  index: number
  resizer?: HTMLDivElement
  th: HTMLTableCellElement
  left: number
}

const columnResizers = ref<ColumnResizerInfo[]>([])
const tableWrapper = ref(null)

const createResizers = () => {
  const newValue: ColumnResizerInfo[] = []
  const ths = Array.from(tableWrapper.value.getElementsByTagName('th'))
  let currentX = 0

  ths.forEach((th, index) => {
    const thRect = th.getBoundingClientRect()
    currentX += thRect.width

    if (index === 0 || index === ths.length - 1) return

    newValue.push({
      index: index - 1,
      th,
      resizer: undefined,
      left: currentX - 2,
    })
  })

  columnResizers.value = newValue

  setTimeout(() => {
    addColumnResizersWatchers()
  })
}

watch(
  () => props.dataset,
  () => {
    updateExpandedBlockColspan()
    createResizers()
    updateLastColumnWidth()
  },
)

let tableResizeObserver: ResizeObserver
let skipResizeAction = false
const ResizerClassName = 'table-column-resizer'
const ResizerClassNameActive = 'table-column-resizer_active'

const columnResizerMouseenterHandler = (e: Event) => {
  const target = e.target as HTMLElement
  target.dataset.activeHover = 'true'

  setTimeout(() => {
    if (!target || !target.dataset.activeHover) {
      return
    }

    target.classList.add(ResizerClassNameActive)
    target.style.left = Number(target.dataset.left) - 1 + 'px'
  }, 500)
}

let resizerInfo: ColumnResizerInfo | undefined = undefined

let resizeLineXStart = null as null | number
let resizeLineXLast = null as null | number
let resizeLine: null | HTMLDivElement = null
let minLeftResizeLine = 0
let maxLeftResizeLine = 0

const endMoveResizer = (e?: Event) => {
  if (e && resizerInfo && resizeLine && resizeLineXStart && resizeLineXLast) {
    const diff = resizeLineXLast - resizeLineXStart
    const thWidth = resizerInfo.th.getBoundingClientRect().width

    customColumnsWidth[resizerInfo.index] = thWidth + diff

    setTimeout(() => {
      createResizers()
    })
  }

  resizerInfo = undefined
  resizeLine?.remove()
  resizeLine = null
  minLeftResizeLine = 0
  maxLeftResizeLine = 0
  resizeLineXStart = null
  resizeLineXLast = null
}

const moveResizerLine = (e: MouseEvent | TouchEvent) => {
  if (!root.value || !resizeLine || !resizerInfo) return

  const tableRootRect = root.value.getBoundingClientRect()
  const cursorPosition = (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX
  const newLeft = cursorPosition - tableRootRect.x + root.value.scrollLeft

  if (newLeft < minLeftResizeLine || newLeft > maxLeftResizeLine) {
    return
  }

  resizeLine.style.left = newLeft + 'px'
  resizeLineXLast = cursorPosition
}

let mousedownX = null as number | null
let mousedownY = null as number | null
let lastMousemoveX = null as number | null
let lastMousemoveY = null as number | null

const onMouseMove = (e: MouseEvent) => {
  lastMousemoveX = e.clientX
  lastMousemoveY = e.clientY

  if (resizerInfo) {
    moveResizerLine(e)
  }
}

const onMouseUp = (e?: Event) => {
  endMoveResizer(e)

  mousedownX = null
  mousedownY = null
  lastMousemoveX = null
  lastMousemoveY = null

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const showResizerLIne = (e: MouseEvent | TouchEvent) => {
  if (!root.value || !resizerInfo) return

  const tableRootRect = root.value.getBoundingClientRect()
  const thRect = resizerInfo.th.getBoundingClientRect()

  if ((e as MouseEvent).clientX) {
    resizeLineXStart = (e as MouseEvent).clientX
  } else {
    const resizerRect = resizerInfo.resizer?.getBoundingClientRect()
    resizeLineXStart = resizerRect
      ? resizerRect.x + resizerRect?.width / 2
      : (e as TouchEvent).touches[0].clientX
  }

  minLeftResizeLine = thRect.x + root.value.scrollLeft + 40
  maxLeftResizeLine = thRect.x + root.value.scrollLeft + 500

  resizeLine = document.createElement('div')
  resizeLine.style.left = resizeLineXStart - tableRootRect.x + root.value.scrollLeft + 'px'

  root.value?.appendChild(resizeLine)

  resizeLine.classList.add('atom-table-resize-line')
}

const onMouseDownColumnResizer = (event: Event) => {
  const e = event as MouseEvent
  const target = e.target as HTMLDivElement | null
  if (!root.value || !target) return

  resizerInfo = columnResizers.value[Number(target.dataset.index)]

  mousedownX = e.clientX
  mousedownY = e.clientY
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)

  setTimeout(() => {
    if (lastMousemoveX === null || lastMousemoveY == null) {
      showResizerLIne(e)
      return
    }

    if (
      mousedownX !== null &&
      mousedownY !== null &&
      Math.abs(mousedownX - lastMousemoveX) < 3 &&
      Math.abs(mousedownY - lastMousemoveY) < 3
    ) {
      showResizerLIne(e)
      return
    }

    onMouseUp()
  }, 500)
}

const columnResizerMouseleaveHandler = (e: Event) => {
  const target = e.target as HTMLElement
  target.dataset.activeHover = ''
  target.classList.remove(ResizerClassNameActive)
  target.style.left = target.dataset.left + 'px'
}

const addColumnResizersWatchers = () => {
  removeColumnResizerWathers()

  const resizers = Array.from(document.getElementsByClassName(ResizerClassName))

  resizers.forEach((el, index) => {
    if (!columnResizers.value[index]) return

    columnResizers.value[index].resizer = el as HTMLDivElement
    el.addEventListener('mouseenter', columnResizerMouseenterHandler)
    el.addEventListener('mouseleave', columnResizerMouseleaveHandler)
    el.addEventListener('mousedown', onMouseDownColumnResizer)
  })
}

onMounted(() => {
  if (!table.value || !root.value) {
    return
  }

  table.value.oncontextmenu = () => false

  tableResizeObserver = new ResizeObserver(
    _.debounce(() => {
      if (skipResizeAction) {
        skipResizeAction = false
        return
      }

      updateLastColumnWidth()
      updateExpandedBlockColspan()

      skipResizeAction = true
    }, 100),
  )

  setTimeout(() => {
    updateLastColumnWidth()
  })

  updateExpandedBlockColspan()
  tableResizeObserver.observe(root.value)

  addColumnResizersWatchers()
})

const removeColumnResizerWathers = () => {
  const resizers = Array.from(document.getElementsByClassName(ResizerClassName))

  resizers.forEach((el) => {
    el.removeEventListener('mouseenter', columnResizerMouseenterHandler)
    el.removeEventListener('mouseleave', columnResizerMouseleaveHandler)
  })
}

onBeforeUnmount(() => {
  if (tableResizeObserver) tableResizeObserver.disconnect()

  removeColumnResizerWathers()
})
</script>

<style lang="scss" scoped>
.atom-table__wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  position: relative;
  overflow: hidden;
}

.atom-table {
  display: block;
  overflow: auto;
  border: 1px solid var(--color-border);
  user-select: none;
  position: relative;
  touch-action: pan-x pan-y;

  &__group-actions {
    :deep(.button) {
      .button__icon {
        font-size: 20px;
        display: flex;
      }

      &.no-color {
        .button__icon {
          color: var(--color-gray);
        }
      }
    }

    &-icon {
      z-index: 5;
      text-align: center;
      cursor: pointer;
      transition:
        background-color 0.25s $ease,
        color 0.25s $ease;
      min-width: 28px !important;
      max-width: 28px !important;
    }

    &-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    &-info {
      font-weight: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 20px;
    }
  }

  table {
    border-spacing: 0;
    background-color: white;

    tr:hover td {
      background-color: var(--color-background) !important;
    }

    .atom-table__row {
      &--selected {
        td {
          background-color: #e6f4ff !important;
        }
      }
    }

    td,
    th {
      padding: 6px 8px;
      height: 40px;
      min-width: 20px;
      border-bottom: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      font-size: var(--font-size-14);
      overflow: hidden;
      transition: background-color 0.1s ease-in;
      @include text-overflow;

      &:last-child {
        width: 100%;
      }
    }
  }

  &::-webkit-scrollbar {
    width: 15px;
    height: 15px;
    background-color: var(--color-background);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
  }

  &::-webkit-scrollbar-thumb {
    background: #cad2d7;
    border-radius: 8px;
    border: 5px solid var(--color-background);
    width: 15px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray);
  }
}

.atom-table__cell-presentation {
  display: inline-block;
  padding: 2px 10px 4px;
  border-radius: 40px;
  border-style: solid;
  border-width: 1px;
}

.atom-table__cell--icon {
  padding: 3px !important;
}

.atom-table__cell-flags {
  display: flex;
  overflow: hidden;
}

.atom-table__cell-flag {
  flex: 0 0 auto;
  border: 1px solid transparent;
  margin-right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.atom-table__action-cell {
  position: sticky;
  left: 0;
  background-color: #ffffff;
  text-align: center;
  font-size: 0;
  color: var(--color-gray);
  cursor: pointer;
  transition:
    background 0.25s $ease,
    color 0.25s $ease;
  padding: 0 !important;
  min-width: 28px !important;
  max-width: 28px !important;

  &:hover {
    color: var(--color-font);
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 2px !important;
    width: 100%;
    height: 40px;
    transition: background-color 0.1s ease-in;

    .svg-icon {
      font-size: var(--font-size-24);
      width: 24px;
      transition: transform 0.25s $ease;
    }
  }
}

.atom-table table tr:hover td.atom-table__action-cell > div,
.atom-table table tr:hover td.atom-table__sticky-cell > div {
  background-color: var(--color-bg) !important;
}

.atom-table__header-cell {
  background-color: var(--color-bg-darken);
  color: var(--color-gray);
  font-weight: var(--font-weight-500);
  text-align: left;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &_sortable {
    cursor: pointer;

    &:hover {
      .atom-table__header-cell__sort {
        color: var(--color-font);
      }
    }
  }

  &_active-sort {
    color: var(--color-font);
  }

  &_asc-sort {
    .svg-icon {
      transform: rotate(180deg);
    }
  }

  .atom-table__header-cell__sort {
    width: 24px;
    height: 24px;

    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}

// .atom-table__header {
// }
//

.atom-table__group-actions {
  display: flex;
  gap: 4px;
}

.atom-table__group-actions-wrapper {
  background-color: var(--component-gray-background);
  height: 50px;

  &.left-sticky {
    left: 28px;
  }
}

td.atom-table__cell.atom-table__sticky-cell {
  background-color: #ffffff;
  padding: 0;

  > div {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 6px 8px;
    height: 40px;
    transition: background-color 0.1s ease-in;
  }
}

.top-sticky {
  position: sticky;
  top: 0;
  z-index: 2;
}

.left-sticky {
  position: sticky;
  left: 0;
  z-index: 5;
}

.atom-table table th.atom-table__header-action-cell {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 5;
  width: 40px;
  height: 100%;
  text-align: center;
  font-size: 0;
  color: var(--color-gray);
  cursor: pointer;
  transition:
    background-color 0.25s $ease,
    color 0.25s $ease;
  background-color: var(--color-bg-darken);
  font-weight: var(--font-weight-400);
  text-align: left;
  padding: 0;
  min-width: 28px !important;
  max-width: 28px !important;

  .svg-icon {
    font-size: var(--font-size-24);
    width: 24px;
    transition: transform 0.25s $ease;
  }

  &:hover {
    color: var(--color-font);
  }

  .atom-table__header-action-cell__icon {
    display: inline-flex;
    justify-content: center;
    width: 100%;

    &_active {
      color: var(--color-primary);
    }
  }
}

.atom-table tr.atom-table__expended-row {
  background-color: white;
  position: relative;

  &:hover > td {
    background-color: white !important;
  }

  > td {
    position: sticky;
    left: 0;
    border: none;
    background-color: white;
    border-bottom: 1px solid var(--color-border);
  }

  > td.expaded-row {
    left: 28px;
    padding: 20px 40px;
  }
}

.table-column-resizer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  height: 38px;
  width: 4px;
  z-index: 4;

  &:hover {
    background-color: var(--color-bg-active);
    cursor: col-resize;
  }

  &_sticky-cell {
    z-index: 7;
  }

  &_active {
    width: 6px;
    background-color: var(--color-primary) !important;
  }
}
</style>

<style lang="scss">
.atom-table-resize-line {
  width: 1px;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: blue;
  border: 1px lightblue;
  z-index: 6;
}
</style>
