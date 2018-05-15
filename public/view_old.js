const server = 'http://localhost:3000/'

window.addEventListener('load', () => {
  let ui_view = 'NONE'
  
  if (document.cookie) {
   ui_view = document.cookie.split('=')[1]
  }

  let login_link = document.getElementById('login-link')

  if (ui_view === 'NONE') {
    login_link.innerHTML = 'Войти'
    login_link.title = "Войти"
    login_link.onclick = null
  } else {
    login_link.innerHTML = 'Выйти'
    login_link.title = "Выйти"
    login_link.onclick = () => {
      let xhttp = new XMLHttpRequest()
      xhttp.open('POST', server + 'users/logout', true)
      xhttp.send()
      return true
    }
  }

  if (ui_view === 'admin') {
    let manage_link = document.getElementById('manage-link')

    if (manage_link) {
      manage_link.style.display = 'inline-block'
    }
  }

  // TODO(aolo2): автоматическая генерация меню
  let abitur_item = document.getElementById('abitur')
  let abitur_dropdown = document.getElementById('abitur-drop')

  if (abitur_item) {
    abitur_item.onclick = () => {
      console.log(abitur_dropdown.style.display)
      abitur_dropdown.style.display = 
      (abitur_dropdown.style.display === 'block') ? 'none' : 'block';
    }
  }

  document.body.style.display = 'block'
})

