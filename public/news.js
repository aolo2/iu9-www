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

function submitArticle() {
  let data = {
    'header': document.getElementById('article-header').value.trim(),
    'body': document.getElementById('article-body').value.trim()
  }

  if (data.header.length === 0 || data.body.length === 0) {
    return
  }

  let target = document.getElementById('target-audience').value

  if (target === '1') {
    data.target = 'public'
  } else if (target === '3') {
    data.target = 'tutors'
  } else {
    data.target = 'students'
    data.studentGroup = document.getElementById('user-group').value
  }

  _request('POST', 'news', {'Content-type': 'application/json'}, data,
    (status, text) => {
      if (status === 200) {
        location.reload()
      } else if (status === 400) {

      } else {
        // TODO(aolo2): error, parse
      }
    })
}

function updateSubmitStatus(headerText, bodyText) {
  let sButton = document.getElementById('submit-news')
  if (headerText.trim().length > 0 && bodyText.trim().length > 0) {
    sButton.classList.remove('inactive')
    sButton.classList.add('active')
    sButton.onclick = submitArticle
  } else {
    sButton.classList.remove('active')
    sButton.classList.add('inactive')
    sButton.onclick = null
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

function onTargetChange() {
  let val = document.getElementById('target-audience').value
  let groupSelectClasses = document.getElementById('user-group').classList
  console.log(val)
  if (val === '2') {
    groupSelectClasses.remove('initially-disabled')
  } else {
    groupSelectClasses.add('initially-disabled')
  }
}

function addEventLink(parent, event) {
  let eventElement = document.createElement('div')
  eventElement.innerHTML = '<a href="event.html?id=' + event._id + '">' +
  event.subject +  ' - ' + event.type + '</a>'
  parent.appendChild(eventElement)
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

  _request('GET', 'users/events', null, null, (status, response) => {
    if (status === 200) {
      const events = JSON.parse(response).events
      let myEvents = document.getElementById('my-events')

      events.forEach((event) => {
        addEventLink(myEvents, event)
      })

      if (events.length > 0) {
        myEvents.classList.remove('initially-disabled')
      }
    } else {
      // TODO(aolo2): error handling
    }
  })

  if (_logged_in_as('admin') || _logged_in_as('editor')) {
    document.getElementById('news-gui').classList.remove('initially-disabled')
  }


  let aHeader = document.getElementById('article-header')
  let aBody = document.getElementById('article-body')

  aHeader.addEventListener('input', () => {
    updateSubmitStatus(aHeader.value, aBody.value)
  })

  aBody.addEventListener('input', () => {
    updateSubmitStatus(aHeader.value, aBody.value)
  })

  // is_public_checkbox.onclick = handle_ispublic_checkbox
})
