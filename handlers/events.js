const db = require('../lib/db')
const common = require('./common')

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

    event.users = users
    delete event['subjectName']
    delete event['participants']
    delete event['typeName']

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
  })
}

function _addEvent(res, event) {
  db.getEventType(event.type, (err, type) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else if (!type) {
      db.addEventType(event.typeName, (err, typeId) => {
        event.type = typeId
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          __addEvent(res, event)
        }
      })
    } else {
      __addEvent(res, event)
    }
  })
}

function create(req, res) {
  db.getEventSubject(req.body.event.subject, (err, subject) => {
    if (err) {
      common.send_error_response(res, err.message)
      return
    } else if (!subject) {
      db.addEventSubject(req.body.event.subjectName, (err, id) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          req.body.event.subject = id
          _addEvent(res, req.body.event)
        }
      })
    } else {
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

function delete_event(req, res) {
  // just changes status = canceled
  common.send_text_response(res, 200)
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
module.exports.delete_event = delete_event
module.exports.getEvent = getEvent
module.exports.getSubjects = getSubjects
module.exports.getTypes = getTypes