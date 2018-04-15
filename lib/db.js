const redis_client = require('./redis-client').init()
const uuid = require('uuid/v1')
const common = require('./common')
const config = require('../config/config.json')

const session_set_uuid = uuid()

function getUser(username, callback) {
  redis_client.get(username, (err, userDb) => 
    callback(err, JSON.parse(userDb)))
}

function addUser(user, passwordHash, passwordSalt, callback) {
  redis_client.exists(user.login, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    if (result !== 0) {
      callback(new Error('user exists'))
      return
    } 
    
    user['passwordHash'] = passwordHash
    user['passwordSalt'] = passwordSalt

    redis_client.set(user.login, JSON.stringify(user), (err, result) => {
      if (err) {
        callback(err)
        return
      }

      if (result !== 'OK') {
        callback(new Error('result was not OK'))
        return
      }

      callback()
    })
  })
}

function postNews(id, news, callback) {
  redis_client.lpush(id, JSON.stringify(news), (err, result) => callback(err))
}

function getNews(id, callback) {
  redis_client.lrange(id, 0, -1, (err, news) => {
    if (err) {
      callback(err)
    } else {
      news.forEach((article, idx) => news[idx] = JSON.parse(article))
      callback(null, news)
    }
  })
}

function openSession(session, user, callback) {
  redis_client.set(session, JSON.stringify(user), (err, result) => 
     common.err_no_ok(err, result, (err) => {
      if (err) {
        callback(err)
      } else {
        redis_client.expire(session, 24 * 3600, (err, result) => callback(err))
      }
    })
  )
}

function closeSession(session, callback) {
  redis_client.del(session, (err, result) => callback(err))
}

function validateSession(session, role, callback) {
  redis_client.get(session, (err, result) => {
    result = JSON.parse(result)
    result['valid'] = (!role || result.role <= role)
    callback(err, result)
  })
}

module.exports.getNews = getNews
module.exports.postNews = postNews
module.exports.addUser = addUser
module.exports.getUser = getUser
module.exports.openSession = openSession
module.exports.closeSession = closeSession
module.exports.validateSession = validateSession