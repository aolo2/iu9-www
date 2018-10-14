let socket = null
const errorPrefix = '<div class="message red"><em>'
const messagePrefix = '<div class="message"><em>'
const messagePostfix = '</div>'
const MESSAGE_TYPE = {
  'SINGLE_MESSAGE': 0,
  'MESSAGE_HISTORY': 1,
  'ERROR': 2
}

function getAbsoluteHeight(element) {
  element = (typeof element === 'string') ? document.querySelector(element) : element
  const style = window.getComputedStyle(element);
  const margin = parseFloat(style['marginTop']) + parseFloat(style['marginBottom'])

  return Math.ceil(element.offsetHeight + margin)
}

function addOneMessage(text, user, isError) {
  let history = gelid('history'),
  scrolled = Math.abs(history.scrollTop - (history.scrollHeight - history.offsetHeight)) < 5
  history.innerHTML += ((isError ? errorPrefix : messagePrefix) + user  + '</em>: ' + text + messagePostfix)

  // NOTE(aolo2): if already scrolled to bottom (do not disturb user scrolling)
  if (scrolled) {
    history.scrollTop = history.scrollHeight
  }
}

function drawMessages(messages, isError) {
  for (let i = 0; i < messages.length; i++) {
    addOneMessage(messages[i].text, isError ? 'ОШИБКА' : messages[i].from, isError)
  }
}

function sendMessage(ui) {
  let input = ui.children[0],
  history = ui.parentNode.children[0]
  message = input.value.trim()

  if (message.length > 0) {
    socket.send(JSON.stringify(message))
    history.scrollTop = history.scrollHeight
  }
  input.value = ''
}

/* NOTE(aolo2):

{type, ...}
type = SINGLE_MESSAGE || MESSAGE_HISTORY || MESSAGE_ERROR

SINGLE_MESSAGE: {from, text}
MESSAGE_HISTORY: {history: [SINGLE_MESSAGE...]}
MESSAGE_ERROR: {text}

*/
function onmessage(event) {
  const message = JSON.parse(event.data)
  console.log(message)
  switch (message.type) {
    case MESSAGE_TYPE.SINGLE_MESSAGE:
    {
      drawMessages([message])
      break
    }
    case MESSAGE_TYPE.MESSAGE_HISTORY:
    {
      drawMessages(message.history)
      break
    }
    case MESSAGE_TYPE.ERROR:
    {
      drawMessages([message], true)
    }
    default:
    {
      // TODO(aolo2): unknown message type
    }
  }
}

function initSocket(ws) {
  socket = ws
  socket.onmessage = onmessage
}

window.addEventListener('load', () => {
  let input = gelid('ws-input')
  input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      sendMessage(input.parentNode)
    }
  })
})