import { isArray, isEmpty, isString, isNull, isObject, isUndefined } from "lodash"

export function required(v) {
  if (isNull(v) || isUndefined(v)) {
    return "This field is required"
  }

  if (v instanceof Date) {
    if (!isNaN(v.getTime())) return true

    return "This field is required"
  }

  if (v instanceof File) {
    if (v.size > 0) return true

    return "This field is required"
  }

  if ((isArray(v) || isString(v) || isObject(v)) && isEmpty(v)) {
    return "This field is required"
  }

  return true
}

export default required
