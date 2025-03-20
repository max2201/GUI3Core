import { FieldType } from '@/core/constants/FieldType'

export const isFieldIgnoreSubFields = (fieldType: string) => {
  return [FieldType.DriverLicence].some((type) => fieldType.startsWith(type))
}
