<template>
  <div class="pagination" :data-pages="countWithLimit">
    <UiButton1
      class="pagination__control"
      variant="outline"
      theme="transparent"
      icon-left="arrow-left"
      :icon-size="24"
      size="small"
      @click="handlePrev"
      :disabled="!prevAvailable"
    ></UiButton1>
    <UiButton1
      v-for="(item, idx) in items"
      :key="idx"
      variant="outline"
      theme="transparent"
      @click="item !== value.page && handlePageSelect(item)"
      class="pagination__item"
      :class="{
        'pagination__item--active': item === value.page,
        'pagination__item--separator': typeof item !== 'number',
      }"
    >
      <span v-if="typeof item === 'number'">{{ item }}</span>
      <span v-else>...</span>
    </UiButton1>
    <UiButton1
      class="pagination__control"
      variant="outline"
      theme="transparent"
      icon-left="arrow-right"
      :icon-size="24"
      size="small"
      @click="handleNext"
      :disabled="!nextAvailable"
    ></UiButton1>
  </div>
</template>

<script setup lang="ts">
interface PaginationValue {
  count: number | null
  limit: number
  page: number
}

const props = defineProps<{
  value: PaginationValue
}>()

const emit = defineEmits(['onChange'])

const countWithLimit = computed(() => {
  const { count, limit } = props.value

  if (!count) {
    return 0
  }

  return Math.ceil(count / limit)
})

const items = computed(() => {
  const { page, count, limit } = props.value
  const pages = [5, 7]

  return paginationBuilder(page, countWithLimit.value, pages[0], pages[1])
})

const prevAvailable = computed(() => {
  return props.value.page > 1
})

const nextAvailable = computed(() => {
  return props.value.page < countWithLimit.value
})

const handlePrev = () => {
  if (prevAvailable.value) {
    emit('onChange', props.value.page - 1)
  }
}
const handlePageSelect = (item) => {
  emit('onChange', item)
}
const handleNext = () => {
  if (nextAvailable.value) {
    emit('onChange', props.value.page + 1)
  }
}

const paginationBuilder = (
  currentPage: number,
  pageCount: number,
  pagesShown: number,
  minPageSize: number,
) => {
  const getRange = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const clamp = (number: number, lower: number, upper: number) => {
    return Math.min(Math.max(number, lower), upper)
  }

  let delta
  currentPage = clamp(currentPage, 1, pageCount)
  pagesShown = clamp(pagesShown, minPageSize, pageCount)
  const centerPagesShown = pagesShown - 5
  const boundaryPagesShown = pagesShown - 3

  if (pageCount <= pagesShown) {
    delta = pagesShown
  } else {
    delta =
      currentPage < boundaryPagesShown || currentPage > pageCount - boundaryPagesShown
        ? boundaryPagesShown
        : centerPagesShown
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  }

  let pages =
    currentPage > delta
      ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1))

  if (currentPage > pageCount - boundaryPagesShown && pageCount > pagesShown) {
    pages = getRange(pageCount - delta, pageCount)
  }

  const withDots = (value: number, pair: any) => (pages.length + 1 !== pageCount ? pair : [value])
  const lastPage = pages[pages.length - 1]

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages)
  }

  if (lastPage && lastPage < pageCount) {
    pages = pages.concat(withDots(pageCount, ['...', pageCount]))
  }

  return pages
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 6px;

  :deep(.ui-button) {
    &.pagination__item:not(.pagination__item--separator) {
      &:hover {
        color: #373f54 !important;
        border-color: #1a8ff2 !important;
      }

      &:focus-visible {
        background: #ffffff !important;
        border-color: #1a8ff2 !important;
      }
    }
  }

  &__item {
    padding: 5px !important;
    min-width: 32px;
    border: 1px solid #d5dde3 !important;
    color: #373f54 !important;
    font-weight: 400;

    &--active {
      background: #ffffff;
      color: #1a8ff2 !important;
      border-color: #1a8ff2 !important;
    }

    &--separator {
      pointer-events: none;
      border: none !important;
      background: transparent !important;
    }
  }

  &[data-pages='0'],
  &[data-pages='1'] {
    .pagination__item._separator {
      display: none;
    }
  }
}
</style>
