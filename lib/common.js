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

module.exports.err_no_ok = err_no_ok