window.addEventListener('load', () => {
  var exampleSocket = new WebSocket("ws://localhost:3000/chat")

  exampleSocket.onopen = (event) => {
    exampleSocket.send("hello " + Math.random())
  }

  exampleSocket.onmessage = (event) => {
    console.log(event.data)
  }
})