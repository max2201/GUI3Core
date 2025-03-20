export const toggleArray = (arr: any[], id: number | string) => {
  if (arr.includes(id)) {
    arr = arr.filter((x) => x !== id)
  } else {
    arr = [...arr, ...[id]]
  }

  return arr
}
