export const shortenString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str // вернуть исходную строку, если она короче или равна максимальной длине
  } else {
    return str.substring(0, maxLength) + '...' // вернуть обрезанную строку с тремя точками, если ее длина превышает максимальную длину
  }
}
