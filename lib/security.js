const crypto = require('crypto')

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    var value = hash.digest('hex')
    return {
        salt: salt,
        hash: value
    }
}

function randomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

function saltHashPassword(password, saltLength) {
    const salt = randomString(saltLength)
    return sha512(password, salt)
}

function checkPassword(password, salt, hash) {
    return sha512(password, salt).hash === hash
}

module.exports.saltHashPassword = saltHashPassword
module.exports.checkPassword = checkPassword