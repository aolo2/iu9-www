function login(form) {
  let serverMessage = document.getElementById('server-message'),
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

function toggle_login_dropdown() {
  if (_css_get('login-dropdown', 'display') !== 'block') {
    _css_set('login-dropdown', {'display': 'block'})
    _css_set('prom-dropdown', {'display': 'none'})
  } else {
    _css_set('login-dropdown', {'display': 'none'})
  }
}

window.addEventListener('load', () => {
  let page_grid = document.getElementById('page-grid')

  /* Load menu */
  _request('GET', 'menu.html', null, null, (status, text) => {
    if (status !== 200) {
      document.write('something went wrong :(')
    } else {
      setTimeout(() => {
        page_grid.innerHTML = text + page_grid.innerHTML
        let login_button = document.getElementById('login-button')

        if (_logged_in()) {
          login_button.innerHTML = 'Выйти'
          login_button.onclick = () => {
            return logout()
          }

          _css_set('login-icon-img', {'visibility': 'hidden'})
        } else {
          login_button.innerHTML = 'Войти'

          login_button.onclick = () => {
            toggle_login_dropdown()
          }

          _css_set('login-icon-img', {'visibility': 'visible'})
        }
      }, 1000) // TODO: объединить клиентский js
/*
      let login_form = document.getElementById('login-form')
      let login_dropdown = document.getElementById('login-dropdown')
      let news_publish_gui = document.getElementById('news-publish-gui')


      // Login button
        login_button_action = () => {
          if (_css_get('login-dropdown', 'display') !== 'block') {
            _css_set('login-dropdown', {'display': 'block'})
            _css_set('prom-dropdown', {'display': 'none'})
          } else {
            _css_set('login-dropdown', {'display': 'none'})
          }
        }

      }

      // Dropdowns
      let prom_button = document.getElementById('prom')
      prom_button.addEventListener('click', () => {
        if (_css_get('prom-dropdown', 'display') !== 'block') {
          _css_set('prom-dropdown', {'display': 'block'})
          _css_set('login-dropdown', {'display': 'none'})
        } else {
          _css_set('prom-dropdown', {'display': 'none'})
        }
      })*/
    }
  })
})