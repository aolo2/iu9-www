const common = require('./common')

function send_message(req, res) {
  common.send_text_response(res, 200)
}

function create_dialog(req, res) {
  common.send_text_response(res, 200)
}

function delete_dialog(req, res) {
  common.send_text_response(res, 200)
}

module.exports.send_message = send_message
module.exports.create_dialog = create_dialog
module.exports.delete_dialog = delete_dialog