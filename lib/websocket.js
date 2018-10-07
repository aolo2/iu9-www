const ws = require('ws')
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
  console.log(req.cookies)
  websocket.on('message', (data) => {
    wsServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data)
      }
    })
  })

  websocket.send('hi')
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
  wsServer = new ws.Server({server: httpServer, path: '/chat'})
  wsServer.on('connection', onConnection)
}

module.exports.init = init