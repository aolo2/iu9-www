const ws = require('ws')
const cookie = require('cookie')
const uuidv4 = require('uuid/v4')

const common = require('./common')
const db = require('../lib/db')

const MESSAGE_TYPE = {
 'SINGLE_MESSAGE': 0,
 'MESSAGE_HISTORY': 1,
 'YOU_KICKED': 2
}

// TODO(aolo2, later): send an error if the server is being used before being initialised
let wsServer = null

let Local = {
  ROOMS: {},
  USERS: {}
}

function sessionCheckMiddleware(websocket, req, callback) {
  let cookies = null
  if ('cookie' in req.headers) {
    cookies = cookie.parse(req.headers.cookie)
  }

  if (cookies === null || !('SESSIONID' in cookies)) {
    websocket.close()
    return
  }

  req.sessionId = cookies.SESSIONID

  db.get_session(req.sessionId, (err, user_db) => {
    if (err) {
      websocket.send(err.message)
      websocket.close()
    } else {
      req.user_db = user_db
      callback(websocket, req)
    }
  })
}


function sendMessage(user, type, payload) {
  let message = {}

  switch (type) {
    case MESSAGE_TYPE.SINGLE_MESSAGE:
    {
      message = payload
      delete message['roomId']
      break
    }
    case MESSAGE_TYPE.MESSAGE_HISTORY:
    {
      message.roomId = payload.roomId
      message.history = payload.messages
      break
    }
    case MESSAGE_TYPE.YOU_KICKED:
    {

      break
    }
    default:
    {
      // TODO(aolo2): bad message type
    }
  }

  message.type = type

  // TODO(aolo2, important!): if socket is closed - do not panic
  Local.USERS[user].send(JSON.stringify(message))
}


function onConnection(websocket, req) {
  websocket.on('message', (data) => {
    const message = JSON.parse(data) // TODO(aolo2): validate scheme (text, roomId)
    sendMessageToChatroom(req.user_db, message.roomId, message)
  })

  // NOTE(aolo2): assosiate session with websocket object
  Local.USERS[req.user_db.login] = websocket

  if ('chatRooms' in req.user_db) {
    // NOTE(aolo2): history of all rooms
    db.getAllRoomHistory(req.user_db.chatRooms, (err, history) => {
      for (let i = 0; i < history.length; i++) {
        const doc = history[i]
        sendMessage(req.user_db.login, MESSAGE_TYPE.MESSAGE_HISTORY, {'roomId': doc.roomId, 'messages': doc.messages})
      }
    })
  }
}

function broadCast(users, message) {
  for (let i = 0; i < users.length; i++) {
    const login = users[i]
    // NOTE(aolo2): if user is online
    if (login in Local.USERS) {
      sendMessage(users[i], MESSAGE_TYPE.SINGLE_MESSAGE, message)
    }
  }
}

function sendMessageToChatroom(user, roomId, message) {
  message.text = common.sanitize(message.text)
  message.from = user.login
  if (roomId in Local.ROOMS) {
    broadCast(Local.ROOMS[roomId], message)
  } else {
    db.getChatroom(roomId, (err, room) => {
      if (err) {
        broadCast(room.users, message)
      } else {
        Local.ROOMS[roomId] = room.users
        broadCast(room.users, message)
      }
    })
  }

  db.saveToHistoty(roomId, message, (err) => {})
}

function createChatroom(req, res) {
  const room = {
    'name': req.body.name,
    'createdAt': new Date(),
    'users': req.body.users
  }

  db.createChatroom(room, (err, result) => {
    if (err) {
      common.prepare_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200, result.insertedId)
    }
  })
}

/*
function deleteChatroom(roomId) {
  db.createChatroom(roomId, (err) => {
    if (err) {

    } else {

    }
  })
}

function addUserToChatroom(roomId, user) {
  db.addUserToChatroom(roomId, user, (err) => {
    if (err) {

    } else if (roomId in Local.USERS) {
      Local.USERS[roomId].
    } else {

    }
  })
}

function removeUserFromChatroom(room, user) {
  db.removeUserFromChatroom(roomId, user, (err) => {
    if (err) {

    } else if (roomId in Local.USERS) {
      Local.USERS[roomId].
    } else {

    }
  })
}
}*/

function init(httpServer) {
  wsServer = new ws.Server({server: httpServer})
  wsServer.on('connection', (ws, req) => sessionCheckMiddleware(ws, req, onConnection))
}

module.exports.init = init
module.exports.createChatroom = createChatroom