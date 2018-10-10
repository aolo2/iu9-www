let filesInfo = {}
let eventTutors = new Set()
let eventGroups = new Set()

function addUser() {
  let user = {
    'last_name': document.getElementById('user-ln').value,
    'first_name': document.getElementById('user-fn').value,
    'login': document.getElementById('user-login').value,
    'pass': document.getElementById('user-pass').value
  }

  switch (document.getElementById('user-roles').value) {
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

function deleteParticipant(login) {
  eventTutors.delete(login)
  eventGroups.delete(login)
  document.getElementById('event-participants').removeChild(document.getElementById(login))
}

function addParticipants(role) {
  let selectNode = null
  let set = null
  if (role === 'student') {
    selectNode = document.getElementById('students-select')
    set = eventGroups
  } else if (role === 'tutor') {
    selectNode = document.getElementById('tutors-select')
    set = eventTutors
  }

  const login = selectNode.value
  const fullName = selectNode.options[selectNode.selectedIndex].text

  if (!set.has(login)) {
   let list = document.getElementById('event-participants')
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
    document.getElementById('user-group').classList.remove('initially-disabled')
  } else {
    document.getElementById('user-group').classList.add('initially-disabled')
  }
}

function addEvent() {
  let event = {
    'type': document.getElementById('event-type').value,
    // 'number': document.getElementById('lab-number').value,
    'subject': document.getElementById('event-subject').value,
    'title': document.getElementById('event-name').value,
    'date': document.getElementById('event-date').valueAsDate,
    'files': filesInfo,
    'participants': {'tutors': [], 'students': []}
  }

  eventTutors.forEach((tutorLogin) => {
    event.participants['tutors'].push(tutorLogin)
  })

  eventGroups.forEach((studentGroup) => {
    event.participants['students'].push(studentGroup)
  })

  if (event.subject === '0') {
    event.subjectName = document.getElementById('custom-subject').value
  } else {
    const eventSelect = document.getElementById('event-subject')
    event.subjectName = eventSelect.options[eventSelect.selectedIndex].text
  }

  if (event.type === '0') {
    event.typeName = document.getElementById('custom-type').value
  } else {
    const eventSelect = document.getElementById('event-type')
    event.typeName = eventSelect.options[eventSelect.selectedIndex].text
  }

  _request('POST', 'events/create', {'Content-type': 'application/json'}, {'event': event}, (status, response) => {
    if (status === 200) {
      location.reload()
    } else {
      // TODO(aolo2): error handling
    }
  })
}

function subjectChange(select, inputId) {
  if (select.value === '0') {
    document.getElementById(inputId).classList.remove('initially-disabled')
  } else {
    document.getElementById(inputId).classList.add('initially-disabled')
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
      subjectChange(document.getElementById('event-subject'), 'custom-subject')
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
      subjectChange(document.getElementById('event-type'), 'custom-type')
    } else {
      // TODO(aolo2): error handling
    }
  })

  /*document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);*/
  })