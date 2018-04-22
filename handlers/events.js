const common = require('./common')

function create_event(req, res) {
  common.send_text_response(res, 200)
}

function start_event(req, res) {
  common.send_text_response(res, 200)
}

function edit_event(req, res) {
  common.send_text_response(res, 200)
}

function delete_event(req, res) {
  common.send_text_response(res, 200)
}

module.exports.create_event = create_event
module.exports.start_event = start_event
module.exports.edit_event = edit_event
module.exports.delete_event = delete_event