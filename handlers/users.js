const basic_auth = require('basic-auth')
const uuid = require('uuid/v1')
const common = require('./common')
const db = require('../lib/db')
const security = require('../lib/security')
const config = require('../config/config.json')

function signup(req, res) {
  const name = req.body.name
  const pass = req.body.pass
  if (name && pass) {
    const saltHash = security.saltHashPassword(pass, config.salt_length)
    db.addUser(name, saltHash.hash, saltHash.salt, (err) => {
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

function login(req, res) {
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
      req.authChecked = true

      const session = uuid()
      db.openSession(session, (err) => {
        if (err) {
          common.send_error_response(res, 'could not open session: ' + err.message)
          return
        }
        res.cookie('SESSIONID', session)
        common.send_text_response(res, 200, 'OK')
      })
    } else {
      common.send_bad_login_response(res)
    }
  }) 
}

function logout(req, res) {
  db.closeSession(req.cookies.SESSIONID, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      res.clearCookie('SESSIONID')
      common.send_text_response(res, 200, 'OK')
    }
  })
}

function get_news(req, res) {
  db.getNews(common.news_uuid, (err, result) => {
    if (err) {
      common.send_error_response(res, err.message)
      return
    }

    common.send_json_response(res, result)
  })
}

function post_news(req, res) {
  if (!req.body.news) {
    common.send_bad_request_response(res)
    return
  }

  db.postNews(common.news_uuid, req.body.news, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function auth_check_middleware(req, res, next) {
  if (req.authChecked) {
    next()
    return
  }

  if (!req.cookies.SESSIONID) {
    common.send_bad_login_response(res)
    return
  }

  db.validateSession(req.cookies.SESSIONID, (err, result) => {
    if (err || !result) {
      common.send_bad_login_response(res)
    } else {
      req.authChecked = true
      next()
    }
  })  
}

module.exports.login = login
module.exports.logout = logout
module.exports.signup = signup
module.exports.get_news = get_news
module.exports.post_news = post_news
module.exports.auth_check_middleware = auth_check_middleware