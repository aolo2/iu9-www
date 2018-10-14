const Ajv = require('ajv')
const db = require('./db')

const ajv = new Ajv({$data: true})

function untemplate(schema) {
  return JSON.parse(JSON.stringify(schema).split('_$data').join('$data'))
}

function valid(object, schema, callback) {
  schema = untemplate(schema)
  return ajv.validate(schema, object)
}

function check(request, callback) {
  if (request.url === '/favicon.ico') {
    callback()
    return
  }

  const req_uri = request.method + request.url
  const user = request.user_db

  db.get_roles(user['roles'], (err, roles) => {
    if (err) {
      callback(err)
      return
    }

    if (!roles) {
      callback(new Error('no such roles: ' + user['roles']))
      return
    }

    for (let role of roles) {
      const rule = role['requests']
      if (req_uri in rule) {
        if (!rule[req_uri]['available']) {
          continue
        } else {
          callback()
          return
        }
      } else {
        continue
      }
    }

    callback(new Error('prohibited'))
  })
}

module.exports.check = check