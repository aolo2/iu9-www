function get_article_source(article_id) {
  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const source = JSON.parse(xhttp.responseText)
        console.log(source)
      } else {

      }
    }
  }

  xhttp.open('GET', server + 'news/edit', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify({'article_id': article_id}))
}

function submit_news() {
  const header = document.getElementById('textarea-header').value
  const body = document.getElementById('textarea-body').value
  const is_public = document.getElementById('is-public').checked

  // let xhttp = new XMLHttpRequest()
  // xhttp.open('POST', 'news', true)
  // xhttp.send()
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

window.addEventListener('load', () => {
  let xhttp_news = new XMLHttpRequest()

  xhttp_news.onreadystatechange = () => {
    if (xhttp_news.readyState === 4) {
      if (xhttp_news.status === 200) {
        const news_array = JSON.parse(xhttp_news.responseText)
        news_array.forEach((article) => {
          console.log(article)
        })
      } else if (xhttp_news.status === 401) {
        newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    }
  }

  xhttp_news.open('GET', server + 'news/public', true)
  xhttp_news.send()

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
