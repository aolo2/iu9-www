window.addEventListener('load', () => {
  let registration_form = document.getElementById('registration-form')

  if (registration_form) {
    registration_form.onsubmit = () => {
      let xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              window.location.href = server + 'login.html'
            } else if (xhttp.status === 400) {
              document.getElementById('server-message').innerHTML = 'Поля заполнены неверно'
            } else {
              document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
            }
        }
      }

      const first_name = document.getElementById('first-name').value
      const last_name = document.getElementById('last-name').value
      const login = document.getElementById('login').value
      const pass = document.getElementById('password').value
      const roles = ['admin']

      xhttp.open('POST', server + 'users/signup', true)
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(JSON.stringify({
        'login': login,
        'pass': pass,
        'first_name': first_name,
        'last_name': last_name,
        'roles': roles
      }))
    }
  }
})