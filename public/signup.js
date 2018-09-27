function apply_for_registration() {
  const first_name = document.getElementById('register-firstname').value
  const last_name = document.getElementById('register-lastname').value
  const login = document.getElementById('register-login').value
  const pass = document.getElementById('register-password').value
  const roles = ['admin']

  const data = {
    'login': login,
    'pass': pass,
    'first_name': first_name,
    'last_name': last_name,
    'roles': roles
  }

  _request('POST', 'users/signup', {'Content-type': 'application/json'}, data,
    (status, response) => {
      if (status === 200) {
        window.location.href = server
      } else if (status === 400) {
        document.getElementById('server-message').innerHTML = 'Поля заполнены неверно'
      } else {
        document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
      }
    })

  return false
}