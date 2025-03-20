import { SystemColorsValue, systemColorsMap } from '@/core/constants/SystemColors'
import type { SystemColor } from '@/core/constants/SystemColors'

export const getSystemColor = (colorCode: SystemColorsValue): SystemColor => {
  return systemColorsMap[colorCode] || ''
}
