function uploadFile(form) {
  let formData = new FormData()
  formData.append('file', form.children[0].files[0])

  _request('POST', 'events/file', null, formData, (status, response) => {
    if (status === 200) {
      const data = JSON.parse(response)
      console.log(data)
    } else {
      // TODO(aolo2): error handling
    }

    return false
  }, true)
}