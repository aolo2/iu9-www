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
  // return false
}

window.addEventListener('load', () => {
  let ui_view = 'NONE'
  let newsfeed = document.getElementById('newsfeed')
  
  if (document.cookie) {
   ui_view = document.cookie.split('=')[1]
  }

  let xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const news_array = JSON.parse(xhttp.responseText)
        news_array.forEach((article) => {
         newsfeed.innerHTML += 
         ('<div class="article">' +
          '<div class="article-header">' +
          article.author + ' ' +
          new Date(article.timestamp).toLocaleString() + 
          ' <a href="#edit" onclick="get_article_source(\'' + article._id + '\')" id="edit-link">редактировать</a> ' +
          '</div>' +
          article.html + '</div>')
        })
      } else if (xhttp.status === 401) {
        newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    }
  }

  if (ui_view === 'NONE') {
    xhttp.open('GET', server + 'news/public', true)
    xhttp.send()
  } else {
    xhttp.open('GET', server + 'news', true)
    xhttp.send()
  }

  if (ui_view.includes('admin') || ui_view.includes('editor')) {
    let publish = document.getElementById('publish')
    let submit_news = document.getElementById('submit-news')
    // let edit_link = document.getElementById('edit-link')

    // if (edit_link) {
    //   edit_link.style.display = 'inline'
    // }

    if (submit_news) {
      submit_news.onclick = () => {
        xhttp.onreadystatechange = () => { location.reload() }
        xhttp.open('POST', server + 'news', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify({'public': true, 'source': document.getElementById('news-area').value}))
      }
    }

   /* document.getElementById('show-hide-publish').onclick = () => {
      if ()
    }*/

    publish.style.display = 'block'
  }
})
