export default class Cancel extends Error {}

export function isCancel(val: any): boolean {
  return val instanceof Cancel
}
