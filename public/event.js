let filesInfo = {}
let eventTutors = new Set()
let eventGroups = new Set()

function addUser() {
  let user = {
    'last_name': gelid('user-ln').value,
    'first_name': gelid('user-fn').value,
    'login': gelid('user-login').value,
    'pass': gelid('user-pass').value
  }

  switch (gelid('user-roles').value) {
    case '1':
    {
      user.roles = ['tutor']
      break
    }
    case '2':
    {
      user.roles = ['student']
      break
    }
    case '3':
    {
      user.roles = ['editor']
      break
    }
    case '4':
    {
      user.roles = ['admin']
      break
    }
  }

  if (user.roles.indexOf('student') !== -1) {
    user.group = gelid('user-group').value
  }

  _request('POST', 'users/add', {'Content-type': 'application/json'}, user, (status, response) => {
    if (status === 200) {
      gelid('user-fn').value = ''
      gelid('user-ln').value = ''
      gelid('user-login').value = ''
      gelid('user-pass').value = ''
    } else {
      // TODO(aolo2): error handling
    }
  })
}

function addAttachment(status, info) {
  if (status === 200) {
    let attachments = gelid('event-attachments')
    for (let i = 0; i < info.length; i++) {
      attachments.innerHTML = '<a href="' + info[i].path + '">' + info[i].name + '</a><br>' + attachments.innerHTML
      filesInfo[info[i].name] = info[i].path
    }
  } else {
    // TODO(aolo2): error handling
  }
}

function deleteParticipant(login) {
  eventTutors.delete(login)
  eventGroups.delete(login)
  gelid('event-participants').removeChild(gelid(login))
}

function addParticipants(role) {
  let selectNode = null
  let set = null
  if (role === 'student') {
    selectNode = gelid('students-select')
    set = eventGroups
  } else if (role === 'tutor') {
    selectNode = gelid('tutors-select')
    set = eventTutors
  }

  const login = selectNode.value
  const fullName = selectNode.options[selectNode.selectedIndex].text

  if (!set.has(login)) {
   let list = gelid('event-participants')
   let entry = document.createElement('li')

   entry.id = login
   entry.onclick = () => { deleteParticipant(login) }

   entry.appendChild(document.createTextNode(fullName))
   list.appendChild(entry)
   set.add(login)
 }
}

function onUserRoleChange(select) {
  console.log(select.value)
  if (select.value === '2') {
    gelid('user-group').classList.remove('initially-disabled')
  } else {
    gelid('user-group').classList.add('initially-disabled')
  }
}

function addEvent() {
  let event = {
    'type': gelid('event-type').value,
    // 'number': gelid('lab-number').value,
    'subject': gelid('event-subject').value,
    'title': gelid('event-name').value,
    'datetime': new Date(gelid('event-date').value + 'T' + gelid('event-time').value + ':00'),
    'files': filesInfo,
    'participants': {'tutors': [], 'students': []},
    'chat': gelid('create-chat').checked
  }

  eventTutors.forEach((tutorLogin) => {
    event.participants['tutors'].push(tutorLogin)
  })

  eventGroups.forEach((studentGroup) => {
    event.participants['students'].push(studentGroup)
  })

  if (event.subject === '0') {
    event.subjectName = gelid('custom-subject').value
  } else {
    const eventSelect = gelid('event-subject')
    event.subjectName = eventSelect.options[eventSelect.selectedIndex].text
  }

  if (event.type === '0') {
    event.typeName = gelid('custom-type').value
  } else {
    const eventSelect = gelid('event-type')
    event.typeName = eventSelect.options[eventSelect.selectedIndex].text
  }

  _request('POST', 'event/create', {'Content-type': 'application/json'}, {'event': event}, (status, response) => {
    if (status === 200) {
      location.reload()
    } else {
      // TODO(aolo2): error handling
    }
  })
}

function subjectChange(select, inputId) {
  if (select.value === '0') {
    gelid(inputId).classList.remove('initially-disabled')
  } else {
    gelid(inputId).classList.add('initially-disabled')
  }
}



window.addEventListener('load', () => {
  _request('GET', 'users', null, {'role': 'tutor'}, (status, response) => {
    if (status === 200) {
      const users = JSON.parse(response)
      users.forEach((tutor) => {
        addOptionToSelect('tutors-select', tutor.login, tutor.last_name + ' ' + tutor.first_name)
      })
    } else {
      // TODO(aolo2): error handling
    }
  })

  _request('GET', 'users/groups', null, null, (status, response) => {
    if (status === 200) {
      const groups = JSON.parse(response)
      groups.forEach((group) => {
        addOptionToSelect('students-select', group._id, 'ИУ9-' + group._id + ' (' + group.count + ' чел.)')
      })
    } else {
      // TODO(aolo2): error handling
    }
  })

  _request('GET', 'events/subjects', null, null, (status, response) => {
    if (status === 200) {
      const subjects = JSON.parse(response)
      subjects.forEach((subject) => {
        addOptionToSelect('event-subject', subject.id, subject.name)
      })
      addOptionToSelect('event-subject', 0, 'Другой')
      subjectChange(gelid('event-subject'), 'custom-subject')
    } else {
      // TODO(aolo2): error handling
    }
  })

  _request('GET', 'events/types', null, null, (status, response) => {
    if (status === 200) {
      const types = JSON.parse(response)
      types.forEach((type) => {
        addOptionToSelect('event-type', type.id, type.name)
      })
      addOptionToSelect('event-type', 0, 'Другой')
      subjectChange(gelid('event-type'), 'custom-type')
    } else {
      // TODO(aolo2): error handling
    }
  })

  /*document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);*/
  })