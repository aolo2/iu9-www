function apply_for_registration() {
  const data = {
    'login': document.getElementById('register-login').value.trim(),
    'pass': document.getElementById('register-password').value,
    'first_name': document.getElementById('register-firstname').value.trim(),
    'last_name': document.getElementById('register-lastname').value.trim(),
    'group': document.getElementById('group-select').value
  }

  _request('POST', 'users/signup', {'Content-type': 'application/json'}, data,
    (status, response) => {
      if (status === 200) {
        window.location.href = SERVER
      } else if (status === 400) {
        document.getElementById('server-message').innerHTML = 'Поля заполнены неверно (' + response + ')'
      } else {
        document.getElementById('server-message').innerHTML = 'Ошибка сервиса регистрации'
      }
    })

  return false
}