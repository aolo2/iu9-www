const error_texts = {
  'bad_request': 'bad request',
  'basic_auth': 'This resource requires basic authentication'
}

function send_text_response(res, status, msg) {
  res.set({'Content-Type': 'text/plain'}).status(status).send(msg);
}

function send_bad_login_response(res) {
  send_text_response(res, 401, error_texts['basic_auth'])
}

function send_bad_request_response(res, message) {
  send_text_response(res, 400, error_texts['bad_request'])
}

function send_error_response(res, message) {
  send_text_response(res, 500, message)
}

module.exports.send_text_response = send_text_response
module.exports.send_bad_request_response = send_bad_request_response
module.exports.send_error_response = send_error_response
module.exports.send_bad_login_response = send_bad_login_response