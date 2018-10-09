const db = require('../lib/db')
const common = require('./common')

function _addEvent(res, event) {
  let rules = []
  if ('tutors' in event.participants) {
    rules.push({'login': {'$in': event.participants.tutors}})
  }

  if ('students' in event.participants) {
    rules.push({'group': {'$in': event.participants.students}})
  }

  db.unwindRules(rules, (err, users) => {

    event.users = users
    delete event['subjectName']
    delete event['participants']

    db.createEvent(event, (err, result) => {
      if (err) {
        common.send_error_response(res, err.message)
      } else {
        db.addEventToUsers(users, result.insertedId, (err) => {
          if (err) {
            common.send_error_response(res, err.message)
          } else {
            common.send_json_response(res, {'eventId': result.insertedId})
          }
        })
      }
    })
  })
}

function create(req, res) {
  db.getSubject(req.body.event.subject, (err, subject) => {
    if (err) {
      common.send_error_response(res, err.message)
      return
    } else if (!subject) {
      db.addSubject(req.body.event.subjectName, (err, id) => {
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
  db.getSubjects((err, subjects) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, subjects)
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