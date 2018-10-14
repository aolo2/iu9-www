const redis_client = require('./redis-client').init()
const mongo_client = require('./mongo-client').init()
// const uuid = require('uuid/v4')

// TODO(aolo2): split functions into namespaces (for each handler)

function get_roles(titles, callback) {
  redis_client.mget(titles, (err, result) => {
    if (result.filter((item) => item !== null).length === titles.length) {
      let res = []
      for (let i = 0; i < titles.length; i++) {
        res.push({'name': titles[i], 'requests': JSON.parse(result[i])})
      }
      callback(err, res)
    } else {
      mongo_client.get_roles(titles, (err, roles) => {
        let redisRoles = []
        roles.forEach((role) => { redisRoles.push({'key': role.name, 'val': role.requests}) })
        redis_client.mset(redisRoles, (err) => {
          callback(err, roles)
        })
      })
    }
  })
}

function addUser(user, callback) {
  mongo_client.add_user(user, callback)
}

function get_user(login, callback) {
  mongo_client.get_user(login, callback)
}
function getUsers(matchQuery, callback) {
  mongo_client.get_users(matchQuery, callback)
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
  let query = {'$and': [{'$or': [{'deleted': {'$exists': false}},  {'deleted': false}]}, {'$or': [{'public': true}]}]}
  let roleSelect = query['$and'][1]['$or']

  if (request.user_db) {
    if (request.user_db['roles'].indexOf('admin') != -1) {
      query = {'$or': [{'deleted': {'$exists': false}},  {'deleted': false}]}
    } else {
      roleSelect.push({'target': {'$in': request.user_db['roles']}})
      if (request.user_db['roles'].indexOf('student') != -1) {
        roleSelect[roleSelect.length - 1] = {'target.group': request.user_db.group}
      }
    }
  }

  mongo_client.get_news(query, callback)
}

function update_article(article_id, article, callback) {
  mongo_client.update_article(article_id, article, callback)
}

function get_user_applications(callback) {
  mongo_client.get_user_applications(callback)
}

function approveApplication(applicationId, callback) {
  mongo_client.approve_application(applicationId, callback)
}

function post_news_article(article, callback) {
  mongo_client.post_news_article(article, callback)
}

function delete_article(article_id, callback) {
  mongo_client.delete_news_article(article_id, callback)
}

function addEditbox(markdown, callback) {
  mongo_client.add_editbox(markdown, callback)
}

function updateEditboxSource(box_id, markdown, callback) {
  mongo_client.update_editbox(box_id, markdown, callback)
}

function getEditboxSource(boxId, callback) {
  mongo_client.get_editbox(boxId, callback)
}

function getChatroom(roomId, callback) {
  mongo_client.get_chatroom(roomId, callback)
}

function saveToHistoty(roomId, message, callback) {
  mongo_client.save_to_chat_histoty(roomId, message, callback)
}

function createChatroom(users, callback) {
  mongo_client.create_chatroom(users, callback)
}

function saveFilenames(fileInfo, callback) {
  mongo_client.save_filenames(fileInfo, callback)
}

function getEvent(eventId, callback) {
  mongo_client.get_event(eventId, callback)
}

function createEvent(event, callback) {
 mongo_client.create_event(event, callback)
}

function getGroups(callback) {
  mongo_client.get_user_groups(callback)
}

function getEventSubjects(callback) {
  mongo_client.get_event_subjects(callback)
}

function addEventSubject(subjectName, callback) {
  mongo_client.add_event_subject(subjectName, callback)
}

function getEventSubject(subjectId, callback) {
  mongo_client.get_event_subject(subjectId, callback)
}

function unwindRules(rules, callback) {
  mongo_client.unwind_rules(rules, callback)
}

function addEventToUsers(users, eventInfo, callback) {
  mongo_client.add_event_to_users(users, eventInfo, callback)
}

function getEventTypes(callback) {
  mongo_client.get_event_types(callback)
}

function getEventType(typeId, callback) {
  mongo_client.get_event_type(typeId, callback)
}

function addEventType(typeName, callback) {
  mongo_client.add_event_type(typeName, callback)
}

function getUserEvents(login, callback) {
  mongo_client.get_user_events(login, callback)
}

function finishEvent(eventId, callback) {
  mongo_client.finish_event(eventId, callback)
}

function removeEventFromUsers(eventId, callback) {
  mongo_client.remove_event_from_users(eventId, callback)
}

function closeChat(chatId, callback) {
  mongo_client.close_chat(chatId, callback)
}

module.exports.get_roles = get_roles
module.exports.addUser = addUser
module.exports.getUsers = getUsers
module.exports.get_user = get_user
module.exports.add_user_application = add_user_application
module.exports.open_session = open_session
module.exports.get_session = get_session
module.exports.close_session = close_session
module.exports.get_news = get_news
module.exports.update_article = update_article
module.exports.get_user_applications = get_user_applications
module.exports.approveApplication = approveApplication
module.exports.post_news_article = post_news_article
module.exports.delete_article = delete_article
module.exports.addEditbox = addEditbox
module.exports.updateEditboxSource = updateEditboxSource
module.exports.getEditboxSource = getEditboxSource
module.exports.getChatroom = getChatroom
module.exports.getChatroom = getChatroom
module.exports.saveToHistoty = saveToHistoty
module.exports.createChatroom = createChatroom
module.exports.saveFilenames = saveFilenames
module.exports.getEvent = getEvent
module.exports.createEvent = createEvent
module.exports.getGroups = getGroups
module.exports.getEventSubjects = getEventSubjects
module.exports.addEventSubject = addEventSubject
module.exports.getEventSubject = getEventSubject
module.exports.unwindRules = unwindRules
module.exports.addEventToUsers = addEventToUsers
module.exports.getEventTypes = getEventTypes
module.exports.getEventType = getEventType
module.exports.addEventType = addEventType
module.exports.getUserEvents = getUserEvents
module.exports.finishEvent = finishEvent
module.exports.removeEventFromUsers = removeEventFromUsers
module.exports.closeChat = closeChat
// module.exports.