const UI_HTML = '<div class="edit-ui lhs initially-disabled">\n<img src="img/zondicons/edit-pencil.svg" class="icon" onclick="EditBox.toggleMode(this.parentNode)">\n<img src="img/zondicons/save-disk.svg" class="icon" onclick="EditBox.submitUpdate(this.parentNode.parentNode)">\n</div>',
MARDKOWN_HTML = '<div class="markdown"'
+ ' onmouseover="EditBox.onmouseover(this)"'
+ ' onclick="EditBox.onclick(this)"'
+ ' onmouseout="EditBox.onmouseout(this)">',
AREA_HTML = '<textarea class="edit-area initially-disabled"></textarea>',
LOADING_HTML = ' <div class="loading initially-disabled">Загрузка...</div>'

const EditBox = {
  converter: new showdown.Converter(),
  ACTIVE_EDITS : {},
  EDIT_STATUS: Object.freeze({
    'UI_HIDDEN': 0,
    'UI_SHOWN': 1,
    'EDIT_IN_PROGRESS': 2
  }),

  onmouseover: (element) => {
    if (_logged_in_as('admin') || _logged_in_as('editor')) {
      _css_set(element, {'background': '#eeeeee', 'cursor': 'pointer'})
    }
  },

  onmouseout: (element) => {
    if (_logged_in_as('admin') || _logged_in_as('editor')) {
      _css_set(element, {'background': 'none', 'cursor': 'inherit'})
    }
  },

  onclick: (element) => {
    if (_logged_in_as('admin') || _logged_in_as('editor')) {
      EditBox.toggleUi(element.parentNode)
    }
  },

  toggleMode: (editUi) => {
    let editbox = editUi.parentNode,
    boxId = editbox.id,
    box = EditBox.ACTIVE_EDITS[boxId],
    icon = editUi.children[0],
    rendered = editbox.children[1],
    area = editbox.children[2],
    loading = editbox.children[3],
    renderedClasses = rendered.classList,
    areaClasses = area.classList,
    loadingClasses = loading.classList,
    status = EditBox.EDIT_STATUS,
    renderedDim = _get_dim(rendered)

    if (box.status === status.UI_SHOWN) {
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
        area.value = EditBox.ACTIVE_EDITS[boxId].markdown

        showArea(box.markdown)
      } else {
        _css_set(loading, renderedDim)
        renderedClasses.add('initially-disabled')
        loadingClasses.remove('initially-disabled')

        area.addEventListener('input', () => {
          EditBox.ACTIVE_EDITS[boxId].markdown = area.value
        })

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
    let area = editbox.children[2],
    editUi = editbox.children[0],
    icon = editUi.children[0],
    rendered = editbox.children[1],
    renderedClasses = rendered.classList,
    areaClasses = area.classList,
    loadingClasses = editbox.children[3].classList

    if (area.value.length > 0) {
      renderedClasses.add('initially-disabled')
      areaClasses.add('initially-disabled')
      loadingClasses.remove('initially-disabled')
      editUi.classList.add('initially-disabled')

      _request('PATCH', 'editbox/source', {'Content-type': 'application/json'}, {'boxId': btoa(editbox.id), 'md': area.value}, (status, response) => {
        if (status === 200) {

          icon.src = 'img/zondicons/edit-pencil.svg'
          loadingClasses.add('initially-disabled')
          areaClasses.add('initially-disabled')
          renderedClasses.remove('initially-disabled')

          rendered.innerHTML = EditBox.converter.makeHtml(area.value)
          EditBox.ACTIVE_EDITS[editbox.id].status = EditBox.EDIT_STATUS.UI_HIDDEN
        } else {
          // TODO(aolo2): error handling
        }
      })
    }
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

function htmlToElement(html) {
  var template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}

function loadEditboxes() {
 let boxes = document.getElementsByClassName('editbox')
 Array.prototype.forEach.call(boxes, (box) => {
  box.appendChild(htmlToElement(UI_HTML))
  box.appendChild(htmlToElement(MARDKOWN_HTML))
  box.appendChild(htmlToElement(AREA_HTML))
  box.appendChild(htmlToElement(LOADING_HTML))

  let ui = box.children[0],
  md = box.children[1],
  area = box.children[2],
  loading = box.children[3]

    // NOTE(aolo2): hide md untill loaded
    md.classList.add('initially-disabled')
    ui.classList.add('initially-disabled')
    area.classList.add('initially-disabled')
    loading.classList.remove('initially-disabled')

    _request('GET', 'editbox', null, {'boxId': btoa(box.id)}, (status, response) => {
      if (status === 200) {
        md.innerHTML = JSON.parse(response).md
        md.classList.remove('initially-disabled')
        loading.classList.add('initially-disabled')
      } else {
        // TODO(aolo2): error handling
      }
    })
  })
}

window.addEventListener('load', () => {
  EditBox.converter.setOption('noHeaderId', true)
  loadEditboxes()
})