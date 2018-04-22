function send_text_response(res, status, msg, headers) {
  headers = headers || {}
  headers['Content-Type'] = 'text/plain'
  res.set(headers).status(status).send(msg);
}

function send_json_response(res, json) {
  res.status(200).json(json)
}

function send_unauthorized_response(res, msg) {
  const message = msg || 'unauthorized'
  send_text_response(res, 401, message)
}

function send_forbidden_response(res, msg) {
  const message = msg || 'forbidden'
  send_text_response(res, 403, message)
}

function send_bad_request_response(res, msg) {
  const message = msg || 'bad request'
  send_text_response(res, 400, message)
}

function send_error_response(res, msg) {
  const message = msg || 'internal server error'
  send_text_response(res, 500, message)
}

module.exports.send_text_response = send_text_response
module.exports.send_json_response = send_json_response
module.exports.send_unauthorized_response = send_unauthorized_response
module.exports.send_forbidden_response = send_forbidden_response
module.exports.send_bad_request_response = send_bad_request_response
module.exports.send_error_response = send_error_response
