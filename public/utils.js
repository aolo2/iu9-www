const Methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

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

function _request(method, url, headers, data, callback) {
  if (Methods.indexOf(method) != -1) {
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

    xhttp.open(method, url, true)

    if (headers !== null) {
      Object.keys(headers).forEach((key) => {
        xhttp.setRequestHeader(key, headers[key]);
      })
    }

    if (method == 'GET' || data === null) {
      xhttp.send();
    } else {
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(JSON.stringify(data))
    }
  } else {
    callback(400, 'unknown method: ' + method)
  }
}

function _css_set(id, properties) {
  let item = document.getElementById(id)

  Object.keys(properties).forEach((key) => {
    item.style[key] = properties[key]
  })
}

function _css_get(id, property) {
  return document.getElementById(id).style[property]
}

function _logged_in() {
  let ui_view = []
  if ('UIVIEW' in Cookies) {
    ui_view = Cookies['UIVIEW'].split(',')
  } else {
    return false
  }

  return ui_view.length > 0
}

function _logged_in_as(role) {
  let ui_view = []
  if ('UIVIEW' in Cookies) {
    ui_view = Cookies['UIVIEW'].split(',')
  } else {
    return false
  }

  return ui_view.indexOf(role) != -1
}