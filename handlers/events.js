const formidable = require('formidable')

const db = require('../lib/db')
const config = require('../config/config.json')
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

function attachFile(req, res) {
  let form = new formidable.IncomingForm()

  form.uploadDir = config.formidable.directory
  form.maxFileSize = config.formidable.maxFileSize
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      Object.keys(files).forEach((key) => {
        db.saveFilename(files[key].name, files[key].path, (errDb) => {
          if (errDb) {
            common.send_error_response(res, errDb.message)
          } else {
            common.send_json_response(res, {'path': files[key].path})
          }
        })
      })
    }
  })
}

module.exports.create_event = create_event
module.exports.start_event = start_event
module.exports.edit_event = edit_event
module.exports.delete_event = delete_event
module.exports.attachFile = attachFile