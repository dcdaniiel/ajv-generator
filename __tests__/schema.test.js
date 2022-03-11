const Ajv = require('ajv')
const addKeywords = require('ajv-keywords')
const addFormats = require('ajv-formats')
const { genSchema } = require('../src/schema')

const ajv = new Ajv()
addKeywords(ajv)
addFormats(ajv)

describe('Schema', () => {
  test('create simple schema', () => {
    const data = {
      foo: 1,
      bar: 'abc',
    }

    const schema = genSchema(data)

    expect(schema).toStrictEqual({
      type: 'object',
      required: ['foo', 'bar'],
      properties: {
        foo: { type: 'number' },
        bar: { type: 'string' },
      },
    })

    const validate = ajv.compile(schema)
    const valid = validate(data)

    expect(valid).toEqual(true)
  })
  test('create nested schema', () => {
    const data = {
      f_number: 1,
      f_array: [
        {
          code: 12,
          status: 'abc',
          bool: false,
          f_object: {
            code: 12,
            status: 'abc',
            nested: {
              code: 12,
              bool: false,
            },
          },
        },
      ],
      f_string: 'OK',
    }

    const schema = genSchema(data)
    const expect_schema = {
      type: 'object',
      required: ['f_number', 'f_array', 'f_string'],
      properties: {
        f_number: {
          type: 'number',
        },
        f_array: {
          type: 'array',
          items: {
            type: 'object',
            required: ['code', 'status', 'bool', 'f_object'],
            properties: {
              code: {
                type: 'number',
              },
              status: {
                type: 'string',
              },
              bool: {
                type: 'boolean',
              },
              f_object: {
                type: 'object',
                required: ['code', 'status', 'nested'],
                properties: {
                  code: {
                    type: 'number',
                  },
                  status: {
                    type: 'string',
                  },
                  nested: {
                    type: 'object',
                    required: ['code', 'bool'],
                    properties: {
                      code: {
                        type: 'number',
                      },
                      bool: {
                        type: 'boolean',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        f_string: {
          type: 'string',
        },
      },
    }

    expect(schema).toStrictEqual(expect_schema)

    const validate = ajv.compile(schema)
    const valid = validate(data)

    expect(valid).toEqual(true)
  })
})
