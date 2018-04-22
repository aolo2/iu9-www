const common = require('./common')
const db = require('../lib/db')

function get_roles(req, res) {
  common.send_text_response(res, 200)
}

function create_role(req, res) {
  db.create_role(req.body, (err) => {
    if (err) {
      common.send_error_response(res, 'could not create role: ' + err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function edit_role(req, res) {
  common.send_text_response(res, 200)
}

function delete_role(req, res) {
  common.send_text_response(res, 200)
}

module.exports.get_roles = get_roles
module.exports.create_role = create_role
module.exports.edit_role = edit_role
module.exports.delete_role = delete_role