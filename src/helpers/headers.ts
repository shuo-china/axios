import type { Method } from 'src/types'
import { deepMerge, isPlainObject } from './util'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name]
      Reflect.deleteProperty(headers, name)
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  const parsed = {}
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [k, v] = line.split(':')
    k = k.trim().toLowerCase()
    if (!k) return
    if (v) {
      v = v.trim()
    }

    Reflect.set(parsed, k, v)
  })

  return parsed
}

export function flattenHeaders(headers: any, method: Method) {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = [
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch',
    'common'
  ]
  methodsToDelete.forEach(method => {
    Reflect.deleteProperty(headers, method)
  })

  return headers
}
