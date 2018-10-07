const socket = new WebSocket("ws://localhost:3000/")
const messagePrefix = '<div class="message"><em>'
const messagePostfix = '</div>'
const MESSAGE_TYPE = {
  'SINGLE_MESSAGE': 0,
  'MESSAGE_HISTORY': 1,
  'YOU_KICKED': 2
}

function getAbsoluteHeight(element) {
  element = (typeof element === 'string') ? document.querySelector(element) : element

  const style = window.getComputedStyle(element);
  const margin = parseFloat(style['marginTop']) + parseFloat(style['marginBottom'])

  return Math.ceil(element.offsetHeight + margin)
}

function addOneMessage(text, user) {
  let history = document.getElementById('history'),
  scrolled = Math.abs(history.scrollTop - (history.scrollHeight - history.offsetHeight)) < 5
  console.log(Math.abs(history.scrollTop - (history.scrollHeight - history.offsetHeight)))

  history.innerHTML += (messagePrefix + user + '</em>: ' + text + messagePostfix)

  // NOTE(aolo2): if already scrolled to bottom (do not disturb user scrolling)
  if (scrolled) {
    history.scrollTop = history.scrollHeight
  }
}

function drawMessages(messages) {
  for (let i = 0; i < messages.length; i++) {
    addOneMessage(messages[i].text, messages[i].from)
  }
}

function sendMessage(ui) {
  let input = ui.children[0],
  history = ui.parentNode.children[0]

  const message = {
    text: input.value.trim(),
    roomId: 1
  }

  if (message.text.length > 0) {
    socket.send(JSON.stringify(message))
    history.scrollTop = history.scrollHeight
  }
  input.value = ''
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data)

  switch (message.type) {
    case MESSAGE_TYPE.SINGLE_MESSAGE:
    {
      drawMessages([message])
      break
    }
    case MESSAGE_TYPE.MESSAGE_HISTORY:
    {
      // console.log(message.history)
      drawMessages(message.history)
      break
    }
  }
}

window.addEventListener('load', () => {
  let input = document.getElementById('input')
  input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      sendMessage(input.parentNode)
    }
  })
})