<template>
  <div class="scrollbar" :class="[`_${direction}`]" v-bind="$attrs">
    <div class="scrollbar__wrapper" @click="onScrollbarWrapperClick">
      <div
        ref="scrollbarThumb"
        class="scrollbar__thumb"
        :style="thumbStyle"
        @mousedown="handleTouchStart"
        @mouseup="handleTouchEnd"
        @click.stop.prevent
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  direction: 'x' | 'y'
  scroll: number
  offset?: number
  domRef: HTMLElement
}>()

const resizer = ref<{
  pageX: number
  pageY: number
}>({
  pageX: 0,
  pageY: 0,
})

const isScrollingThumb = ref(false)
const handleTouchStart = (e: MouseEvent) => {
  isScrollingThumb.value = true
  resizer.value.pageX = e.pageX
  resizer.value.pageY = e.pageY
}
const scrollbarThumb = ref<HTMLElement>()

const handleThumbMove = (e: MouseEvent) => {
  if (!isScrollingThumb.value) {
    return
  }

  const diffX = e.pageX - resizer.value.pageX
  const diffY = e.pageY - resizer.value.pageY

  if (props.direction === 'y') {
    if (diffX >= 40) {
      handleTouchEnd()
    }

    const domBbox = props.domRef.getBoundingClientRect()
    const visibleHeight = props.domRef.clientHeight
    const scrollHeight = props.domRef.scrollHeight
    const thumbRatio = visibleHeight / scrollHeight
    const scrollPercent = ((e.pageY - domBbox.top) / visibleHeight) * (1 - thumbRatio)
    const scrollPosition = scrollHeight * scrollPercent

    // eslint-disable-next-line vue/no-mutating-props
    props.domRef.scrollTop = scrollPosition
  } else if (props.direction === 'x') {
    if (diffY >= 40) {
      handleTouchEnd()
    }
    const domBbox = props.domRef.getBoundingClientRect()
    const visibleHeight = props.domRef.clientWidth
    const scrollHeight = props.domRef.scrollWidth
    const thumbRatio = visibleHeight / scrollHeight
    const scrollPercent = ((e.pageX - domBbox.top) / visibleHeight) * (1 - thumbRatio)
    const scrollPosition = scrollHeight * scrollPercent

    // eslint-disable-next-line vue/no-mutating-props
    props.domRef.scrollLeft = scrollPosition
  }
}

const handleTouchEnd = () => {
  isScrollingThumb.value = false
  resizer.value.pageX = 0
  resizer.value.pageY = 0
}

const thumbStyle = computed(() => {
  const getThumbStyle = (avail, scroll) => {
    const offset = props.offset || 0
    const availableWithOffset = avail - offset
    const thumbRatio = avail / scroll
    const thumbMoveSpace = 100 - thumbRatio * 100
    const scrolledPercent = props.scroll / (scroll - availableWithOffset)
    const verticalThumbOffset = scrolledPercent * (availableWithOffset * (thumbMoveSpace / 100))

    return {
      ratio: `${thumbRatio * 100}%`,
      opacity: thumbRatio === 1 ? 0 : 1,
      transform: `${verticalThumbOffset}px`,
    }
  }

  if (props.direction === 'x') {
    const visibleHeight = props.domRef.clientWidth
    const scrollHeight = props.domRef.scrollWidth
    const { ratio, transform, ...style } = getThumbStyle(visibleHeight, scrollHeight)

    return {
      ...style,
      width: ratio,
      transform: `translate(${transform}, -50%)`,
    }
  } else if (props.direction === 'y') {
    const visibleHeight = props.domRef.clientHeight
    const scrollHeight = props.domRef.scrollHeight
    const { ratio, transform, ...style } = getThumbStyle(visibleHeight, scrollHeight)

    return {
      ...style,
      height: ratio,
      transform: `translate(-50%, ${transform})`,
    }
  }
})

const onScrollbarWrapperClick = (event: MouseEvent) => {
  if (!event?.target || (event.target as HTMLElement).className !== 'scrollbar__wrapper') {
    return
  }

  if (!scrollbarThumb.value) {
    return
  }

  isScrollingThumb.value = true
  handleThumbMove(event)
  handleTouchEnd()
}

onMounted(() => {
  document.addEventListener('mousemove', handleThumbMove)
  document.addEventListener('mouseup', handleTouchEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleThumbMove)
  document.removeEventListener('mouseup', handleTouchEnd)
})
</script>

<style lang="scss" scoped>
.scrollbar {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 3;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  &__wrapper {
    position: relative;
    flex: 1 0 auto;
  }
  &__thumb {
    position: absolute;
    // transform: translate(-50%, 0);
    background: #cad2d7;
    border-radius: 8px;
    will-change: transform;
    cursor: pointer;
    transition: background 0.1s ease;
    &:hover {
      background: darken(#cad2d7, 10%);
    }
  }
  &._x {
    left: 0;
    right: 0;
    bottom: 0;
    height: 15px;
    .scrollbar__thumb {
      height: 5px;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }
  }
  &._y {
    top: 0;
    bottom: 0;
    right: 0;
    width: 15px;
    // border-left-color: var(--color-border);
    // border-right-color: var(--color-border);
    .scrollbar__thumb {
      top: 0;
      left: 50%;
      width: 5px;
      transform: translate(-50%, 0);
    }
  }
}
</style>
