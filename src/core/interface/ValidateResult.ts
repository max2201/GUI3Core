import type { ValidErrorCodes } from '@/core/constants/ValidErrorCodes'

enum FieldValidStates {
  Unknown = -1,
  FAIL = 0,
  Warning = 1,
  Valid = 2,
}

export interface ValidateResult {
  Results: Array<{
    FieldCode: string
    FieldTitle: string
    Value: string
    ErrorDesription: string
    State: FieldValidStates
    ErrorCode: ValidErrorCodes
    FieldType: number
    IsRequired?: boolean
  }>
  TotalOk: boolean
  FailCount: number
  WarningCount: number
  ValidCount: number
}
export interface ValidateResultSimple {
  ErrorFieldCodes: Array<string>
  ErrorMessage: string
  FullValid: boolean
}
