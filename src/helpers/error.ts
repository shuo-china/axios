import type { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  public isAxiosError: boolean

  constructor(
    message: string,
    public config: AxiosRequestConfig,
    public code?: string | null,
    public request?: any,
    public response?: AxiosResponse
  ) {
    super(message)
    this.isAxiosError = true
  }
}

export function createError(
  message,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  return new AxiosError(message, config, code, request, response)
}
