function login(form) {
  let serverMessage = gelid('server-message'),
  header = {'Authorization': 'Basic ' + btoa(form.children[0].value + ':' + form.children[1].value)}

  _request('POST', 'users/login', header, null,
    (status, response) => {
      if (status === 200) {
        _css_set(serverMessage, {'display': 'none'})
        location.reload()
      } else if (status === 401) {
        _css_set(serverMessage, {'display': 'block'})
        serverMessage.innerHTML = 'Неверный логин и/или пароль'
      } else {
        _css_set(serverMessage, {'display': 'block'})
        serverMessage.innerHTML = 'Ошибка сервиса авторизации'
      }
    })

  return false
}

function logout() {
  _request('POST', 'users/logout', null, null,
    (status, response) => { if (status === 200) location.reload() })
}

function toggleDropdown(dropdown, hideOther, otherDropdown) {
  if (typeof dropdown === 'string') { dropdown = gelid(dropdown) }
  if (hideOther && typeof otherDropdown === 'string') { otherDropdown = gelid(otherDropdown) }

  if (dropdown.classList.contains('initially-disabled')) {
    dropdown.classList.remove('initially-disabled')
    if (hideOther) { otherDropdown.classList.add('initially-disabled') }
  } else {
    dropdown.classList.add('initially-disabled')
  }
}

window.addEventListener('load', () => {
  let page_grid = gelid('page-grid')

  /* Load menu */
  _request('GET', 'menu.html', null, null, (status, text) => {
    if (status !== 200) {
      document.write('something went wrong :(')
    } else {
      gelid('menu').innerHTML = text

      let loginButton = gelid('login-button')
      if (_logged_in()) {
        loginButton.innerHTML = 'Выйти'
        loginButton.onclick = () => { return logout(); return false }
        _css_set('login-icon-img', {'visibility': 'hidden'})
      } else {
        loginButton.innerHTML = 'Войти'
        loginButton.onclick = () => { toggleDropdown('login-dropdown', true, 'prom-dropdown'); return false }
        _css_set('login-icon-img', {'visibility': 'visible'})
      }

      if(_logged_in_as('admin')) {
        gelid('manage-link').classList.remove('initially-hidden')
      }
    }
  })
})