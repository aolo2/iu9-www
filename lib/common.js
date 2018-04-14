half_hour = 60 * 30 // half-hour in seconds

function err_no_ok(err, result, callback) {
  if (err) {
    callback(err)
    return
  }

  if (result !== 'OK') {
    callback(new Error('result was not OK'))
  } else {
    callback()
  }
}

module.exports.half_hour = half_hour
module.exports.err_no_ok = err_no_ok