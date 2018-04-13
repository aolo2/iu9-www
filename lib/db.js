const redis_client = require('./redis-client').init()
const common = require('./common')

function getUser(username, callback) {
  redis_client.get(username, (err, userDb) => {
    if (err) {
      callback(err)
    } else {
      callback(null, JSON.parse(userDb))
    }
  })
}

function addUser(username, passwordHash, passwordSalt, callback) {
  redis_client.exists(username, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    if (result !== 0) {
      callback(new Error('user exists'))
      return
    } 
    
    const userData = {
        'passwordHash': passwordHash,
        'passwordSalt': passwordSalt
    }

    redis_client.set(username, JSON.stringify(userData), (err, result) => {
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
  redis_client.lpush(id, JSON.stringify(news), (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
}

function getNews(id, callback) {
  redis_client.lrange(id, 0, -1, (err, news) => {
    if (err) {
      callback(err)
      return
    }

    news.forEach((article, idx) => news[idx] = JSON.parse(article))
    callback(null, news)
  })
}

function openSession(session, callback) {
  redis_client.set(session, true, (err, result) =>
     common.err_no_ok(err, result, callback))
}

function closeSession(session, callback) {
  redis_client.del(session, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
}

function validateSession(session, callback) {
  redis_client.exists(session, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    if (result !== 1) {
      callback(null, false)
      return
    }

    callback(null, true)
  })
}

module.exports.getNews = getNews
module.exports.postNews = postNews
module.exports.addUser = addUser
module.exports.getUser = getUser
module.exports.openSession = openSession
module.exports.closeSession = closeSession
module.exports.validateSession = validateSession