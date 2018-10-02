const common = require('./common')
const db = require('../lib/db')

function getSource(req, res) {
    common.send_json_response(res, {'md': 'klsjdflksjdfkjsdfklsdjfskllkjsdkfljsd'})
}

function updateSource(req, res) {
    // db.updateEditboxSource()
    /*if (err) {
        common.send_error_response(res, err.message)
      } else {
        common.send_text_response(res, 200)
    }*/
}

module.exports.getSource = getSource