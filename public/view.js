window.addEventListener('load', () => {
  /* Set menu view */
  /* : Cookies */

  /* Menu hover/click events */
  let prom_button = document.getElementById('prom')
  let prom_dropdown = document.getElementById('prom-dropdown')
  let login_button = document.getElementById('login-button')
  let login_dropdown = document.getElementById('login-dropdown')

 /* TODO(aolo2): hide popups when clicked outside
 
  const hide_popups = (event) => {
    if (!hidden(login_dropdown) && event.target.closest('#login-dropdown') === null)
      show_or_hide(login_dropdown, false)
    if (!hidden(prom_dropdown) && event.target.closest('#prom-dropdown') === null)
      show_or_hide(prom_dropdown, false)
  }*/

  function show_or_hide(item, show) {
    item.style.display = show ? 'block' : 'none'
  }

  function hidden(item) {
    return item.style.display !== 'block'
  }

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

  if (login_button && login_dropdown) {
    login_button.addEventListener('click', () => {
      if (hidden(login_dropdown)) {
        show_or_hide(login_dropdown, true)
        if (prom_dropdown) 
          show_or_hide(prom_dropdown, false)
      } else {
        show_or_hide(login_dropdown, false)
      }
    })
  }
  /*************/

  /* Page is ready */
})