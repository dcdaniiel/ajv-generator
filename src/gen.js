const Ajv = require('ajv')
const addKeywords = require('ajv-keywords')
const addFormats = require('ajv-formats')

const { isEmpty } = require('lodash')
const { getType, format } = require('./utils')

const data = {
  data: {
    compositeResponse: [
      {
        body: {
          id: 'a055e000009iuAdAAI',
          errors: [],
          created: false,
          success: true,
        },
        httpHeaders: {
          Location:
            '/services/data/v52.0/sobjects/PedidoEmprestimo__c/a055e000009iuAdAAI',
        },
        referenceId: 'approvalId_12431767',
        httpStatusCode: 200,
      },
      {
        body: {
          id: '0015e00000o8DC0AAM',
          errors: [],
          created: false,
          success: true,
        },
        httpHeaders: {
          Location: '/services/data/v52.0/sobjects/Account/0015e00000o8DC0AAM',
        },
        referenceId: 'refConta',
        httpStatusCode: 200,
      },
    ],
  },
  status: 200,
}

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

const schema = genSchema(data)

console.log('SCHEMA ::: ', JSON.stringify(schema, null, 2))

const ajv = new Ajv()
addKeywords(ajv)
addFormats(ajv)

const validate = ajv.compile(schema)

const valid = validate(data)

console.log('VALIDATE ::: ', { valid })

/*
    {"code": 1, "data": [{"lote": 2430, "status": "1", "sub_of": false, "em_fila": true}], "status": 200, "message": "OK"}
    {"code": 1, "data": [{"detalhes": [{"motivo": "Sem Match de palavras", "status": "aprovado", "id_captura": 1, "id_pesquisa_consulta": 21401}], "id_dossie": 21401, "workflowStatus": "aprovado"}], "status": 200, "message": "OK"}
    {"code": 1, "data": [{"detalhes": [{"motivo": "Nao atendeu nenhuma das regras criadas no workflow", "status": "aprovado", "id_captura": 173, "id_pesquisa_consulta": 21705}], "id_dossie": 21705, "workflowStatus": "aprovado"}], "status": 200, "message": "OK"}
    {"data": {"compositeResponse": [{"body": {"id": "a055e000009iuAdAAI", "errors": [], "created": false, "success": true}, "httpHeaders": {"Location": "/services/data/v52.0/sobjects/PedidoEmprestimo__c/a055e000009iuAdAAI"}, "referenceId": "approvalId_12431767", "httpStatusCode": 200}, {"body": {"id": "0015e00000o8DC0AAM", "errors": [], "created": false, "success": true}, "httpHeaders": {"Location": "/services/data/v52.0/sobjects/Account/0015e00000o8DC0AAM"}, "referenceId": "refConta", "httpStatusCode": 200}]}, "status": 200}
    {"data": {"compositeResponse": [{"body": [{"fields": ["Email__c"], "message": "Campos obrigatórios ausentes: [Email__c]", "errorCode": "REQUIRED_FIELD_MISSING"}], "httpHeaders": {}, "referenceId": "refConta", "httpStatusCode": 400}]}, "status": 200}
 */
