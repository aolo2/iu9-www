window.addEventListener('load', () => {
  let registration_form = document.getElementById('register-form')

  if (registration_form) {
    registration_form.onsubmit = () => {
      let xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          console.log(xhttp.status)
            if (xhttp.status === 200) {
              window.location.href = server
            } else if (xhttp.status === 400) {
              document.getElementById('server-message').innerHTML = 'Поля заполнены неверно'
            } else {
              document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
            }
        }
      }

      const first_name = document.getElementById('register-firstname').value
      const last_name = document.getElementById('register-lastname').value
      const login = document.getElementById('register-login').value
      const pass = document.getElementById('register-password').value
      const roles = ['admin']

      console.log(first_name, last_name, location, pass, roles)

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