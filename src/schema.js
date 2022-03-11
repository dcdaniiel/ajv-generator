const { isEmpty } = require('lodash')
const { getType, format } = require('./utils')

const genSchema = (obj) => {
  const getConfig = (type, val) => {
    switch (type) {
      case 'array':
        if (isEmpty(val[0])) {
          return ''
        }
        return {
          items: genSchema(val[0]),
        }

      case 'object':
        return genSchema(val)

      // case 'string':
      //   return {
      //     format: format(val),
      //   }

      default:
        return {}
    }
  }

  const getProperties = (schema) =>
    Object.entries(schema).reduce((acc, [key, val]) => {
      const type = getType(val)

      return {
        ...acc,
        [key]: { type: getType(val), ...getConfig(type, val) },
      }
    }, {})

  const type = getType(obj)

  const result = { type }

  if (type === 'string') {
    result.format = format(obj)
  } else {
    result.required = Object.keys(obj)
    result.properties = getProperties(obj)
  }

  return result
}

module.exports = { genSchema }
