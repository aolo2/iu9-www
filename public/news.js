let newsIdSet = new Set()
let newsSet = new Set()

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

function addArticlesToSet(articles) {
  articles.forEach((article) => {
    if (!newsIdSet.has(article._id)) {
      newsSet.add(article)
      newsIdSet.add(article._id)
    }
  })
}

function submitArticle() {
  let data = {
    'header': gelid('article-header').value.trim(),
    'source': gelid('article-body').value.trim()
  }

  if (data.header.length === 0 || data.source.length === 0) {
    return
  }

  let target = gelid('target-audience').value

  if (target === '1') {
    data.public = true
  } else if (target === '3') {
    data.target = 'tutor'
    data.public = false
  } else {
    data.public = false
    data.target = 'student'
    data.studentGroup = gelid('user-group').value
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
  let sButton = gelid('submit-news')
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

function onTargetChange() {
  let val = gelid('target-audience').value
  let groupSelectClasses = gelid('user-group').classList
  console.log(val)
  if (val === '2') {
    groupSelectClasses.remove('initially-disabled')
  } else {
    groupSelectClasses.add('initially-disabled')
  }
}

function addEventLink(parent, event, id) {
  let eventElement = document.createElement('div')
  eventElement.innerHTML = '<a href="event.html?id=' + id + '">' +
  event.subject +  ' - ' + event.type + '</a>'
  parent.appendChild(eventElement)
}

function drawArticles(articles) {
  let newsfeed = gelid('newsfeed')
  articles.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  articles.forEach((article) => {
    let newArticle = createDiv(['news-article'])
    let naHeader = createDiv(['news-header'])
    let naHeaderFootnote = createDiv(['footnote'])
    let naBody = createDiv(['editbox', 'rhs'], atob(article.boxId))

    naHeader.innerHTML = '<h2>' + article.header + '</h2>'
    naHeaderFootnote.innerHTML = article.author + ' | ' + new Date(article.timestamp).toLocaleString()
    naHeader.appendChild(naHeaderFootnote)
    newArticle.appendChild(naHeader)
    newArticle.appendChild(naBody)
    newsfeed.appendChild(newArticle)
  })
  loadEditboxes()
}

function loadNews(loadPrivate) {
  _request('GET', 'news/public', null, null,
    (status, response) => {
      if (status === 200) {
        addArticlesToSet(JSON.parse(response))
        if (loadPrivate) { loadPrivateNews() }
        else { showNews() }
      } else if (status === 401) {
        // newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    })
}

function loadPrivateNews() {
  _request('GET', 'news', null, null,
    (status, response) => {
      if (status === 200) {
        addArticlesToSet(JSON.parse(response))
        showNews()
      } else if (status === 401) {
        // newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    })
}

function showNews() {
  drawArticles(Array.from(newsSet))
}

function loadEvents() {
  _request('GET', 'users/events', null, null, (status, response) => {
    if (status === 200) {
      const events = JSON.parse(response).events
      let myEvents = gelid('my-events')

      Object.keys(events).forEach((eventId) => {
        addEventLink(myEvents, events[eventId], eventId)
      })

      if (Object.keys(events).length > 0) {
        myEvents.classList.remove('initially-disabled')
      }
    } else {
      // TODO(aolo2): error handling
    }
  })
}

function showFullGui(gui) {
  _css_set(gui, {'height': 'auto'})
  gui.children[1].classList.remove('initially-disabled')
  gui.children[2].classList.remove('initially-disabled')
}

function showShortGui(gui) {
  _css_set(gui, {'height': '70px'})
  gui.children[1].classList.add('initially-disabled')
  gui.children[2].classList.add('initially-disabled')
}

window.addEventListener('load', () => {

  loadNews(_logged_in())

  if (_logged_in()) {
    loadEvents()
  }

  if (_logged_in_as('admin') || _logged_in_as('editor')) {
    gelid('news-gui').classList.remove('initially-disabled')
  }


  let aHeader = gelid('article-header')
  let aBody = gelid('article-body')
  let newsGui = gelid('news-gui')

  aHeader.addEventListener('input', () => {
    updateSubmitStatus(aHeader.value, aBody.value)
  })

  aBody.addEventListener('input', () => {
    updateSubmitStatus(aHeader.value, aBody.value)
  })

  aHeader.onfocus = () => {
    showFullGui(newsGui)
  }

  aHeader.onblur = (event) => {
    console.log(event.target)
    if (aHeader.value.length === 0) {
      showShortGui(newsGui)
    }
  }
})
