const server = 'http://localhost:3000/'
let ui_view = []

function show_or_hide(item, show) {
  item.style.display = show ? 'block' : 'none'
}

function hidden(item) {
  return item.style.display !== 'block'
}

function login() {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        location.reload()
      } else if (xhttp.status === 401) {
        document.getElementById('server-message').innerHTML = 'Неверный логин и/или пароль'
      } else {
        document.getElementById('server-message').innerHTML = 'Ошибка сервиса авторизации'
      }
    }
  }

  const login = document.getElementById('login-value').value
  const pass = document.getElementById('password-value').value

  xhttp.open('POST', server + 'users/login', true)
  xhttp.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pass))
  xhttp.send()

  return false
}

function toggle_login_dropdown() {
  let login_dropdown = document.getElementById('login-dropdown')
  let prom_dropdown = document.getElementById('prom-dropdown')

  if (hidden(login_dropdown)) {
    show_or_hide(login_dropdown, true)
    if (prom_dropdown) 
      show_or_hide(prom_dropdown, false)
  } else {
    show_or_hide(login_dropdown, false)
  }
}

function logout() {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        location.reload()
      } else if (xhttp.status === 403) {
        document.getElementById('server-message').innerHTML = 'Сессия невалидна'
      } else {
        document.getElementById('server-message').innerHTML = 'Ошибка сервиса авторизации'
      }
    }
  }

  xhttp.open('POST', server + 'users/logout', true)
  xhttp.send()

  return false
}

function login_button_action() {
  console.log('123123')
}

window.addEventListener('load', () => {
  /* : Cookies */
  if (document.cookie) {
    ui_view = document.cookie.split('=')[1].split(",")
  }

  let login_button = document.getElementById('login-button')
  let login_button_text = document.getElementById('login-button-text')
  let login_form = document.getElementById('login-form')
  let login_dropdown = document.getElementById('login-dropdown')
  let news_publish_gui = document.getElementById('news-publish-gui')

  if (ui_view.length > 0) {
    /* Logged in */
    if (login_button_text) {
     login_button_text.innerHTML = 'Выйти'
     login_button_action = logout
    }

    if (news_publish_gui) {
      news_publish_gui.style.display = 'block'
    }
 } else {
  if (login_button_text) { 
    login_button_text.innerHTML = '<img src="img/zondicons/user.svg" height="13px"> Войти' 
    login_form.onsubmit = login
  }

  if (login_button && login_dropdown) {
    login_button_action = toggle_login_dropdown
  }
}

/* Menu hover/click events */
let prom_button = document.getElementById('prom')
let prom_dropdown = document.getElementById('prom-dropdown')

 /* TODO(aolo2): hide popups when clicked outside
 
  const hide_popups = (event) => {
    if (!hidden(login_dropdown) && event.target.closest('#login-dropdown') === null)
      show_or_hide(login_dropdown, false)
    if (!hidden(prom_dropdown) && event.target.closest('#prom-dropdown') === null)
      show_or_hide(prom_dropdown, false)
  }*/

  /* Dropdowns */
  if (prom_button) {
    prom_button.addEventListener('click', () => {
      if (prom_dropdown) {
        if (hidden(prom_dropdown)) {
          show_or_hide(prom_dropdown, true)
          if (login_dropdown) 
            show_or_hide(login_dropdown, false)
        } else {
          show_or_hide(prom_dropdown, false)
        }
      }
    })
  }
  /*************/

  /* Page is ready */
  document.body.style.opacity = '1'
})