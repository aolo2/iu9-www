let textareaInitialHeight = null

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

  xhttp.open('POST', 'news', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify(
  {
    'article_header': header,
    'source': body,
    'public': is_public
  })
  )
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

/*function update_textarea_height(textarea) {
  const want = textarea.scrollHeight
  const is = textarea.clientHeight

  console.log(want, is, textarea.style.height)

  if (want > is) {
    textarea.style.height = is + 30
  } else if (want < textarea.style.height && want >= textareaInitialHeight - 30) {
    textarea.style.height = want - 30
  }
}*/

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
      let article_dom = document.getElementById(article_id)
      article_dom.innerHTML = '<textarea rows="10">'
      + src.markdown
      + '</textarea>'
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
            '<div class="article" id="' + article._id + '">'
            + '<h2>' + article.header.toLocaleString()
            + gen_edit_button(article._id)
            + gen_delete_button(article._id) + '</h2>'
            + '<div class="footnote">' 
            + ('author' in article ? article.author + ' | ' : '')
            + new Date(article.timestamp).toLocaleString() + '</div>'
            + '<p>' + article.html + '</p>'
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
