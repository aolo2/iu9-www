const ws = require('ws')
const cookie = require('cookie')
const uuidv4 = require('uuid/v4')

const db = require('./db')

// TODO(aolo2, later): send an error if the server is being used before being initialised
let wsServer = null

let Local = {
  ROOMS: {},
  USERS: {}
}

/// ws.on('request', (req) => {
  // req.cookies
// })

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

function onConnection(websocket, req) {
  websocket.on('message', (data) => {
    const message = JSON.parse(data)
    sendMessageToChatroom(req.user_db, message.roomId, message.text)
  })

  // NOTE(aolo2): assosiate session with websocket object
  Local.USERS[req.user_db.login] = websocket

  if ('chatRooms' in req.user_db) {
    // NOTE(aolo2): history of all rooms
    db.getAllRoomHistory(req.user_db.chatRooms, (err, history) => {
      let response = {}
      for (let i = 0; i < history.length; i++) {
        const doc = history[i]
        response[doc.roomId] = doc.messages
      }
      websocket.send(JSON.stringify(response))
    })
  }
}

function broadCast(users, message) {
  for (let i = 0; i < users.length; i++) {
    const login = users[i]
    // NOTE(aolo2): if user is online
    if (login in Local.USERS) {
      Local.USERS[users[i]].send(message)
    }
  }
}

function sendMessageToChatroom(user, roomId, message) {
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
/*

function createChatroom(options) {
  const roomName = options.name
  const createdAt = new Date()
  const users = options.users

  db.createChatroom(roomName, createdAt, users, (err, roomId) => {
    if (err) {

    } else {

    }
  })
}

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

function getMessageHistory(room) {

}*/

function init(httpServer) {
  wsServer = new ws.Server({server: httpServer})
  wsServer.on('connection', (ws, req) => sessionCheckMiddleware(ws, req, onConnection))
}

module.exports.init = init