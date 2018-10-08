const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const SERVER = 'http://localhost:3000/'
let COOKIES = {}

function _get_cookies() {
  const pairs = document.cookie.split(";")
  let cookies = {}

  for (let pair of pairs) {
    pair = pair.split("=")
    if (pair.length == 2) {
      cookies[(pair[0] + '').trim()] = unescape(pair[1])
    }
  }

  return cookies
}

function _request(method, url, headers, data, callback, isFile) {
  if (METHODS.indexOf(method) != -1) {
    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        callback(xhttp.status, xhttp.responseText)
      }
    }

    if (method === 'GET' && data !== null) {
      let keys = Object.keys(data)
      url += ('?' + keys[0] + '=' + data[keys[0]])
      for (let i = 1; i < keys.length; ++i) {
        url += ('&' + keys[i] + '=' + data[keys[i]])
      }
    }

    xhttp.open(method, SERVER + url, true)

    if (headers !== null) {
      Object.keys(headers).forEach((key) => {
        xhttp.setRequestHeader(key, headers[key]);
      })
    }

    if (method == 'GET' || data === null) {
      xhttp.send();
    } else {
      xhttp.send(isFile ? data : JSON.stringify(data))
    }
  } else {
    callback(400, 'unknown method: ' + method)
  }
}

function _css_set(element, properties) {
  if (typeof element === 'string') {
    element = document.getElementById(element)
  }

  Object.keys(properties).forEach((key) => {
    element.style[key] = properties[key]
  })
}

function _css_get(element, property) {
  if (typeof element === 'string') {
    element = document.getElementById(element)
  }

  const style = window.getComputedStyle(element)
  return style.getPropertyValue(property)
}

function _get_dim(element) {
  const rect = element.getBoundingClientRect()
  return {'width': Math.round(rect.width), 'height': Math.round(rect.height)}
}

function _logged_in() {
  let ui_view = []
  if ('UIVIEW' in COOKIES) {
    ui_view = COOKIES['UIVIEW'].split(',')
  } else {
    return false
  }

  return ui_view.length > 0
}

function _logged_in_as(role) {
  let ui_view = []
  if ('UIVIEW' in COOKIES) {
    ui_view = COOKIES['UIVIEW'].split(',')
  } else {
    return false
  }

  return ui_view.indexOf(role) != -1
}

function addOptionToSelect(select, optionValue, optionHTML) {
  if (typeof select === 'string') {
    select = document.getElementById(select)
  }

  let opt = document.createElement('option')
  opt.value = optionValue
  opt.innerHTML = optionHTML
  select.appendChild(opt)
}

window.addEventListener('load', () => {
  COOKIES = _get_cookies()
  console.log('\"Мы не готовим кодировщиков и специалистов по интерфейсам.Наша цель — подготовка элитных программистов для решения сложных задач для высокотехнологичных областей науки и техники.\"')
})