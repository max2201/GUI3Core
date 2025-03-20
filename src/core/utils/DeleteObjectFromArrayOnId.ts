export const DeleteObjectFromArrayOnId = (
  array: Array<object>,
  idsToDelete: Array<number>
): Array<object> => {
  return array.filter((obj) => !idsToDelete.includes(obj.id))
}
