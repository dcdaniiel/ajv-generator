const { isArray } = require('lodash')
const {
  isObject,
  isString,
  isDate,
  isNumber,
  isBoolean,
} = require('lodash/lang')

const string = (val) => {}

const number = (val) => {}

const datetime = (val) => {}

const getType = (val) => {
  if (isArray(val)) return 'array'
  if (isObject(val)) return 'object'
  if (isString(val)) return 'string'
  if (isNumber(val)) return 'number'
  if (isDate(val)) return 'timestamp'
  if (isBoolean(val)) return 'boolean'

  throw new Error(`Type ${val} not valid!`)
}

module.exports = { getType }
