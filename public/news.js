let current_edit_id = null

function get_article_source(article_id, callback) {
  _request('GET', 'news/edit', null, {'article_id': article_id},
    (status, text) => {
      if (status === 200) {
        callback(null, JSON.parse(text))
      } else {
        callback(new Error('could not get source'))
      }
    })
}

function submit_news() {
  const header = document.getElementById('textarea-header').value
  const body = document.getElementById('textarea-body').value
  const is_public = document.getElementById('is-public').checked

  let data = {
    'header': header,
    'source': body,
    'public': is_public
  }

  if (current_edit_id)
    data.article_id = current_edit_id

  _request('POST', 'news', {'Content-type': 'application/json'}, data,
    (status, text) => {
      if (status === 200) {
        location.reload()
      } else {
        // TODO(aolo2): error, parse
      }
    })

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
  _request('DELETE', 'news', {'Content-type': 'application/json'}, {'article_id': article_id},
    (status, text) => {
      if (status === 200) {
        location.reload()
      } else {
        // TODO(aolo2): handle errors
      }
    })
}

function edit_article(article_id) {
  get_article_source(article_id, (err, src) => {
    if (err) {
      // TODO(aolo2): handle errors
    } else {
      let edit_header_textarea = document.getElementById('textarea-header')
      let edit_body_textarea = document.getElementById('textarea-body')
      let is_public_checkbox = document.getElementById('is-public')
      let edit_form = document.getElementById('news-publish-gui')

      edit_form.style.display = 'block'
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
  if (_logged_in_as('admin')) {
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
  if (_logged_in_as('admin')) {
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
  _request('GET', 'news/public', null, null,
    (status, response) => {
      if (status === 200) {
        let newsfeed = document.getElementById('newsfeed')
        const news_array = JSON.parse(response)

        news_array.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        news_array.forEach((article) => {
          newsfeed.innerHTML += (
            '<div class="article">'
            + '<h2>' + article.header + '</h2>'
            + '<div class="footnote">'
            + ('author' in article ? article.author + ' | ' : '')
            + new Date(article.timestamp).toLocaleString() + '</div>'
            + '<div class="markdown no-edit">'
            + article.html
            + '</div></div>'
            )
        })
      } else if (status === 401) {
        // newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    })

  let textarea_header = document.getElementById('textarea-header')
  let textarea_body = document.getElementById('textarea-body')
  let is_public_checkbox = document.getElementById('is-public')
  let news_publish_gui = document.getElementById('news-publish-gui')
/*
  textarea_header.addEventListener('input', () => {
    update_submit_button_action(textarea_header.value.length > 0 && textarea_body.value.length > 0)
  })

  textarea_body.addEventListener('input', () => {
    update_submit_button_action(textarea_header.value.length > 0 && textarea_body.value.length > 0)
  })*/

  // is_public_checkbox.onclick = handle_ispublic_checkbox
})
