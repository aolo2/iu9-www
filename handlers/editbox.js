const common = require('./common')
const db = require('../lib/db')

function getSource(req, res) {
    db.getEditboxSource(req.query.boxId, (err, doc) => {
        if (err) {
            common.send_error_response(res, err.message)
        } else {
            common.send_json_response(res, {'md': doc.markdown})
        }
    })
}

function updateSource(req, res) {
    db.updateEditboxSource(req.body.boxId, req.body.md, (err) => {
        if (err) {
            common.send_error_response(res, err.message)
        } else {
            common.send_text_response(res, 200)
        }
    })
}

module.exports.getSource = getSource
module.exports.updateSource = updateSource