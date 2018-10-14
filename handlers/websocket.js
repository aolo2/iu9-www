const ws = require('ws')
const cookie = require('cookie')
const uuidv4 = require('uuid/v4')
const url = require('url')

const common = require('./common')
const db = require('../lib/db')

const MESSAGE_TYPE = {
 'SINGLE_MESSAGE': 0,
 'MESSAGE_HISTORY': 1,
 'ERROR': 2
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

/* NOTE(aolo2):

SINGLE_MESSAGE: {from, text}
MESSAGE_HISTORY: {history: [SINGLE_MESSAGE...]}
MESSAGE_ERROR: {text}

*/
function sendMessage(user, type, payload) {
  let message = {}

  switch (type) {
    case MESSAGE_TYPE.SINGLE_MESSAGE:
    {
      message.from = payload.from
      message.text = payload.text
      break
    }
    case MESSAGE_TYPE.MESSAGE_HISTORY:
    {
      message.history = payload
      break
    }
    case MESSAGE_TYPE.ERROR:
    {
      message.text = payload
      break
    }
    default:
    {
      // TODO(aolo2): bad message type
    }
  }

  message.type = type

  const clientSocket = Local.USERS[user].ws
  if (clientSocket.readyState === clientSocket.OPEN) {
    clientSocket.send(JSON.stringify(message))
  } else {
    delete Local.USERS[user]
  }
}


function onConnection(websocket, req) {
  // NOTE(aolo2): assosiate user with websocket object
  const userLogin = req.user_db.login
  const roomId = (new url.URL(req.headers.origin + req.url)).searchParams.get('roomId')

  Local.USERS[userLogin] = {'ws': websocket}

  websocket.on('message', (data) => {
    let message = data // NOTE(aolo2): just text
    sendMessageToChatroom(userLogin, roomId, message)
  })

  db.getChatroom(roomId, (err, room) => {
    if (err) {
      sendMessage(userLogin, MESSAGE_TYPE.ERROR, err.message)
      websocket.close()
    } else if (!room) {
      sendMessage(userLogin, MESSAGE_TYPE.ERROR, 'no such room')
      websocket.close()
    } else {
      if (userLogin in room.users) {
        Local.USERS[userLogin]['canSend'] = room[userLogin]
        sendMessage(userLogin, MESSAGE_TYPE.MESSAGE_HISTORY, room.messages)
      } else {
        sendMessage(userLogin, MESSAGE_TYPE.ERROR, 'you are not a member of this chatroom')
        websocket.close()
      }
    }
  })
}

function broadCast(users, message) {
  Object.keys(users).forEach((login) => {
    if (users[login] === 1 && login in Local.USERS) {
      sendMessage(login, MESSAGE_TYPE.SINGLE_MESSAGE, message)
    }
  })
}

function sendMessageToChatroom(login, roomId, message) {
  let payload = {
    'text':  common.sanitize(message),
    'from': login
  }

  if (roomId in Local.ROOMS) {
    broadCast(Local.ROOMS[roomId], payload)
  } else {
    db.getChatroom(roomId, (err, room) => {
      if (err) {
        broadCast(room.users, payload)
      } else {
        Local.ROOMS[roomId] = room.users
        broadCast(room.users, payload)
      }
    })
  }

  db.saveToHistoty(roomId, payload, (err) => {}) // TODO(aolo2, later): message not sent
}

function init(httpServer) {
  wsServer = new ws.Server({server: httpServer, path: '/connect'})
  wsServer.on('connection', (ws, req) => sessionCheckMiddleware(ws, req, onConnection))
}

module.exports.init = init
