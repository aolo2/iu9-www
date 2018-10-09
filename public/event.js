let filesInfo = {}
let eventTutors = new Set()
let eventGroups = new Set()

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

function addTutor() {
  const tutorSelect = document.getElementById('tutors-select')
  const tutorLogin = tutorSelect.value
  const tutorFullname = tutorSelect.options[tutorSelect.selectedIndex].text

  if (!eventTutors.has(tutorLogin)) {
    document.getElementById('event-tutors').innerHTML += (tutorFullname + '<br>')
    eventTutors.add(tutorLogin)
  }
}

function addStudents() {
  const studentSelect = document.getElementById('students-select')
  const studentGroup = studentSelect.value
  const studentGroupName = studentSelect.options[studentSelect.selectedIndex].text

  if (!eventGroups.has(studentGroup)) {
    document.getElementById('event-students').innerHTML += (studentGroupName + '<br>')
    eventGroups.add(studentGroup)
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