const approveButton = '<input type="submit" onclick="" value="Принять">'
const denyButton = '<input type="submit" onclick="" value="Отклонить">'

function closeApplication(id, approve) {
  _request('POST', 'users/approve',
    {'Content-type': 'application/json'},
    {'id': id, 'approve': approve}, (status, response) => {
      if (status === 200) {
        document.getElementById(id).outerHTML = ''
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

      apps.forEach((app) => {
        let userAppDiv = createDiv(['user-app'], app._id),
        userAppDescDiv = createDiv(['user-app-desc'])

        userAppDescDiv.innerHTML = JSON.stringify(app)
        userAppDiv.appendChild(userAppDescDiv)
        userAppDiv.appendChild(createSubmit('Принять', () => { closeApplication(app._id, true) }))
        userAppDiv.appendChild(createSubmit('Отклонить', () => { closeApplication(app._id, false) }))
        appList.appendChild(userAppDiv)
      })
    } else {
      // TODO: error handling
    }
  })
})