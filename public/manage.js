let app_data = []

function approve_application(idx, approve) {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        location.reload()
      } else if (xhttp.status === 400) {
        // document.getElementById('server-message').innerHTML = 'Поля заполнены неверно'
      } else {
        // document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
      }
    }
  }

  xhttp.open('POST', server + 'users/approve', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  let payload = app_data[idx]
  payload['approve'] = approve
  xhttp.send(JSON.stringify(payload))
}

window.addEventListener('load', () => {
  let applications = document.getElementById('applications')
  
  if (applications) {
    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          const applications_array = JSON.parse(xhttp.responseText)
          applications_array.forEach((app, idx) => {
            app_data.push(app)
            applications.innerHTML += (idx +
              '<div class="content">' +
              '<div class="field">Имя:</div><div class="value">' + app.first_name + '</div><br>' +
              '<div class="field">Фамилия:</div><div class="value">' + app.last_name + '</div><br>' +
              '<div class="field">Логин:</div><div class="value">' + app.login + '</div><br>' + 
              '<input type="submit" value="Принять" onclick="approve_application(' + idx + ', true)"> \
              <input type="submit" value="Отклонить" onclick="approve_application(' + idx + ', false)">' +
              '</div>')
          })
        } else if (xhttp.status === 400) {
          // document.getElementById('server-message').innerHTML = 'Поля заполнены неверно'
        } else {
          // document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
        }
      }
    }

    xhttp.open('GET', server + 'users/applications', true)
    // xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send()
  }
})