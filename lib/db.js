var users = {}
var news = []

function getUser(username, callback) {
  const user = users[username]
  let err = null
  if (!user) {
    err = {'message': 'user not found'}
  }
  callback(err, user)
}

function addUser(username, passwordHash, passwordSalt, callback) {
  let err = null
  if (username in users) {
    err = {'message': 'user already exists'}
  } else {
    users[username] = {
      'username': username,
      'passwordHash': passwordHash,
      'passwordSalt': passwordSalt
    }
  }
  callback(err, null)
}

function postNews(callback) {
  news.push('news ' + news.length)
  callback()
}

function getNews(callback) {
  let err = null
  if (!news || news.length === 0) {
    err = {'message': 'there are no news'}
  }
  callback(err, news)
}

module.exports.getNews = getNews
module.exports.postNews = postNews
module.exports.addUser = addUser
module.exports.getUser = getUser