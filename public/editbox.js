const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const SERVER = 'http://localhost:3000/'
let COOKIES = {}

// TODO(aolo2): убрать
function cl(a) {
  console.log(a)
}

// TODO(aolo2): убрать
function _css_set(element, properties) {
  Object.keys(properties).forEach((key) => {
    element.style[key] = properties[key]
  })
}

// TODO(aolo2): убрать
function _css_get(element, property) {
  const style = window.getComputedStyle(element)
  return style.getPropertyValue(property)
}

// TODO(aolo2): убрать
function _get_dim(item) {
  const rect = item.getBoundingClientRect()
  return {'width': Math.round(rect.width), 'height': Math.round(rect.height)}
}

function _request(method, url, headers, data, callback) {
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
      xhttp.send(JSON.stringify(data))
    }
  } else {
    callback(400, 'unknown method: ' + method)
  }
}

const EditBox = {
  converter: new showdown.Converter(),
  ACTIVE_EDITS : {},
  EDIT_STATUS: Object.freeze({
    'UI_HIDDEN': 0,
    'UI_SHOWN': 1,
    'EDIT_IN_PROGRESS': 2
  }),

  toggleMode: (edit_ui) => {
    let editbox = edit_ui.parentNode,
    boxId = editbox.id,
    box = EditBox.ACTIVE_EDITS[boxId],
    icon = edit_ui.children[0],
    rendered = editbox.children[1],
    area = editbox.children[2],
    loading = editbox.children[3],
    renderedClasses = rendered.classList,
    areaClasses = area.classList,
    loadingClasses = loading.classList,
    status = EditBox.EDIT_STATUS,
    renderedDim = _get_dim(rendered)

    if (box.status === status.UI_SHOWN) {
      // TODO: loading

      let showArea = (md) => {
        _css_set(area, renderedDim)
        area.value = md
        icon.src = 'img/zondicons/view-show.svg'
        areaClasses.remove('initially-disabled')
        loadingClasses.add('initially-disabled')
        box.status = status.EDIT_IN_PROGRESS
      }

      // NOTE(aolo2): markdown is being edited, get from dict
      if ('markdown' in box) {
        renderedClasses.add('initially-disabled')
        showArea(box.markdown)
      } else {
        _css_set(loading, renderedDim)
        renderedClasses.add('initially-disabled')
        loadingClasses.remove('initially-disabled')

        _request('GET', 'editbox/source', null, {'boxId': btoa(boxId)}, (status, response) => {
          if (status === 200) {
            const md = JSON.parse(response).md
            box.markdown = md
            showArea(md)
          } else {
            // TODO: error handling
          }
        })
      }
    } else {
      icon.src = 'img/zondicons/edit-pencil.svg'
      areaClasses.add('initially-disabled')
      renderedClasses.remove('initially-disabled')
      rendered.innerHTML = EditBox.converter.makeHtml(area.value)
      box.status = status.UI_SHOWN
    }
  },

  submitUpdate: (editbox) => {
  },

  toggleUi: (editbox) => {
    const boxClasses = editbox.children[0].classList,
    boxId = editbox.id,
    status = EditBox.EDIT_STATUS

    if (!(boxId in EditBox.ACTIVE_EDITS)) {
      EditBox.ACTIVE_EDITS[boxId] = {
        'status': EditBox.EDIT_STATUS.UI_HIDDEN,
      }
    }

    if (EditBox.ACTIVE_EDITS[boxId].status === status.UI_HIDDEN) {
      boxClasses.remove('initially-disabled')
      EditBox.ACTIVE_EDITS[boxId].status = status.UI_SHOWN
    } else {
      boxClasses.add('initially-disabled')
      EditBox.ACTIVE_EDITS[boxId].status = status.UI_HIDDEN
    }

  }
}

window.addEventListener('load', () => {
  EditBox.converter.setOption('noHeaderId', true)
})