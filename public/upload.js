function addFileLink(filelistElement, filename, link) {
  _request('PATCH', 'events',
    {'Content-type': 'application/json'},
    {'add': {'file': filename}}, (status, response) => {
      if (status === 200) {
        filelistElement.innerHTML += '<a href=\"' + link + '\">' + filename + '</a>'
      } else {
        // TODO(aolo2): error handling
      }
    })
}

function uploadFile(form, callback) {
  let formData = new FormData()
  formData.append('file', form.children[0].files[0])

  _request('POST', 'files/upload', null, formData, (status, response) => {
    if (status === 200) {
      const data = JSON.parse(response)
      callback(status, data)
    } else {
      callback(status)
    }

    return false
  }, true)
}