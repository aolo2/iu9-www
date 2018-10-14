const db = require('../lib/db')
const common = require('./common')

const uuidv4 = require('uuid/v4')

function ___addEvent(res, event, users, eventSubjectName, eventTypeName) {
  db.createEvent(event, (err, result) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      db.addEventToUsers(users,
      {
        'subject': eventSubjectName,
        'type': eventTypeName,
        '_id': result.insertedId
      }, (err) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          common.send_text_response(res, 200)
        }
      })
    }
  })
}

function __addEvent(res, event) {
  let rules = []
  if ('tutors' in event.participants) {
    rules.push({'login': {'$in': event.participants.tutors}})
  }

  if ('students' in event.participants) {
    rules.push({'group': {'$in': event.participants.students}})
  }

  db.unwindRules(rules, (err, users) => {

    const eventSubjectName = event['subjectName']
    const eventTypeName = event['typeName']

    let logins = []
    users.forEach((user) => {
      logins.push(user.login)
    })

    event.users = logins

    delete event['subjectName']
    delete event['participants']
    delete event['typeName']

    if (event.chat) {
      db.createChatroom(logins, (err, result) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          event.chatId = result.insertedId
          delete event['chat']
          ___addEvent(res, event, logins, eventSubjectName, eventTypeName)
        }
      })
    } else {
      ___addEvent(res, event, logins, eventSubjectName, eventTypeName)
    }
  })
}

function _addEvent(res, event) {
  db.getEventType(event.type, (err, type) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (!type) {
      event.type = event.typeName
      db.addEventType(event.typeName, (err, typeId) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          __addEvent(res, event)
        }
      })
    } else {
      event.type = event.typeName
      __addEvent(res, event)
    }
  })
}

function create(req, res) {
  db.getEventSubject(req.body.event.subject, (err, subject) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (!subject) {
      req.body.event.subject = req.body.event.subjectName
      db.addEventSubject(req.body.event.subjectName, (err, id) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          _addEvent(res, req.body.event)
        }
      })
    } else {
      req.body.event.subject = req.body.event.subjectName
      _addEvent(res, req.body.event)
    }
  })
}

function getSubjects(req, res) {
  db.getEventSubjects((err, subjects) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, subjects)
    }
  })
}

function getTypes(req, res) {
  db.getEventTypes((err, types) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, types)
    }
  })
}

function start_event(req, res) {
  // change status
  common.send_text_response(res, 200)
}

function edit_event(req, res) {
  // change of status possible =
  common.send_text_response(res, 200)
}

function finishEvent(req, res) {
  db.finishEvent(req.body.eventId, (err, event) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      if ('chatId' in event) { db.closeChat(event.chatId, (err) => {}) } // NOTE(aolo2): async TODO(aolo2, later): err
      db.removeEventFromUsers(req.body.eventId, (err) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          common.send_text_response(res, 200)
        }
      })
    }
  })
}

function getEvent(req, res) {
  db.getEvent(req.query.eventId, (err, event) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (event) {
      common.send_json_response(res, event)
    } else {
      common.send_not_found_response(res)
    }
  })
}

module.exports.create = create
module.exports.start_event = start_event
module.exports.edit_event = edit_event
module.exports.finishEvent = finishEvent
module.exports.getEvent = getEvent
module.exports.getSubjects = getSubjects
module.exports.getTypes = getTypes