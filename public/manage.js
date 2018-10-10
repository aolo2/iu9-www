function emptyAppsText(show) {
  let classes = document.getElementById('no-apps-message').classList
  if (show) {
    classes.remove('initially-disabled')
  } else {
    classes.add('initially-disabled')
  }
}

function closeApplication(id, approve) {
  _request('POST', 'users/approve',
    {'Content-type': 'application/json'},
    {'id': id, 'approve': approve}, (status, response) => {
      if (status === 200) {
        let appList = document.getElementById('app-list')
        appList.removeChild(document.getElementById(id))
        if (appList.children.length === 0) { emptyAppsText(true) }
      } else {
        // TODO: error handling
      }
    })
}

window.addEventListener('load', () => {
  _request('GET', 'users/applications', null, null, (status, response) => {
    if (status === 200) {
      const apps = JSON.parse(response)
      let appList = document.getElementById('app-list')

      if (appList.children.length === 0) {
        appList.innerHTML = ''
      }

      apps.forEach((app) => {
        let userAppDiv = createDiv(['user-app'], app._id),
        userAppDescDiv = createDiv(['user-app-desc'])

        userAppDescDiv.innerHTML = JSON.stringify(app)
        userAppDiv.appendChild(userAppDescDiv)
        userAppDiv.appendChild(createSubmit('Принять', () => { closeApplication(app._id, true) }))
        userAppDiv.appendChild(createSubmit('Отклонить', () => { closeApplication(app._id, false) }))
        appList.appendChild(userAppDiv)
      })

      if (appList.children.length === 0) {
        emptyAppsText(true)
      }
    } else {
      // TODO: error handling
    }
  })
})