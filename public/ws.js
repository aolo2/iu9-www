const socket = new WebSocket("ws://localhost:3000/")
const messagePrefix = '<div class="message">'
const messagePostfix = '</div>'
const MESSAGE_TYPE = {
  'SINGLE_MESSAGE': 0,
  'MESSAGE_HISTORY': 1,
  'YOU_KICKED': 2
}

function addOneMessage(text) {
  document.getElementById('history').innerHTML += (messagePrefix + text + messagePostfix)
}

function drawMessages(messages) {
  for (let i = 0; i < messages.length; i++) {
    addOneMessage(messages[i])
  }
}

function sendMessage(ui) {
  let input = ui.children[0]
  const message = {
    text: input.value,
    roomId: 1
  }

  socket.send(JSON.stringify(message))
  input.value = ''
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data)

  switch (message.type) {
    case MESSAGE_TYPE.SINGLE_MESSAGE:
    {
      drawMessages([message.text])
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
})