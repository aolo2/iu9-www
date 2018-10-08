let filesInfo = {}

function addAttachment(status, info) {
  if (status === 200) {
    let attachments = document.getElementById('event-attachments')
    for (let i = 0; i < info.length; i++) {
      attachments.innerHTML = '<a href="' + info[i].path + '">' + info[i].name + '</a><br>' + attachments.innerHTML
      filesInfo[info[i].name] = info[i].path
    }
  } else {
    // TODO(aolo2): error handling
  }
}

function addEvent() {
  const event = {
    'type': document.getElementById('event-type').value,
    // 'number': document.getElementById('lab-number').value,
    'subject': document.getElementById('event-subject').value,
    'title': document.getElementById('event-name').value,
    'date': document.getElementById('event-date').valueAsDate,
    'files': filesInfo
  }

  _request('POST', 'events/create', {'Content-type': 'application/json'}, {'event': event}, (status, response) => {
    if (status === 200) {
      location.reload()
    } else {
      // TODO(aolo2): error handling
    }
  })
}

window.addEventListener('load', () => {
  // _request('GET', 'events', null, {'eventId': ''}, (status, response) => {

  // })
})