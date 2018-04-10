const basic_auth = require('basic-auth')
const db = require('../lib/db')
const security = require('../lib/security')
const common = require('./common')

function signup(req, res) {
  const name = req.body.name
  const pass = req.body.pass
  if (name && pass) {
    const saltHash = security.saltHashPassword(pass, 10)
    db.addUser(name, saltHash.hash, saltHash.salt, (err, result) => {
      if (err) {
        common.send_error_response(res, err.message)
        return
      }
      common.send_text_response(res, 200, 'success')
    })
  } else {
    common.send_bad_request_response(res)
  }
}

function restore(req, res) {
  // TODO(aolo2)
}

function get_news(req, res) {
  db.getNews((err, news) => {
    if (err) {
      common.send_error_response(res, err.message)
      return
    }
    common.send_text_response(res, 200, news)
  })
}

function post_news(req, res) {
  db.postNews(() => {
    common.send_text_response(res, 200) 
  })
}

function auth_check_middleware(req, res, next) {
  if (req.authChecked) {
    next()
    return
  }
  const user = basic_auth(req)
  if (!user) {
    common.send_bad_login_response(res)
    return
  }
  db.getUser(user.name, (err, userDb) => {
    if (err) {
      common.send_bad_login_response(res)
      return
    }
    if (userDb && security.checkPassword(user.pass, userDb.passwordSalt,  userDb.passwordHash)) {
      req.userDb = userDb
      req.authChecked = true
      next()
    } else {
      common.send_bad_login_response(res)
    }
  }) 
}

module.exports.signup = signup
module.exports.restore = restore
module.exports.get_news = get_news
module.exports.post_news = post_news
module.exports.auth_check_middleware = auth_check_middleware