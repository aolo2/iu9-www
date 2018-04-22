const common = require('./common')
const db = require('../lib/db')
const security = require('../lib/security')
const validation = require('../lib/validation')
const uuid = require('uuid/v4')

function signup(req, res) {
  const pass = security.saltHashPassword(req.body.pass, 10)
  const user = {
    'login': req.body.login,
    'roles': req.body.roles,
    'passwordHash': pass.hash,
    'passwordSalt': pass.salt
  }

  db.add_user(user, (err) => {
    if (err) {
      common.send_error_response(res, 'could not create user: ' + err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function login(req, res) {
  db.get_user(req.body.login, (err, user_db) => {
    if (err) {
      common.send_error_response(res, 'could not find user: ' + err.message)
      return
    } 

    if (!user_db || !security.checkPassword(req.body.pass, user_db.passwordSalt, user_db.passwordHash)) {
      common.send_unauthorized_response(res, 'user not found or the password is incorrect')
      return
    }

    const session_id = uuid()
    db.open_session(session_id, user_db, (err) => {
      if (err) {
        common.send_error_response(res, 'could not open session: ' + err.message)
        return
      }

      res.cookie('SESSIONID', session_id, {httpOnly: true, maxAge: 86400 * 1000})
      res.cookie('UIVIEW', user_db.roles, {httpOnly: false, maxAge: 86400 * 1000})
      common.send_text_response(res, 200)
    })
  })
}

function logout(req, res) {
  db.close_session(req.session_id, (err) => {
    if (err) {
      common.send_error_response(res, 'could not close session: ' + err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function get_applications(req, res) {
  common.send_text_response(res, 200)
} 

function approve_application(req, res) {
  common.send_text_response(res, 200) 
}

function edit_profile(req, res) {
  common.send_text_response(res, 200)  
}

function access_check_middleware(req, res, next) {
  const session_id = req.body.session_id //req.cookies.SESSIONID

  if (!session_id) {
    common.send_unauthorized_response(res)
    return
  }

  db.get_session(session_id, (err, user_db) => {
    if (err) {
      common.send_unauthorized_response(res, 'could not validate session: ' + err.message)
      return
    }

    req.user_db = user_db
    req.session_id = session_id

    validation.check(req, (err) => {
      if (err) {
        common.send_forbidden_response(res, err.message)
      } else {
        next()
      }
    })
  })
}

module.exports.signup = signup
module.exports.login = login
module.exports.logout = logout
module.exports.get_applications = get_applications
module.exports.approve_application = approve_application
module.exports.edit_profile = edit_profile
module.exports.access_check_middleware = access_check_middleware
