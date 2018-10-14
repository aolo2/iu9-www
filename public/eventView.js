let eventId = null

function drawEventData(event) {
  gelid('event-type').innerHTML = event.type + ' &laquo;' + event.title + '&raquo;'
  gelid('event-subject').innerHTML = event.subject
  gelid('event-date').innerHTML = '<strong>' + new Date(event.datetime).toLocaleString('ru-RU') + '</strong>'

  let filesList = gelid('event-files')
  Object.keys(event.files).forEach((filename) => {
    let fileNode = document.createElement('div')
    fileNode.innerHTML = '<a href="' + event.files[filename] + '">' + filename + '</a>'
    filesList.appendChild(fileNode)
  })
}

function finishEvent(e) {
  if (window.confirm('Вы уверены что хотите завершить событие?')) {
    _request('DELETE', 'event', {'Content-type': 'application/json'}, {'eventId': eventId},
      (status, response) => {
        if (status === 200) {
          return true
        } else {
          // TODO: error handling
          return false
        }
      })
  } else {
    return false
  }
}

function drawError() {
  gelid('event-type').innerHTML = 'Событие удалено'
  gelid('finish-event').classList.add('initially-hidden')
}

window.addEventListener('load', () => {
  eventId = new URL(window.location.href).searchParams.get('id');
  _request('GET', 'event', null, {'eventId': eventId}, (status, response) => {
    if (status === 200) {
      const data = JSON.parse(response)
      drawEventData(data)
      if ('chatId' in data) {
        initSocket(new WebSocket('ws://localhost:3000/connect?roomId=' + data.chatId))
        gelid('event-chat').classList.remove('initially-hidden')
      }
    } else if (status === 404) {
      drawError()
    } else {
      // TODO: error handling
    }
  })

  if (_logged_in_as('admin') || _logged_in_as('tutor')) {
    gelid('finish-event').classList.remove('initially-hidden')
  }
})