const redis_client = require('./redis-client').init()
const mongo_client = require('./mongo-client').init()
// const uuid = require('uuid/v4')

function create_role(role, callback) {
  mongo_client.create_role(role, callback)
}

function add_user(user, callback) {
  mongo_client.add_user(user, callback)
}

function get_user(login, callback) {
  mongo_client.get_user(login, callback)
}

function open_session(session_id, user_data, callback) {
  let user_copy = JSON.parse(JSON.stringify(user_data))
  delete user_copy['_id']
  delete user_copy['passwordHash']
  delete user_copy['passwordSalt']

  redis_client.set(session_id, JSON.stringify(user_copy), (err) => {
    if (err) {
      callback(err)
    } else {
      redis_client.expire(session_id, 86400, callback)
    }
  })
}

function get_session(session_id, callback) {
  redis_client.get(session_id, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    if (!result) {
      callback(new Error('no such session'))
      return
    }

    callback(null, JSON.parse(result))
  })
}

function close_session(session_id, callback) {
  redis_client.del(session_id, callback)
}

function get_roles(titles, callback) {
  // redis_client.get(role_prefix + title, (err, result) => 
    // callback(err, JSON.parse(result))
  // )

  mongo_client.get_roles(titles, callback)
}

const role_prefix = '#roles:'

module.exports.create_role = create_role
module.exports.add_user = add_user
module.exports.get_user = get_user
module.exports.open_session = open_session
module.exports.get_session = get_session
module.exports.close_session = close_session
module.exports.get_roles = get_roles
