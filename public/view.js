init = () => {

  console.log(navigator)

  let loggedInView = (document.cookie.indexOf('SESSIONID') !== -1)
  let login_link = document.getElementById('login-link')
  let login_form = document.getElementById('login-form')

  console.log(document.cookie)

  if (!loggedInView) {
    login_link.innerHTML = 'Войти'
    login_link.title = "Войти"
    login_link.onclick = null
  } else {
    login_link.innerHTML = 'Выйти'
    login_link.title = "Выйти"
    login_link.onclick = () => {
      let xhttp = new XMLHttpRequest()
      xhttp.open('POST', 'http://localhost:3000/logout', true)
      xhttp.send()
      return true
    }
  }

  if (login_form) {
    login_form.onsubmit = () => {
      let xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status == 200) {
              window.location.href = 'http://localhost:3000'
            } else if (xhttp.status === 401) {
              document.getElementById('server-message').innerHTML = 'Неверный логин и/или пароль'
            } else {
              document.getElementById('server-message').innerHTML = 'Ошибка сервиса авторизации'
            }
        }
      }

      const login = document.getElementById('login').value
      const pass = document.getElementById('password').value

      if (login && pass) {
        xhttp.open('POST', 'http://localhost:3000/login', true)
        xhttp.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pass))
        xhttp.send()
      }

      return false
    }
  }

  document.body.style.display = 'block'
}

window.onload = init