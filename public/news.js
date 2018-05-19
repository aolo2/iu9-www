let textareaInitialHeight = null
let current_edit_id = null

function get_article_source(article_id, callback) {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        callback(null, JSON.parse(xhttp.responseText))
      } else {
        callback(new Error('could not get source'))
      }
    }
  }

  xhttp.open('GET', server + 'news/edit?article_id=' + article_id, true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send()
}

function submit_news() {
  const header = document.getElementById('textarea-header').value
  const body = document.getElementById('textarea-body').value
  const is_public = document.getElementById('is-public').checked

  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        location.reload()
      } else {
        // TODO(aolo2): error, parse
      }
    }
  }

  let payload = {
    'header': header,
    'source': body,
    'public': is_public
  }

  if (current_edit_id)
    payload.article_id = current_edit_id

  xhttp.open('POST', 'news', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify(payload))

  current_edit_id = null
}

function update_submit_button_action(available) {
  let submit_button = document.getElementById('submit-news')
  let submit_news_icon = document.getElementById('submit-news-icon')

  if (available) {
    submit_button.style.color = '#222222'
    submit_button.style.cursor = 'pointer'
    submit_news_icon.src = 'img/zondicons/send222.svg'    
    submit_button.onclick = submit_news
  } else {
    submit_button.style.color = '#888888'
    submit_button.style.cursor = 'default'
    submit_news_icon.src = 'img/zondicons/sendAAA.svg'
    submit_button.onclick = () => {}
  }
}

function handle_ispublic_checkbox() {
  const is_public = document.getElementById('is-public').checked
  let is_public_label = document.getElementById('is-public-label')
  if (is_public) {
    is_public_label.style.color = '#222222'
  } else {
    is_public_label.style.color = '#888888'
  }
}

function delete_article(article_id) {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        location.reload()
      } else {
        // TODO(aolo2): handle errors
      }
    }
  }

  xhttp.open('DELETE', server + 'news', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify({'article_id': article_id}))
}

function edit_article(article_id) {
  get_article_source(article_id, function (err, src) {
    if (err) {
      // TODO(aolo2): handle errors
    } else {
      let edit_header_textarea = document.getElementById('textarea-header')
      let edit_body_textarea = document.getElementById('textarea-body')
      let is_public_checkbox = document.getElementById('is-public')

      edit_header_textarea.value = src.header
      edit_body_textarea.value = src.markdown
      is_public_checkbox.checked = src.public

      current_edit_id = article_id

      update_submit_button_action(true)
      handle_ispublic_checkbox()
    }
  })
}

function gen_edit_button(article_id) {
  if (ui_view.includes('admin') || ui_view.includes('editor')) {
    return (
      '<img class="edit-icon"'
      + 'title="Редактировать новость"'
      + 'src="img/zondicons/edit-pencil.svg"'
      + 'onclick=(edit_article(\'' + article_id + '\'))>'
      )
  }
  return ''
}

function gen_delete_button(article_id) {
  if (ui_view.includes('admin') || ui_view.includes('editor')) {
    return (
      '<img class="edit-icon"'
      + 'title="Удалить новость"'
      + 'src="img/zondicons/trash.svg"'
      + 'onclick=(delete_article(\'' + article_id + '\'))>'
      )
  }
  return ''
}

window.addEventListener('load', () => {
  let xhttp = new XMLHttpRequest()
  let newsfeed = document.getElementById('newsfeed')
  textareaInitialHeight = document.getElementById('textarea-body').scrollHeight

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const news_array = JSON.parse(xhttp.responseText)
        news_array.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        news_array.forEach((article) => {
          newsfeed.innerHTML += (
            '<div class="article">'
            + '<h2>' + article.header.toLocaleString()
            + gen_edit_button(article._id)
            + gen_delete_button(article._id) + '</h2>'
            + '<div class="footnote">'
            + ('author' in article ? article.author + ' | ' : '')
            + new Date(article.timestamp).toLocaleString() + '</div>'
            + article.html
            + '</div>'
            )
        })
      } else if (xhttp.status === 401) {
        // newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    }
  }

  xhttp.open('GET', server + 'news/public', true)
  xhttp.send()

  let textarea_header = document.getElementById('textarea-header')
  let textarea_body = document.getElementById('textarea-body')
  let is_public_checkbox = document.getElementById('is-public')

  textarea_header.addEventListener('input', () => {
    update_submit_button_action(textarea_header.value.length > 0 && textarea_body.value.length > 0)
  })

  textarea_body.addEventListener('input', () => {
    update_submit_button_action(textarea_header.value.length > 0 && textarea_body.value.length > 0)
  })

  is_public_checkbox.onclick = handle_ispublic_checkbox
})
