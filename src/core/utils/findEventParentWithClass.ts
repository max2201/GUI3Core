export const findEventParentWithClass = (event: MouseEvent, searchClass: string) => {
  if (!event) {
    return false
  }

  const target = event?.target as HTMLElement

  if (target && target.className && target.className?.includes?.(searchClass)) {
    return target
  }

  let parentElement = target.parentElement

  while (parentElement) {
    if (parentElement.className?.includes?.(searchClass)) {
      return parentElement
    }

    parentElement = parentElement.parentElement
  }

  return undefined
}