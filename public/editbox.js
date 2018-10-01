const converter = new showdown.Converter()
converter.setOption('noHeaderId', true)

const EDIT_STATUS = Object.freeze(
{
  "INACTIVE": 0,
  "ACITVE": 1
})

let ACTIVE_EDITS = {
  // element: {status, markdown}
}

function cl(a) {
  console.log(a)
}

function _css_set(element, properties) {
  Object.keys(properties).forEach((key) => {
    element.style[key] = properties[key]
  })
}

function _css_get(element, property) {
  const style = window.getComputedStyle(element)
  return style.getPropertyValue(property)
}

function _get_dim(item) {
  const rect = item.getBoundingClientRect()
  return {'width': Math.round(rect.width), 'height': Math.round(rect.height)}
}

function toggle_mode(edit_ui) {
  let icon = edit_ui.children[0]

  if (icon.src.includes('edit-pencil.svg')) {
    icon.src = 'img/zondicons/view-show.svg'
  } else {
    icon.src = 'img/zondicons/edit-pencil.svg'
  }

  const editbox = edit_ui.parentNode
  let area = editbox.children[2]
  let markdown = editbox.children[1]
  const markdownClasses = markdown.classList
  const areaClasses = area.classList

  _css_set(area, _get_dim(markdown))

  if (areaClasses.contains('initially-disabled')) {
    areaClasses.remove('initially-disabled')
    markdownClasses.add('initially-disabled')
  } else {
    areaClasses.add('initially-disabled')
    markdownClasses.remove('initially-disabled')
    markdown.innerHTML = converter.makeHtml(area.value)
  }
}

function submit_text(editbox) {
  cl(editbox)
}

function toggle_ui(editbox) {
  const boxClasses = editbox.children[0].classList
  if (boxClasses.contains('initially-disabled'))
    boxClasses.remove('initially-disabled')
  else
    boxClasses.add('initially-disabled')
}

window.addEventListener('load', () => {
})