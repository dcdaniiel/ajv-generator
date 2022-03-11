const {
  isEmpty,
  isArray,
  isObject,
  isString,
  isNumber,
  isBoolean,
} = require('lodash')

const date = (val) => {
  if (isEmpty(val)) return false

  return {
    valid: date,
  }
}

const getType = (val) => {
  if (isArray(val)) return 'array'
  if (isObject(val)) return 'object'
  if (isString(val)) return 'string'
  if (isNumber(val)) return 'number'
  if (isBoolean(val)) return 'boolean'

  throw new Error(`Type ${val} not valid!`)
}

const format = (val) => {
  if (date(val)) {
    return 'date'
  }
}

module.exports = { getType, format }
