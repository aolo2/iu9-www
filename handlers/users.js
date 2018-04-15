const basic_auth = require('basic-auth')
const uuid = require('uuid/v1')
const common = require('./common')
const db = require('../lib/db')
const security = require('../lib/security')
const config = require('../config/config.json')

function signup(req, res) {
  const user = {
    'login': req.body.login,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'role': req.body.role
  }

  const raw_pass = req.body.pass

  if (raw_pass && user.login && user.role && user.first_name && user.last_name) {
    const saltHash = security.saltHashPassword(raw_pass, config.salt_length)
    db.addUser(user, saltHash.hash, saltHash.salt, (err) => {
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
    if (userDb && security.checkPassword(user.pass, userDb.passwordSalt, userDb.passwordHash)) {
      req.authChecked = true
      
      const session = uuid()

      db.openSession(session, userDb, (err) => {
        if (err) {
          common.send_error_response(res, 'could not open session: ' + err.message)
          return
        }
        res.cookie('SESSIONID', session, {httpOnly: true, maxAge: 86400 * 1000})
        res.cookie('UIVIEW', userDb.role, {httpOnly: false, maxAge: 86400 * 1000})
        common.send_text_response(res, 200)
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
      res.clearCookie('UIVIEW')
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

  db.validateSession(req.cookies.SESSIONID, null, (err, user) => {
    if (err || !user.valid) {
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
module.exports.auth_check_middleware = auth_check_middleware