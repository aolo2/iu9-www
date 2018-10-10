const common = require('./common')
const db = require('../lib/db')
const security = require('../lib/security')
const validation = require('../lib/validation')
const config = require('../config/config.json')

const uuid = require('uuid/v4')
const basic_auth = require('basic-auth')

function add(req, res) {
  const pass = security.saltHashPassword(req.body.pass, config.saltLength)
  let user = {
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'login': req.body.login,
    'roles': req.body.roles, // NOTE(aolo2): this is a trusted request
    'passwordHash': pass.hash,
    'passwordSalt': pass.salt
  }

  if ('group' in req.body) {
    user.group = req.body.group
  }

  db.addUser(user, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}


function signup(req, res) {
  const pass = security.saltHashPassword(req.body.pass, config.saltLength)
  const user = {
    'first_name': req.body.first_name.trim(),
    'last_name': req.body.last_name.trim(),
    'login': req.body.login.trim(),
    'group': req.body.group,
    'roles': ['student'],
    'passwordHash': pass.hash,
    'passwordSalt': pass.salt
  }

  if (user.first_name.length > config.maxFirstnameLength) {
    common.send_bad_request_response(res, 'first name too long')
    return
  }

  if( user.last_name.length > config.maxLastnameLength) {
    common.send_bad_request_response(res, 'last name too long')
    return
  }

  if (user.login.length > config.maxLoginLength) {
    common.send_bad_request_response(res, 'login too long')
    return
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

  if (!user) {
    common.send_bad_request_response(res)
  }

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
  db.approveApplication(req.body['id'], (err, result) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (req.body.approve) {
      db.addUser(result.value, (err) => {
        if (err) {

          if (err.code === 11000) {
            err.message = 'user exists'
          }

          db.add_user_application(result.value, (errReadd) => {
            if (errReadd) {
              common.send_error_response(res, err.message + ' AND ' + errReadd.meessage)
            } else {
              common.send_error_response(res, err.message)
            }
          })


        } else {
          common.send_text_response(res, 200)
        }
      })
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function get(req, res) {
  let matchQuery = {}

  if ('group' in req.query) {
    matchQuery.group = req.query.group
  }

  if ('role' in req.query) {
    matchQuery.roles = req.query.role
  }

  db.getUsers(matchQuery, (err, users) => {

    users.forEach((doc) => {
      delete doc['_id']
      delete doc['passwordSalt']
      delete doc['passwordHash']
      delete doc['roles']
    })

    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, users)
    }
  })
}

function getGroups(req, res) {
  db.getGroups((err, groups) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, groups)
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

function getEvents(req, res) {
  db.getUserEvents(req.user_db.login, (err, user) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      const events = ('events' in user ? user['events'] : [])
      common.send_json_response(res, {'events': events})
    }
  })
}

module.exports.signup = signup
module.exports.login = login
module.exports.logout = logout
module.exports.add = add
module.exports.get_applications = get_applications
module.exports.approve_application = approve_application
module.exports.edit_profile = edit_profile
module.exports.get = get
module.exports.access_check_middleware = access_check_middleware
module.exports.getGroups = getGroups
module.exports.getEvents = getEvents