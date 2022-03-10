const Ajv = require('ajv')
const AjvKeywords = require('ajv-keywords')

const { getType } = require('./types')

const data = {
  code: 1,
  data: [
    {
      detalhes: [
        {
          motivo: 'Sem Match de palavras',
          status: 'aprovado',
          id_captura: 1,
          id_pesquisa_consulta: 21401,
        },
      ],
      id_dossie: 21401,
      workflowStatus: 'aprovado',
    },
  ],
  status: 200,
  message: 'OK',
}

const genSchema = (obj) => {
  const getProperties = (schema) =>
    Object.entries(schema).reduce((acc, [key, val]) => {
      const type = getType(val)

      const items = type === 'array' ? { items: genSchema(val[0]) } : {}

      return {
        ...acc,
        [key]: { type: getType(val), ...items },
      }
    }, {})

  const properties = getProperties(obj)
  const type = getType(obj)

  return {
    type,
    properties,
  }
}

const schema = genSchema(data)

console.log('SCHEMA ::: ', JSON.stringify(schema, null, 2))

const ajv = new Ajv()
AjvKeywords(ajv)

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
