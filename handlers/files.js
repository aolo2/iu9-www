const formidable = require('formidable')

const db = require('../lib/db')
const common = require('./common')
const config = require('../config/config.json')

function upload(req, res) {
  let form = new formidable.IncomingForm()

  form.uploadDir = config.formidable.directory
  form.maxFileSize = config.formidable.maxFileSize
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      let fileInfo = []
      Object.keys(files).forEach((key) => {
        fileInfo.push({'name': files[key].name, 'path': files[key].path})
      })

      db.saveFilenames(fileInfo, (errDb) => {
        if (errDb) {
            common.send_error_response(res, errDb.message)
          } else {
            common.send_json_response(res, fileInfo)
          }
      })
    }
  })
}

module.exports.upload = upload