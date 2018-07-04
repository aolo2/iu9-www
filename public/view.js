const server = 'http://localhost:3000/'

function show_or_hide(item, show) {
  item.style.display = show ? 'block' : 'none'
}

function hidden(item) {
  return item.style.display !== 'block'
}

function toggle_login_dropdown() {
  let login_dropdown = document.getElementById('login-dropdown')
  let prom_dropdown = document.getElementById('prom-dropdown')

  document.getElementById('server-message-div').style.display = 'none'

  if (hidden(login_dropdown)) {
    show_or_hide(login_dropdown, true)
    if (prom_dropdown)
      show_or_hide(prom_dropdown, false)
  } else {
    show_or_hide(login_dropdown, false)
  }
}

function login() {
  const login = document.getElementById('login-value').value
  const pass = document.getElementById('password-value').value
  const header = {'Authorization': 'Basic ' + btoa(login + ':' + pass)}

  let server_message = document.getElementById('server-message')

  _request('POST', 'users/login', header, null,
    (status, response) => {
      if (status === 200) {
        _css_set('server-message-div', {'display': 'none'})
        location.reload()
      } else if (status === 401) {
        _css_set('server-message-div', {'display': 'block'})
        server_message.innerHTML = 'Неверный логин и/или пароль'
      } else {
        _css_set('server-message-div', {'display': 'block'})
        server_message.innerHTML = 'Ошибка сервиса авторизации'
      }
    })
}

function logout() {
  _request('POST', 'users/logout', null, null,
    (status, response) => { if (status === 200) location.reload() })
}

window.addEventListener('load', () => {
  let login_button = document.getElementById('login-button')
  let login_form = document.getElementById('login-form')
  let login_dropdown = document.getElementById('login-dropdown')
  let news_publish_gui = document.getElementById('news-publish-gui')

  if (_logged_in()) {
    login_button.innerHTML = 'Выйти'
    _css_set('login-icon-img', {'visibility': 'hidden'})
    login_button_action = logout
  } else {
    login_button.innerHTML = 'Войти'
    _css_set('login-icon-img', {'visibility': 'visible'})
    login_button_action = toggle_login_dropdown
    login_form.onsubmit = login
  }

  let prom_button = document.getElementById('prom')

  prom_button.addEventListener('click', () => {
    if (_css_get('prom-dropdown', 'display') !== 'block') {
      _css_set('prom-dropdown', {'display': 'block'})
      _css_set('login-dropdown', {'display': 'none'})
    } else {
      _css_set('prom-dropdown', {'display': 'none'})
    }
  })

  /* Page is ready */
  document.body.style.opacity = '1'
})