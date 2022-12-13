const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function deepMerge(...objs: any[]) {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.entries(obj).forEach(([k, v]) => {
        if (isPlainObject(v)) {
          if (isPlainObject(result[k])) {
            result[k] = deepMerge(result[k], v)
          } else {
            result[k] = deepMerge(v)
          }
        } else {
          result[k] = v
        }
      })
    }
  })

  return result
}
