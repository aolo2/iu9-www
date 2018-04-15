const server = 'http://localhost:3000/'

window.addEventListener('load', () => {
  let ui_view = 100
  
  if (document.cookie) {
   ui_view = parseInt(document.cookie.split('=')[1])
  }

  let login_link = document.getElementById('login-link')

  if (ui_view === 100) {
    login_link.innerHTML = 'Войти'
    login_link.title = "Войти"
    login_link.onclick = null
  } else {
    login_link.innerHTML = 'Выйти'
    login_link.title = "Выйти"
    login_link.onclick = () => {
      let xhttp = new XMLHttpRequest()
      xhttp.open('POST', server + 'logout', true)
      xhttp.send()
      return true
    }
  }

  document.body.style.display = 'block'
})

