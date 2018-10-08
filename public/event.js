let filesInfo = {}

function addUser() {
  let user = {
    'last_name': document.getElementById('user-ln').value,
    'first_name': document.getElementById('user-fn').value,
    'login': document.getElementById('user-login').value,
    'pass': document.getElementById('user-pass').value,
    'roles': (document.getElementById('user-roles').value === '1' ? ['student'] : ['tutor']),
  }

  if (user.roles.indexOf('student') !== -1) {
    user.group = document.getElementById('user-group').value
  }

  _request('POST', 'users/add', {'Content-type': 'application/json'}, user, (status, response) => {
    if (status === 200) {
      document.getElementById('user-fn').value = ''
      document.getElementById('user-ln').value = ''
      document.getElementById('user-login').value = ''
      document.getElementById('user-pass').value = ''
    } else {
      // TODO(aolo2): error handling
    }
  })
}

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