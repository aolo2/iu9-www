const uuid = require('uuid/v1')

const error_texts = {
  'bad_request': 'bad request',
  'basic_auth': 'This resource requires basic authentication'
}

const news_uuid = uuid()

function send_text_response(res, status, msg) {
  res.set({'Content-Type': 'text/plain'}).status(status).send(msg);
}

function send_json_response(res, json) {
  res.status(200).json(json)
}

function send_bad_login_response(res) {
  send_text_response(res, 401, error_texts['basic_auth'])
}

function send_bad_request_response(res) {
  send_text_response(res, 400, error_texts['bad_request'])
}

function send_error_response(res, message) {
  send_text_response(res, 500, message)
}

module.exports.news_uuid = news_uuid
module.exports.send_text_response = send_text_response
module.exports.send_json_response = send_json_response
module.exports.send_bad_request_response = send_bad_request_response
module.exports.send_error_response = send_error_response
module.exports.send_bad_login_response = send_bad_login_response
