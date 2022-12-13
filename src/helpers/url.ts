import { isDate, isPlainObject } from './util'

function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) return url

  const parts: string[] = []

  Object.entries(params).forEach(([k, v]) => {
    if (v === null || typeof v === 'undefined') {
      return
    }
    let values: any = []
    if (Array.isArray(v)) {
      values = v
      k += '[]'
    } else {
      values = [v]
    }

    values.forEach(v2 => {
      if (isDate(v2)) {
        v2 = v2.toISOString()
      } else if (isPlainObject(v2)) {
        v2 = JSON.stringify(v2)
      }
      parts.push(`${encode(k)}=${encode(v2 as string)}`)
    })
  })

  const serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (!url.includes('?') ? '?' : '&') + serializedParams
  }

  return url
}
