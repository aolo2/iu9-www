const redis_client = require('./redis-client').init()
const mongo_client = require('./mongo-client').init()
// const uuid = require('uuid/v4')

// TODO(aolo2): split functions into namespaces (for each handler)

function create_role(role, callback) {
  mongo_client.create_role(role, callback)
}

function add_user(user, callback) {
  mongo_client.add_user(user, callback)
}

function get_user(login, callback) {
  mongo_client.get_user(login, callback)
}

function add_user_application(application, callback) {
  mongo_client.add_user_application(application, callback)
}

function open_session(session_id, user_data, callback) {
  let user_copy = JSON.parse(JSON.stringify(user_data))
  delete user_copy['_id']
  delete user_copy['passwordHash']
  delete user_copy['passwordSalt']

  redis_client.set(session_id, JSON.stringify(user_copy), (err) => {
    if (err) {
      callback(err)
    } else {
      redis_client.expire(session_id, 86400, callback)
    }
  })
}

function get_session(session_id, callback) {
  redis_client.get(session_id, (err, result) => {
    if (err) {
      callback(err)
      return
    }

    if (!result) {
      callback(new Error('no such session'))
      return
    }

    callback(null, JSON.parse(result))
  })
}

function close_session(session_id, callback) {
  redis_client.del(session_id, callback)
}

function get_news(request, callback) {
  let query = {'$and': [
  {'$or': [
  {'deleted': {'$exists': false}},
  {'deleted': false}
  ]},
  {'$or': [
  {'public': true},
  ]}
  ]}

  if (request.user_db) {
    query['$and'][1]['$or'].push({'canSee': {'$in': request.user_db['roles']}})
  }

  mongo_client.get_news(query, callback)
}

function get_article_source(article_id, callback) {
  mongo_client.get_article_source(article_id, callback)
}

function update_article(article_id, article, callback) {
  mongo_client.update_article(article_id, article, callback)
}

function get_roles(titles, callback) {
  // redis_client.get(role_prefix + title, (err, result) =>
    // callback(err, JSON.parse(result))
  // )

  mongo_client.get_roles(titles, callback)
}

function get_user_applications(callback) {
  mongo_client.get_user_applications(callback)
}

function approve_application(application_id, callback) {
  mongo_client.approve_application(application_id, callback)
}

function post_news_article(article, callback) {
  mongo_client.post_news_article(article, callback)
}

function delete_article(article_id, callback) {
  mongo_client.delete_news_article(article_id, callback)
}

function updateEditboxSource(box_id, markdown, callback) {
  mongo_client.update_editbox(box_id, markdown, callback)
}

function getEditboxSource(boxId, callback) {
  mongo_client.get_editbox(boxId, callback)
}

function getAllRoomHistory(roomIds, callback) {
  mongo_client.get_all_room_history(roomIds, callback)
}

function getChatroom(roomId, callback) {
  mongo_client.get_chat_room(roomId, callback)
}

function saveToHistoty(roomId, message, callback) {
  mongo_client.save_to_chat_histoty(roomId, message, callback)
}

const role_prefix = '#roles:'

module.exports.create_role = create_role
module.exports.add_user = add_user
module.exports.get_user = get_user
module.exports.add_user_application = add_user_application
module.exports.open_session = open_session
module.exports.get_session = get_session
module.exports.close_session = close_session
module.exports.get_news = get_news
module.exports.get_article_source = get_article_source
module.exports.update_article = update_article
module.exports.get_roles = get_roles
module.exports.get_user_applications = get_user_applications
module.exports.approve_application = approve_application
module.exports.post_news_article = post_news_article
module.exports.delete_article = delete_article
module.exports.updateEditboxSource = updateEditboxSource
module.exports.getEditboxSource = getEditboxSource
module.exports.getAllRoomHistory = getAllRoomHistory
module.exports.getChatroom = getChatroom
module.exports.saveToHistoty = saveToHistoty