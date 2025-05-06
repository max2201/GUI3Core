export interface ObjectFieldValuesItem {
  Value: string
  Title: string
  Key: string // is key show which subitem used with the value
}

export interface ObjectField {
  id: string
  title: string
  disabled: boolean
  type: number
  values: ObjectFieldValuesItem[]
  currentVal: string
  defaultVal: string
  subItems: ObjectField[]
  editing?: boolean
  initialValue?: any
}
