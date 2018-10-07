const ws = require('ws')
const cookie = require('cookie')
const uuidv4 = require('uuid/v4')

const db = require('./db')

// TODO(aolo2, later): send an error if the server is being used before being initialised
let wsServer = null

// TODO(aolo2): что тут хранить? wss? список пользователей? список ws?
let Local = {
  // ROOMS: {}
}

/// ws.on('request', (req) => {
  // req.cookies
// })

function onConnection(websocket, req) {
  const cookies = cookie.parse(req.headers.cookie)

  if (!('SESSIONID' in cookies)) {
    websocket.close()
    return
  }

  db.get_session(cookies.SESSIONID, (err, user_db) => {
    if ('chatRooms' in user_db) {
        // NOTE(aolo2): history of all rooms
        db.getAllRoomHistory(user_db.chatRooms, (err, history) => {
          let response = {}
          for (let i = 0; i < history.length; i++) {
            const doc = history[i]
            response[doc.roomId] = doc.messages
          }
          websocket.send(JSON.stringify(response))
        })
      }
    })
}
/*
function broadCast(room, message) {

}

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

function sendMessageToChatroom(roomId, message) {
  if (roomId in Local.USERS) {
    broadCast(Local.USERS[roomId], message)
  } else {
    db.getChatroom(roomId, (err, room) => {
      if (err) {

      } else {
        // Local.USERS[roomId] = room.users
        broadCast(room.users, message)
      }
    })
  }
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
  wsServer.on('connection', onConnection)
}

module.exports.init = init