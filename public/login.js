window.addEventListener('load', () => {
  let login_form = document.getElementById('login-form')

  if (login_form) {
    login_form.onsubmit = () => {
      let xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              window.location.href = server + 'news.html'
            } else if (xhttp.status === 401) {
              document.getElementById('server-message').innerHTML = 'Неверный логин и/или пароль'
            } else {
              document.getElementById('server-message').innerHTML = 'Ошибка сервиса авторизации'
            }
        }
      }

      const login = document.getElementById('login').value
      const pass = document.getElementById('password').value

      xhttp.open('POST', server + 'login', true)
      xhttp.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pass))
      xhttp.send()

      return false
    }
  }
})