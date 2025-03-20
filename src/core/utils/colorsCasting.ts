export const colorsCasting = (type: number): string => {
  switch (type) {
    case 0:
      return '#acdae6'
    case 1:
      return '#ff7373'
    case 2:
      return '#67e667'
    case 3:
      return '#ffb610'
    case 4:
      return '#cccedb'
    case 5:
      return '#00a6d0'
    case 6:
      return '#00ffff'
    case 7:
      return '#ee82ee'
    case -1:
      return ''
    default:
      return ''
  }
}
