window.addEventListener('load', () => {
  let ui_view = 100
  let newsfeed = document.getElementById('newsfeed')
  
  if (document.cookie) {
   ui_view = parseInt(document.cookie.split('=')[1])
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
          new Date(article.timestamp).toLocaleString() + '</div>' +
          article.body + '</div>')
        })
      } else if (xhttp.status === 401) {
        newsfeed.innerHTML = 'У вас недостаточно прав для просмотра новостей'
      }
    }
  }

  xhttp.open('GET', server + 'news', true)
  xhttp.send()

  if (ui_view <= 1) {
    let publish = document.getElementById('publish')
    let submit_news = document.getElementById('submit-news')

    if (submit_news) {
      submit_news.onclick = () => {
        xhttp.onreadystatechange = () => { location.reload() }
        xhttp.open('POST', server + 'news', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify({'news': document.getElementById('news-area').value}))
      }
    }

   /* document.getElementById('show-hide-publish').onclick = () => {
      if ()
    }*/

    publish.style.display = 'block'
  }
})
