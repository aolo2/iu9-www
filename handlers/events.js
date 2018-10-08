const db = require('../lib/db')
const common = require('./common')

function create(req, res) {
  db.createEvent(req.body.event, (err, result) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, {'eventId': result.insertedId})
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
