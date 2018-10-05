const common = require('./common')
const db = require('../lib/db')

const marked = require('marked')

function getHTML(req, res) {
    req.render = true
    getSource(req, res)
}

function getSource(req, res) {
    db.getEditboxSource(req.query.boxId, (err, doc) => {
        if (err) {
            common.send_error_response(res, err.message)
        } else {
            common.send_json_response(res, {'md': req.render ? marked(doc.markdown) : doc.markdown})
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

module.exports.getHTML = getHTML
module.exports.getSource = getSource
module.exports.updateSource = updateSource