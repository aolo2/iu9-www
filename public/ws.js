window.addEventListener('load', () => {
  var exampleSocket = new WebSocket("ws://localhost:3000/")

  exampleSocket.onopen = (event) => {
    exampleSocket.send(JSON.stringify({'roomId': 1, 'text': '1231'}))
  }

  exampleSocket.onmessage = (event) => {
    console.log(event.data)
  }
})