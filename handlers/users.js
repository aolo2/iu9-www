const common = require('./common')
const db = require('../lib/db')
const security = require('../lib/security')
const validation = require('../lib/validation')

const uuid = require('uuid/v4')
const basic_auth = require('basic-auth')

function signup(req, res) {
  const pass = security.saltHashPassword(req.body.pass, 10)
  const user = {
    'first_name': req.body.first_name, 
    'last_name': req.body.last_name,
    'login': req.body.login,
    'roles': req.body.roles,
    'passwordHash': pass.hash,
    'passwordSalt': pass.salt
  }

  db.add_user_application(user, (err) => {
    if (err) {
      common.send_error_response(res, 'could not create application: ' + err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function login(req, res) {
  const user = basic_auth(req)
  db.get_user(user.name, (err, user_db) => {
    if (err) {
      common.send_error_response(res, 'could not find user: ' + err.message)
      return
    } 

    if (!user_db || !security.checkPassword(user.pass, user_db.passwordSalt, user_db.passwordHash)) {
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
      res.cookie('UIVIEW', user_db.roles.join(','), {httpOnly: false, maxAge: 86400 * 1000})
      common.send_text_response(res, 200)
    })
  })
}

function logout(req, res) {
  db.close_session(req.session_id, (err) => {
    if (err) {
      common.send_error_response(res, 'could not close session: ' + err.message)
    } else {
      res.clearCookie('SESSIONID')
      res.clearCookie('UIVIEW')
      common.send_text_response(res, 200)
    }
  })
}

function get_applications(req, res) {
  db.get_user_applications((err, applications) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, applications)
    }
  })
} 

function approve_application(req, res) {
  db.approve_application(req.body['_id'], (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (req.body.approve) {
      db.add_user(req.body, (err) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          common.send_text_response(res, 200)
        }
      })
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function edit_profile(req, res) {
  common.send_text_response(res, 200)  
}

function access_check_middleware(req, res, next) {
  const session_id = req.cookies.SESSIONID
  
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
