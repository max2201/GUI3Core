export interface IApiDto {
  Result: any
  ApiKey: string
  ApiVersion: string
  Method: string
  Errors: any[]
  Duration: number
}

export interface IError {
  message: string
  code?: string | number
}

export interface IApiResponse<T> {
  data: T | null
  error: IError | null
}
